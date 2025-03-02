import { inject, injectable } from "tsyringe";
import jwt from "jsonwebtoken";
import { IUserRepository } from "../../domain/repositories/IUserepository";
import { IDriverRepository } from "../../domain/repositories/IDriverepository";
import { UserRegistrationStore } from "../../infrastructure/store/UserRegisterStore";
import { User } from "../../domain/models/User";
import { Request, Response } from "express";
import dotenv from "dotenv";
import Driverschema from "../../infrastructure/database/modals/Driverschema";

dotenv.config();
@injectable()
export class VerifyOTP {
  constructor(
    @inject("IUserRepository") private userRepository: IUserRepository,
    @inject("IDriverRepository") private driverRepository: IDriverRepository
  ) {}

  async execute(req: Request, res: Response, email: string, otp: string, role: "user" | "driver") {
    const store = UserRegistrationStore.getInstance();
    const userData = store.getUser(email);

    console.log("✅ Reached OTP verification");
    console.log("📌 Retrieved user data:", userData, `Role: ${role}`);

    if (!userData) throw new Error("Register again, data not found");
    if (userData.otp !== otp || userData.otpExpires < new Date()) throw new Error("Invalid or expired OTP");

    console.log("✅ OTP Verified!");

    // Choose repository based on role
    const repository = role === "user" ? this.userRepository : this.driverRepository;

    let savedUser;
    if (role === "driver") {
      // Remove unwanted fields before saving
      const { otp, otpExpires, confirmPassword, ...driverData } = userData;
      const existingDriver = await Driverschema.findOne({
        $or: [
          { email: driverData.email },
          { mobile: driverData.mobile },
          { aadhaarNumber: driverData.aadhaarNumber },
          { licenseNumber: driverData.licenseNumber },
        ],
      });
      
      if (existingDriver) {
        console.error("❌ Duplicate driver found:", existingDriver);
        throw new Error("A driver with this email, mobile, Aadhaar, or license number already exists.");
      }
      // Ensure necessary fields are set for drivers
      driverData.status = "pending";
      driverData.isBlock = false;
      driverData.role = "driver";

      console.log("📌 Saving driver to DB:", driverData);
      console.log("📝 Required Schema Fields:", Object.keys(Driverschema.schema.paths));
      // Save driver in the database
      savedUser = await repository.create(driverData);
    } else {
      console.log("📌 Saving user to DB:", userData);
      savedUser = await repository.create(userData);
    }

    // Remove from temporary store after successful save
    store.removeUser(email);

    if (!savedUser) console.log('user data doesnt get to you');
    
    console.log("✅ User successfully saved:", savedUser);
    console.log("📝 Required Schema Fields:", Object.keys(Driverschema.schema.paths));
    // Generate JWT Tokens
    const accessToken = jwt.sign(
      { id: savedUser._id, role },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: savedUser._id, role },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "7d" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    console.log("✅ Tokens generated & refreshToken set in cookies");

    return {
      accessToken,
      user: { id: savedUser._id, role },
    };
  }
}
