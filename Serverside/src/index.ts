import "reflect-metadata";
import "./infrastructure/config/di"; // Dependency Injection Setup
import express from "express";
import { connectDB } from "./config/database";
import userRoutes from "./presentation/routes/userRoutes";
import cors from 'cors'
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,  // Allow cookies (like JWT tokens) to be sent
}));

// Routes
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 3000;

// Start Server
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

