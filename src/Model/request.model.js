import mongoose from "mongoose";

const requestSchema = mongoose.Schema({
    requestID: { type: String, required: true, unique: true, default: function() { return `#REQ${Math.floor(1000 + Math.random() * 9000)}` } },
    collectorID: { type: mongoose.Schema.Types.ObjectId, ref: "Collector", required: true },
    userName: { type: String, required: true },
    dwellerID: { type: String, required: true },
    dwellerAddress: { type: String, required: true },
    requestType: { type: String, required: true, enum: ['General', 'Urgent', 'Emergency'] },
    requestStatus: { type: String, required: true, enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'], default: 'Pending' },
    requestDate: { type: Date, default: Date.now },
    requestTime: { type: String, required: true },
    additionalNotes: { type: String, default: '' },
}, { timestamps: true });
const Request = mongoose.model("Request", requestSchema);
export default Request;