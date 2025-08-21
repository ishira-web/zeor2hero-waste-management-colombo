// routes/request.routes.js
import { Router } from "express";
import { createRequest, deleteRequest, getRequestById, getRequests, getRequestsSummary, updateRequest, updateRequestStatus } from "../Controller/request.controller.js";

const Rerouter = Router();

Rerouter.post("/", createRequest);
Rerouter.get("/", getRequests);
Rerouter.get("/analytics/summary", getRequestsSummary);
Rerouter.get("/:id", getRequestById);
Rerouter.patch("/:id", updateRequest);
Rerouter.patch("/:id/status", updateRequestStatus);
Rerouter.delete("/:id", deleteRequest);

export default Rerouter;
