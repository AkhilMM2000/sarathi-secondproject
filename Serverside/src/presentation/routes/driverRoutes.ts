import express from "express";
import { DriverController } from "../controllers/DriverControler";

const router = express.Router();
router.post('/register',DriverController.registerDriver)


export default router;
