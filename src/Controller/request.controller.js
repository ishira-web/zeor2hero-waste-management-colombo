import Request from "../Model/request.model.js";
import mongoose from "mongoose";


/* ----------------------------- helpers ----------------------------- */
function buildFilter(query) {
  const { status, type, collectorID, dwellerID, q, dateFrom, dateTo } = query;
  const filter = {};
  if (status) filter.requestStatus = status;
  if (type) filter.requestType = type;
  if (collectorID) filter.collectorID = collectorID;
  if (dwellerID) filter.dwellerID = dwellerID;

  if (dateFrom || dateTo) {
    filter.requestDate = {};
    if (dateFrom) filter.requestDate.$gte = new Date(dateFrom);
    if (dateTo) filter.requestDate.$lte = new Date(dateTo);
  }

  if (q) {
    filter.$or = [
      { requestID: new RegExp(q, "i") },
      { userName: new RegExp(q, "i") },
      { dwellerAddress: new RegExp(q, "i") }
    ];
  }
  return filter;
}

/* ------------------------------ create ----------------------------- */
// POST /api/requests
export async function createRequest(req, res) {
  try {
    const created = await Request.create(req.body);
    return res.status(201).json({ success: true, data: created });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ success: false, message: "Duplicate requestID. Please retry." });
    }
    return res.status(400).json({ success: false, message: err.message });
  }
}

/* ------------------------------- list ------------------------------ */
// GET /api/requests
export async function getRequests(req, res) {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "10", 10), 1), 100);
    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = (req.query.sortOrder || "desc").toLowerCase() === "asc" ? 1 : -1;

    const filter = buildFilter(req.query);

    const [items, total] = await Promise.all([
      Request.find(filter).sort({ [sortBy]: sortOrder }).skip(skip).limit(limit).lean(),
      Request.countDocuments(filter)
    ]);

    return res.json({
      success: true,
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

/* ------------------------------- read ------------------------------ */
// GET /api/requests/:id   (accepts Mongo _id or requestID like "#REQ1234")
export async function getRequestById(req, res) {
  try {
    const { id } = req.params;
    let doc = null;

    if (mongoose.isValidObjectId(id)) doc = await Request.findById(id);
    if (!doc) doc = await Request.findOne({ requestID: id });

    if (!doc) return res.status(404).json({ success: false, message: "Request not found" });
    return res.json({ success: true, data: doc });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

/* ------------------------------ update ----------------------------- */
// PATCH /api/requests/:id
export async function updateRequest(req, res) {
  try {
    const { id } = req.params;
    const filter = mongoose.isValidObjectId(id) ? { _id: id } : { requestID: id };

    const payload = { ...req.body };
    if ("requestID" in payload) delete payload.requestID; // keep requestID immutable

    const updated = await Request.findOneAndUpdate(filter, payload, {
      new: true,
      runValidators: true
    });

    if (!updated) return res.status(404).json({ success: false, message: "Request not found" });
    return res.json({ success: true, data: updated });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
}

/* ------------------------- update: status only --------------------- */
// PATCH /api/requests/:id/status   { requestStatus: 'Pending'|'In Progress'|'Completed'|'Cancelled' }
export async function updateRequestStatus(req, res) {
  try {
    const { id } = req.params;
    const { requestStatus } = req.body;

    if (!requestStatus) {
      return res.status(400).json({ success: false, message: "requestStatus is required" });
    }

    const filter = mongoose.isValidObjectId(id) ? { _id: id } : { requestID: id };

    const updated = await Request.findOneAndUpdate(
      filter,
      { requestStatus },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ success: false, message: "Request not found" });
    return res.json({ success: true, data: updated });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
}

/* ------------------------------ delete ----------------------------- */
// DELETE /api/requests/:id
export async function deleteRequest(req, res) {
  try {
    const { id } = req.params;
    const filter = mongoose.isValidObjectId(id) ? { _id: id } : { requestID: id };
    const deleted = await Request.findOneAndDelete(filter);

    if (!deleted) return res.status(404).json({ success: false, message: "Request not found" });
    return res.json({ success: true, message: "Request deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

/* ----------------------------- analytics -------------------------- */
// GET /api/requests/analytics/summary
export async function getRequestsSummary(req, res) {
  try {
    const [byStatus, byType, total] = await Promise.all([
      Request.aggregate([{ $group: { _id: "$requestStatus", count: { $sum: 1 } } }]),
      Request.aggregate([{ $group: { _id: "$requestType", count: { $sum: 1 } } }]),
      Request.countDocuments({})
    ]);

    return res.json({
      success: true,
      data: {
        total,
        byStatus: byStatus.reduce((a, c) => ({ ...a, [c._id]: c.count }), {}),
        byType: byType.reduce((a, c) => ({ ...a, [c._id]: c.count }), {})
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

/* ---------------------------- default export ----------------------- */
export default {
  createRequest,
  getRequests,
  getRequestById,
  updateRequest,
  updateRequestStatus,
  deleteRequest,
  getRequestsSummary
};

