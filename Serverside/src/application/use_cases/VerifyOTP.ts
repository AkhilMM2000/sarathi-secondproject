import { inject, injectable } from "tsyringe";
import jwt from "jsonwebtoken";
import { IUserRepository } from "../../domain/repositories/IUserepository";
import { UserRegistrationStore } from "../../infrastructure/store/UserRegisterStore";
import { User } from "../../domain/models/User";
import { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();
@injectable()
export class VerifyOTP {
  constructor(@inject("IUserRepository") private userRepository: IUserRepository) {}
  async execute(req:Request,res:Response,email: string, otp: string) {
    const store = UserRegistrationStore.getInstance();
    const userData = store.getUser(email);
console.log(userData);


    if (!userData) {
      throw new Error("OTP expired or invalid");
    }

    if (userData.otp !== otp || userData.otpExpires < new Date()) {
      throw new Error("Invalid or expired OTP");
    }

    // OTP verified, remove user from memory
    store.removeUser(email);
store.clearUser()
    // Save user in the database
    const user = await this.userRepository.create(userData);

 
    const accessToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "7d" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });
  
    // Return the tokens and user data to the controller
    return {
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    }
  }
}
