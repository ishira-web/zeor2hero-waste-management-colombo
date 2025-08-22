import express from "express";
import {
  createRequest,
  getAllRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
  getRequestsByCollector,
} from "../Controller/request.controller.js";

const Rerouter = express.Router();

Rerouter.post("/", createRequest);                // Create request
Rerouter.get("/", getAllRequests);                // Get all requests
Rerouter.get("/:id", getRequestById);             // Get request by ID
Rerouter.put("/:id", updateRequest);              // Update request
Rerouter.delete("/:id", deleteRequest);           // Delete request
Rerouter.get("/collector/:collectorId", getRequestsByCollector); // Get requests by collector

export default Rerouter;
