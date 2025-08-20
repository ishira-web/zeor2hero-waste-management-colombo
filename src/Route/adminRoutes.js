import express from 'express';
import { adminCreate, getAllAdmins } from "../Controller/admin.controller.js";
import { protect } from '../Middleware/authMiddleware.js';

const adminRouter = express.Router();

adminRouter.post('/create',protect(["admin"]), adminCreate);
adminRouter.get('/allAdmin',protect(["admin"]),getAllAdmins)
export default adminRouter;