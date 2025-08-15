import mongoose, { mongo } from "mongoose";

const UserSchema  = mongoose.Schema({
  dwellerID :   { type: String, required: true, unique: true, default : function(){return `#USER${Math.floor(1000 + Math.random() * 9000)}`}},
  fullName:     { type: String, required: true },
  email:        { type: String, required: true, unique: true },
  phoneNumber:  { type: String, required: true },
  password    : { type: String, required: true },
  role:         { type: String, default: 'dweller' },
  addressLine1: { type: String, required: true },
  houseNumber:  { type: String, required: true },
  city:         { type: String, default: 'Colombo' },
  aTaxNumber:   { type: String, required: true },
  postalCode:   { type: String, required: true },
  profilePicture: {type: String },
  isActive:     { type: String, default: 'inActive' },
}
, { timestamps: true });

const User =  mongoose.model("Users",UserSchema);
export default User;

