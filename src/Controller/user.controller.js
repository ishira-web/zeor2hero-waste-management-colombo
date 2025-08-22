import User from "../Model/user.model.js";
import bcrypt from "bcrypt";
import cloudinary from "../Config/Cloudinary.js";

// Convert Multer memory file -> Data URI for Cloudinary
const toDataURI = (file) =>
  `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

export const createUser = async (req, res) => {
  try {
    let {
      fullName,
      email,
      phoneNumber,
      password,
      role = "dweller",
      addressLine1,
      houseNumber,
      city = "Colombo",
      aTaxNumber,
      postalCode,
      // profilePicture // <- not needed; image comes via req.file
    } = req.body ?? {};

    // Normalize email
    if (typeof email === "string") email = email.trim().toLowerCase();

    // Basic validation (list which fields are missing)
    const missing = [];
    if (!fullName) missing.push("fullName");
    if (!email) missing.push("email");
    if (!phoneNumber) missing.push("phoneNumber");
    if (!password) missing.push("password");
    if (!addressLine1) missing.push("addressLine1");
    if (!houseNumber) missing.push("houseNumber");
    if (!aTaxNumber) missing.push("aTaxNumber");
    if (!postalCode) missing.push("postalCode");

    if (missing.length) {
      return res
        .status(400)
        .json({ message: `Missing required fields: ${missing.join(", ")}` });
    }

    // Uniqueness checks (soft guard; DB unique index is the source of truth)
    const existing = await User.findOne({
      $or: [{ email }, { aTaxNumber }],
    }).lean();
    if (existing) {
      const field = existing.email === email ? "email" : "aTaxNumber";
      return res.status(400).json({ message: `${field} already exists` });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Optional profile picture (Multer memoryStorage)
    const file = req.file ?? req.files?.profilePicture?.[0];
    let profileUrl;
    if (file) {
      try {
        // If you ever switch to diskStorage, add a fallback using file.path
        const uploadRes = await cloudinary.uploader.upload(toDataURI(file), {
          folder: "zero2hero/Users/profilePictures",
        });
        profileUrl = uploadRes.secure_url;
      } catch (e) {
        return res
          .status(400)
          .json({ message: "Image upload failed", error: e?.message || e });
      }
    }

    // Create user
    const user = await User.create({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      addressLine1,
      houseNumber,
      city,
      aTaxNumber,
      postalCode,
      ...(profileUrl && { profilePicture: profileUrl }),
      isActive: "inActive",
    });

    // Never return password
    const safeUser = user.toObject();
    delete safeUser.password;

    return res.status(201).json({
      message: "User created successfully",
      user: safeUser,
    });
  } catch (error) {
    // Duplicate key (e.g., email or aTaxNumber unique)
    if (error?.code === 11000) {
      const key =
        Object.keys(error?.keyPattern ?? {})[0] ||
        Object.keys(error?.keyValue ?? {})[0] ||
        "field";
      return res.status(400).json({ message: `${key} already exists` });
    }

    // Multer fileFilter error
    if (error?.message?.includes("Only image files are allowed")) {
      return res.status(400).json({ message: error.message });
    }

    // Mongoose validation error
    if (error?.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


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


// Activate account by user ID

export const activateUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) { 
            return res.status(404).json({ message: "User not found" });
        } 
        user.isActive = 'active'; // Set the isActive field to 'active'
        await user.save(); // Save the updated user document
        return res.status(200).json({ message: "User activated successfully", user });
    } catch (error) {
        console.error("Error activating user:", error); 
        return res.status(500).json({ message: "Internal server error" });
    }
}