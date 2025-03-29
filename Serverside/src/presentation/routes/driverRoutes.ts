import express from "express";
import { DriverController } from "../controllers/DriverControler";
import { protectRoute } from "../../middleware/authMiddleware";
import { CheckBlockedUserOrDriver } from "../../middleware/checkBlocked";
import { container } from "tsyringe";
const router = express.Router();
const checkBlockedMiddleware = container.resolve(CheckBlockedUserOrDriver);
router
  .post("/register", DriverController.registerDriver)
  .post("/verify-otp", DriverController.verifyOTPDriver)
  .post("/login", DriverController.login);

  router
  .route("/driver")
  .all(protectRoute(["driver"]), checkBlockedMiddleware.handle.bind(checkBlockedMiddleware)) // Apply to all methods
  .get(DriverController.getDriverProfile);

router
  .route("/driver/:id")
  .all(protectRoute(["driver"]), checkBlockedMiddleware.handle.bind(checkBlockedMiddleware)) // Apply to all methods
  .put(DriverController.editDriverProfile);


export default router;
