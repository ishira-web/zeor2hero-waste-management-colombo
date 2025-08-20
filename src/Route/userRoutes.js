import express from 'express';
import { createUser, deleteUserById, getAllUsers, getUserById, updateUserById } from '../Controller/user.controller.js';

export const userRouter = express.Router();

userRouter.post('/create',createUser);
userRouter.get('/all',getAllUsers);
userRouter.get('/:id',getUserById);
userRouter.put('/update/:id',updateUserById);
userRouter.delete('/delete/:id', deleteUserById); 