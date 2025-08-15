import User from "../Model/user.model.js";
import bcrypt from "bcryptjs";
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


