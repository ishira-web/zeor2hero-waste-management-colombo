import mongoose from "mongoose";

const  timeTableSchema = mongoose.Schema({
    timeTableID: { type: String, required: true, unique: true, default: function() { return `#TT${Math.floor(1000 + Math.random() * 9000)}` } },
    collectorID: { type: String, required: true },
    collectionDay: { type: String, required: true },
    collectionTime: { type: String, required: true },
    collectionLocation: { type: String, required: true },
    routeName : {type: String, required: true },
    crewMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Collector", required: true }],
    isActive: { type: Boolean, default: true }
},{ timestamps: true });


const TimeTable = mongoose.model("TimeTable", timeTableSchema);
export default TimeTable;


