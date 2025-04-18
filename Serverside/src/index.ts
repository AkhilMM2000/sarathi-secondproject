import "reflect-metadata";
import "./infrastructure/config/di"; 
import express from "express";
import { connectDB } from "./config/database";
import userRoutes from "./presentation/routes/userRoutes";
import cookieParser from "cookie-parser";
import driverRoute from './presentation/routes/driverRoutes'
import AuthRoute from './presentation/routes/AuthRoute'
import adminRoutes from './presentation/routes/adminRoutes'
import fileroute from './presentation/routes/fileRoutes'
import googleRoute from './presentation/routes/googleAuthRoute'
import Bookroute from './presentation/routes/BookingRoute'
import cors from 'cors'
import { errorHandler } from "./middleware/errorHandler";


import dotenv from "dotenv";

dotenv.config();
const app = express();


app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,  // Allow cookies (like JWT tokens) to be sent
}));
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use('/api/drivers',driverRoute)
app.use('/api/admin',adminRoutes)
app.use("/api/files", fileroute); 
app.use('/api', Bookroute)
app.use('/api/auth', AuthRoute);
app.use('/api/auth/google', googleRoute )
const PORT = process.env.PORT||3000;

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  errorHandler(err, req, res, next);
});


// Start Server
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});








