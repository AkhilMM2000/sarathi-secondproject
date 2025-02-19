import express from "express";
import { UserController } from "../controllers/UserController";

const router = express.Router();

// User Registration Route
router.post("/register", UserController.register);

// OTP Verification Route
router.post("/verify-otp", UserController.verifyOTPUser);

router.post("/resend-otp", UserController.resendOTP);
export default router;
