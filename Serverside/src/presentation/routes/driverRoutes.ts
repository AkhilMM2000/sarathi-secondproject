import express from "express";
import { DriverController } from "../controllers/DriverControler";

const router = express.Router();
router.post("/register", DriverController.registerDriver);
router.post("/verify-otp", DriverController.verifyOTPDriver);
router.post("/login", async (req, res, next) =>{
  try {
    await DriverController.login(req, res);
  } catch (error) {
    next(error);
  }
});
export default router;
