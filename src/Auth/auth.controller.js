import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../Model/user.model.js";
import Collector from "../Model/collector.model.js";
import Admin from "../Model/admin.model.js";

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        
        let user = 
        (await User.findOne({email})) ||
        (await Collector.findOne({email})) ||
        (await Admin.findOne({email}));

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid){
            return res.status(401).json({ message: "Invalid password" });
        }
        // Check account activation status
        if (user.isActive && user.isActive === "inActive") {
        return res.status(403).json({ message: "Account not activated" });
        }

        // Generate JWT token
        const token =  jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        const { password: _, ...userData } = user.toObject();

        res.status(200).json({ ...userData, token });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}