import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

export const protect = (roles = []) => {
    return async (req, res, next) => {
        try {
          let token = req.headers.authorization?.split(' ')[1];
          if (!token) {
            return res.status(401).json({ message: "No token provided" });
          }           
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          if (roles.length && !roles.includes(decoded.role)) {
            return res.status(403).json({ message: "Access denied" });
          }
          req.user = {id : decoded.id, role: decoded.role};
          next();
        } catch (error) {
            console.error("Authentication error:", error);
        }
  }
}