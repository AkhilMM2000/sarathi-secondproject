import "reflect-metadata";
import "./infrastructure/config/di"; // Dependency Injection Setup
import express from "express";
import { connectDB } from "./config/database";
import userRoutes from "./presentation/routes/userRoutes";
import cookieParser from "cookie-parser";
import driverRoute from './presentation/routes/driverRoutes'
import cors from 'cors'
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,  // Allow cookies (like JWT tokens) to be sent
}));


// Routes
app.use("/api/users", userRoutes);
app.use('/api/drivers',driverRoute)
const PORT = process.env.PORT||3000;

// Start Server
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

