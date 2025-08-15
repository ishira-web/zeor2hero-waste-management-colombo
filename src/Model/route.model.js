import mongoose from "mongoose";

const RouteSchema = mongoose.Schema({
    routeID: { type: String, required: true, unique: true, default: function() { return `#RT${Math.floor(1000 + Math.random() * 9000)}` } },
    routeName: { type: String, required: true },
    startLocation: { type: String, required: true },
    endLocation: { type: String, required: true },
    date : { type: Date, required: true },
    time: { type: String, required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });
const Route = mongoose.model("Route", RouteSchema);
export default Route;