import express from 'express';
import { createUser, deleteUserById, getAllUsers, getUserById, updateUserById } from '../Controller/user.controller.js';
import { protect } from '../Middleware/authMiddleware.js';

export const userRouter = express.Router();

userRouter.post('/create',createUser);
userRouter.get('/all',protect(["admin"]), getAllUsers);
userRouter.get('/:id',getUserById);
userRouter.put('/update/:id',updateUserById);
userRouter.delete('/delete/:id', deleteUserById); 

