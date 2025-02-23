import { inject, injectable } from "tsyringe";
import jwt from "jsonwebtoken";
import { IUserRepository } from "../../domain/repositories/IUserepository";
import { IDriverRepository } from "../../domain/repositories/IDriverepository";
import { UserRegistrationStore } from "../../infrastructure/store/UserRegisterStore";
import { User } from "../../domain/models/User";
import { Request, Response } from "express";
import dotenv from "dotenv";

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

    if (!userData) throw new Error("Register again Data not find");
    if (userData.otp !== otp || userData.otpExpires < new Date()) throw new Error("Invalid or expired OTP");

    store.removeUser(email);

    // Choose repository based on role
    const repository = role === "user" ? this.userRepository : this.driverRepository;

    // Save user/driver in DB
    const user = await repository.create(userData);

    const accessToken = jwt.sign(
      { id: user._id, role },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id, role },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "7d" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      accessToken,
      user: { id: user._id, role },
    };
  }
}
