import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './Config/DatabaseConnection.js';
import authRouter from './Route/authRoutes.js';
import adminRouter from './Route/adminRoutes.js';
import router from './Route/collectorRoutes.js';
import { userRouter } from './Route/userRoutes.js';
import colRoutes from './Route/colRoutes.js';
dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



const port  = process.env.PORT || 3000;

app.use('/api/auth',authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/collector',router);
app.use('api/route',colRoutes);
app.use('/api/user',userRouter);

app.listen(port, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${port}`);
});

