import { Request, Response } from "express";
import { container } from "tsyringe";
import { RegisterUser } from "../../application/use_cases/RegisterUser";
import { VerifyOTP } from "../../application/use_cases/VerifyOTP";
import { ResendOTP } from "../../application/use_cases/ResendOTP";
import { Login } from "../../application/use_cases/Login";

import { RegisterDriver } from "../../application/use_cases/RegisterDriver";
import { AuthError } from "../../domain/errors/Autherror";
import { GetDriverProfile } from "../../application/use_cases/Driver/Getdriverprofile";
import { EditDriverProfile } from "../../application/use_cases/Driver/EditDriverProfile";
import { AuthenticatedRequest } from "../../middleware/authMiddleware";

export class DriverController {
  static async registerDriver(req: Request, res: Response) {
    try {
      const DriverRegister = container.resolve(RegisterDriver);
      const response = await DriverRegister.execute(req.body);
      res.status(201).json({ success: true, ...response });
    } catch (error) {
      res
        .status(400)
        .json({
          success: false,
          error: error instanceof Error ? error.message : "Registration failed",
        });
    }
  }
  static async verifyOTPDriver(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;

      console.log(req.body);

      const verifyOTP = container.resolve(VerifyOTP);
      const result = await verifyOTP.execute(req, res, email, otp, "driver");
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      res
        .status(400)
        .json({
          success: false,
          error:
            error instanceof Error ? error.message : "Unknown error occurred",
        });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password, role } = req.body;
      console.log(req.body);

      const loginUseCase = container.resolve(Login);
      const { accessToken, refreshToken } = await loginUseCase.execute(
        email,
        password,
        role
      );

      // Set refresh token cookie
      const refreshTokenKey = `${role}RefreshToken`;
      res.cookie(refreshTokenKey, refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ accessToken, role });
    } catch (error) {
      if (error instanceof AuthError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message,
        });
        return;
      }

      res.status(500).json({ success: false, error: "Something went wrong" });
    }
  }
  static async getDriverProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const driverId =req.user?.id;
      if (!driverId) {
        res.status(400).json({ success: false, error: "Driver ID is required" });
        return 
    }
      
      const getDriverProfile = container.resolve(GetDriverProfile);
      const driver = await getDriverProfile.execute(driverId);

      res.status(200).json({ success: true, driver });
    } catch (error) {
      if (error instanceof AuthError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message,
        });
        return;
      }
    }
  }
  static async editDriverProfile(req: Request, res: Response) {
    try {
      const driverId = req.params.id; // Get driver ID from request params
      const updateData = req.body; // Get update data from request body

      const editDriverProfileUseCase = container.resolve(EditDriverProfile);
      const updatedDriver = await editDriverProfileUseCase.execute(
        driverId,
        updateData
      );

      res.status(200).json({ success: true, driver: updatedDriver });
    } catch (error) {
      if (error instanceof AuthError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message,
        });
        return;
      }
    }
  }


  
}
