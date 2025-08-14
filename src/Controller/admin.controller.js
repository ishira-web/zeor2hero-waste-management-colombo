import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../Model/admin.model.js";

export const adminCreate = async (req, res) => {
    const { adminId, email, password, name , role = "admin" } = req.body;
    try {
        if (!req.body){
            return res.status(400).json({ message: "Please provide all required fields" });
        }
        const existingAdmin = await Admin.findOne({email});
        if (existingAdmin){
            return res.status(400).json({ message: "Admin already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({
            adminId,
            email,
            password: hashedPassword,
            name,
            role
        })
        const savedAdmin = await newAdmin.save();
        res.status(201).json({ message: "Admin created successfully", admin: savedAdmin });
    } catch (error) {
        console.error("Admin creation error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


// Get all admins

export const getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find();
        res.status(200).json(admins);
    } catch (error) {
        console.error("Error fetching admins:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

