import express from "express";
import { UserController } from "../controllers/UserController";
import { protectRoute } from "../../middleware/authMiddleware"; 
import { CheckBlockedUserOrDriver } from "../../middleware/checkBlocked";
import { container } from "tsyringe";

const router= express.Router();
const checkBlockedMiddleware = container.resolve(CheckBlockedUserOrDriver);

// Authentication Routes
router
  .post("/register", UserController.register)
  .post("/verify-otp", UserController.verifyOTPUser)
  .post("/resend-otp", UserController.resendOTP)
  .post("/login", UserController.login);

// Vehicle Routes (Protected)
router
  .route("/vehicle")
  .all(protectRoute(["user"]), checkBlockedMiddleware.handle.bind(checkBlockedMiddleware)) 
  .post(UserController.addVehicle)
  .get(UserController.getAllVehicle);

router
  .route("/vehicle/:vehicleId")
  .all(protectRoute(["user"]), checkBlockedMiddleware.handle.bind(checkBlockedMiddleware)) // Ensures protection for all requests to this route
  .put(UserController.editVehicle)

  router
  .route("/profile")
  .all(protectRoute(["user"]), checkBlockedMiddleware.handle.bind(checkBlockedMiddleware))
  .get(UserController.getUserData); 


router
  .route("/profile/:id")
  .all(protectRoute(["user"]), checkBlockedMiddleware.handle.bind(checkBlockedMiddleware))
  .patch(UserController.updateUser);
export default router;
