import User from "../Model/user.model.js";
import bcrypt from "bcrypt";
// create new user
export const createUser = async (req, res) => {
    const { dwellerID,fullName, email, phoneNumber, password, role, addressLine1, houseNumber, city, aTaxNumber, postalCode } = req.body;
    try {
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const exitstTaxNumber = await User.findOne({aTaxNumber});
        if (exitstTaxNumber) {
            return res.status(400).json({ message: "Tax number already exists" });
        }
        const hashedPassword =  await bcrypt.hash(password, 10);
        const newUser = new User({
            dwellerID,
            fullName,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            addressLine1,
            houseNumber, 
            city, 
            aTaxNumber, 
            postalCode 
        });
        const savedUser = await newUser.save();
        return res.status(201).json({ message: "User created successfully" , user: savedUser });
            
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Get All Users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        return res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Get User by ID
export const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Update User by ID
export const updateUserById = async (req, res) => {
    const { id } = req.params;
    const { fullName, email, phoneNumber,  role, addressLine1, houseNumber, city, aTaxNumber, postalCode } = req.body;
    try {
        const user = await User.findById(id); 
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }   
        const updatedUser = await User.findByIdAndUpdate(id, {
            fullName,
            email,
            phoneNumber,
            role,
            addressLine1,
            houseNumber,
            city,   
            aTaxNumber,
            postalCode
        }, { new: true });
        return res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Delete User by ID
export const deleteUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        await User.findByIdAndDelete(id);
        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


