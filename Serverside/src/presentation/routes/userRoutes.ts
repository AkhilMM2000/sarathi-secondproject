import express from "express";
import { UserController } from "../controllers/UserController";

const router = express.Router();

// User Registration Route
router.post("/register", UserController.register);
router.post("/verify-otp", UserController.verifyOTPUser);
router.post("/resend-otp", UserController.resendOTP);
router.post('/login',UserController.login)


export default router;
