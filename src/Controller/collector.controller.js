import Collectors from "../Model/collector.model.js";
import bcrypt from "bcrypt";
import cloudinary from "../Config/Cloudinary.js";


// buffer -> data URI string
const toDataURI = (file) =>
  `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

export const createCollector = async (req, res) => {
  try {
    const {collectId,fullName, email, phoneNumber, password, nicNumber,addressLine1, city,houseNumber,role="collector"} = req.body || {};

    const required = { fullName, email, phoneNumber, password, nicNumber, addressLine1 };
    for (const [k, v] of Object.entries(required)) {
      if (!v) return res.status(400).json({ message: `Missing required field: ${k}` });
    }
    const isExistUniques = await Collectors.findOne({ $or: [{ email }, { nicNumber }] });
    if (isExistUniques) return res.status(409).json({ message: "Email or NIC already exists" });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const nicFile = req.files?.nicImage?.[0];
    const profileFile = req.files?.profilePicture?.[0];
    if (!nicFile || !profileFile) {
      return res.status(400).json({ message: "nicImage and profilePicture files are required" });
    }

    // Upload to Cloudinary using Data URIs
    const [nicUpload, profileUpload] = await Promise.all([
      cloudinary.uploader.upload(toDataURI(nicFile), {
        folder: "zero2hero/Users/NICCards",
      }),
      cloudinary.uploader.upload(toDataURI(profileFile), {
        folder: "zero2hero/Users/profilePictures",
      }),
    ]);


    const doc = await Collectors.create({
      collectId,
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
      nicNumber,
      nicImage: nicUpload.secure_url,         
      profilePicture: profileUpload.secure_url, 
      addressLine1,
      houseNumber,
      city: city || "Colombo",
      isOnline: "online",
      isActive: "Active",
      role
    });


    const { password: _, __v, ...safe } = doc.toObject();
    return res.status(201).json({ message: "Collector created successfully", collector: safe });
  } catch (err) {
    if (err?.code === 11000) {
      const fields = Object.keys(err.keyValue || {}).join(", ");
      return res.status(409).json({ message: `Duplicate value for: ${fields}` });
    }
    console.error("Error creating collector:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};



// get All Collectors
export const getAllCollectors = async (req, res) => {
  try {
    const collectors = await Collectors.find({}).select("-password -__v");
    return res.status(200).json({ message: "Collectors retrieved successfully", collectors });
  } catch (err) {
    console.error("Error retrieving collectors:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get Collector by ID
export const getCollectorById = async (req, res) => {
  try {
    const { id } = req.params;
    const collector = await Collectors.findById(id).select("-password -__v");
    if (!collector) return res.status(404).json({ message: "Collector not found" });
    return res.status(200).json({ message: "Collector retrieved successfully", collector });
  } catch (err) {
    console.error("Error retrieving collector:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update Collector by ID
export const updateCollectorById = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, phoneNumber, nicNumber, addressLine1, city, houseNumber } = req.body || {};

    const updates = {};
    if (fullName) updates.fullName = fullName;
    if (email) updates.email = email;
    if (phoneNumber) updates.phoneNumber = phoneNumber;
    if (nicNumber) updates.nicNumber = nicNumber;
    if (addressLine1) updates.addressLine1 = addressLine1;
    if (city) updates.city = city;
    if (houseNumber) updates.houseNumber = houseNumber;

    const collector = await Collectors.findByIdAndUpdate(id, updates, { new: true }).select("-password -__v");
    if (!collector) return res.status(404).json({ message: "Collector not found" });
    
    return res.status(200).json({ message: "Collector updated successfully", collector });
  } catch (err) {
    console.error("Error updating collector:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}


// Delete Collector by ID
export const deleteCollectorById = async (req, res) => {
  try {
    const { id } = req.params;
    const collector = await Collectors.findByIdAndDelete(id);
    if (!collector) return res.status(404).json({ message: "Collector not found" });
    
    return res.status(200).json({ message: "Collector deleted successfully" });
  } catch (err) {
    console.error("Error deleting collector:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

