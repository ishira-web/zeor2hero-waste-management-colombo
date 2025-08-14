import mongoose from "mongoose";

const adminSchema = mongoose.Schema({
    adminId: { type: String, required: true, unique: true, default: function() { return `#ADM${Math.floor(1000 + Math.random() * 9000)}` } },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' },
    isActive: { type: Boolean, default: "Active" },
});

const Admin = mongoose.model("Admins", adminSchema);
export default Admin;

