import User from "../Model/user.model.js";

// create new user
export const createUser = async (req, res) => {
    const { fullName, email, phoneNumber, password, role, addressLine1, houseNumber, city, aTaxNumber, postalCode } = req.body;

}