import express from "express";
import { DriverController } from "../controllers/DriverControler";

const router = express.Router();
router.post('/register',DriverController.registerDriver)
router.post('/verify-otp',DriverController.verifyOTPDriver)

export default router;
