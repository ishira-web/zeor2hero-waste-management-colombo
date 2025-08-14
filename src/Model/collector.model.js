import mongoose from "mongoose";

const collectorSchema = mongoose.Schema({
    collectId :   { type: String, required: true, unique: true, default : function(){return `#COL${Math.floor(1000 + Math.random() * 9000)}`}},
    fullName:     { type: String, required: true },
    email:        { type: String, required: true, unique: true },
    phoneNumber:  { type: String, required: true },
    password:     { type: String, required: true },
    nicNumber:    { type: String, required: true, unique: true },
    nicImage:     { type: String, required: true },
    role:         { type: String, default: 'collector' },
    profilePicture: { type: String, required : true },
    addressLine1: { type: String, required: true },
    houseNumber:  { type: String, required: true },
    city:         { type: String, default: 'Colombo' },
    isOnline     : { type: String, default: 'online' },
    isActive :    { type: String, default: 'Active' },
});

const Collectors =  mongoose.model("Collectors", collectorSchema);
export default Collectors;
