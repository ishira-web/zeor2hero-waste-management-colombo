import express from 'express';
import { adminCreate } from "../Controller/admin.controller.js";
import { protect } from '../Middleware/authMiddleware.js';

const adminRouter = express.Router();

adminRouter.post('/create',protect(["admin"]), adminCreate);

export default adminRouter;