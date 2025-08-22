import Request from "../Model/request.model.js";

// ✅ Create new request
export const createRequest = async (req, res) => {
  try {
    const request = new Request(req.body);
    await request.save();
    res.status(201).json({
      success: true,
      message: "Request created successfully",
      request,
    });
  } catch (error) {
    console.error("Error creating request:", error);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// ✅ Get all requests
export const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate("collectorID", "fullName email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// ✅ Get single request by ID
export const getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate(
      "collectorID",
      "fullName email phone"
    );

    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    res.status(200).json({ success: true, request });
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// ✅ Update request
export const updateRequest = async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    res.status(200).json({
      success: true,
      message: "Request updated successfully",
      request,
    });
  } catch (error) {
    console.error("Error updating request:", error);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// ✅ Delete request
export const deleteRequest = async (req, res) => {
  try {
    const request = await Request.findByIdAndDelete(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    res.status(200).json({
      success: true,
      message: "Request deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting request:", error);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// ✅ Get requests by Collector ID
export const getRequestsByCollector = async (req, res) => {
  try {
    const requests = await Request.find({ collectorID: req.params.collectorId })
      .populate("collectorID", "fullName email phone")
      .sort({ createdAt: -1 });

    if (requests.length === 0) {
      return res.status(404).json({ success: false, message: "No requests found for this collector" });
    }

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Error fetching requests by collector:", error);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};
