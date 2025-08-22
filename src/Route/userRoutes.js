import express from 'express';
import { activateUserById, createUser, deleteUserById, getAllUsers, getUserById, updateUserById } from '../Controller/user.controller.js';
import { protect } from '../Middleware/authMiddleware.js';
import upload from '../Config/Multer.js';

export const userRouter = express.Router();

userRouter.post('/create',upload.single("profilePicture"),createUser);
userRouter.get('/all',protect(["admin"]), getAllUsers);
userRouter.get('/:id',getUserById);
userRouter.put('/update/:id',updateUserById);
userRouter.delete('/delete/:id', deleteUserById); 
userRouter.put('/activate/:id', protect(["admin"]), activateUserById);
