import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../../domain/repositories/IUserepository"; 
// import { IDriverRepository } from "../../domain/repositories/IDriverRepository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();
@injectable()
export class Login {
  constructor(
    @inject("IUserRepository") private userRepository: IUserRepository,
    // @inject("IDriverRepository") private driverRepository: IDriverRepository
  ) {}

  async execute(req:Request,res:Response,email: string, password: string) {
    let user = await this.userRepository.findByEmail(email);
    let role: "user" | "driver" | "admin" | null = user ? "user" : null;

    // if (!user) {
    //   user = await this.driverRepository.findByEmail(email);
    //   role = user ? "driver" : null;
    // }

    if (!user) throw new Error("Invalid email or password");

    if (role === "user" && user.role==='admin') {
      role = "admin"; // Promote to Admin role
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new Error("Invalid email or password");

    // Generate Tokens
    const accessToken = jwt.sign(
      { id: user._id, email: user.email, role: role! },
      process.env.ACCESS_TOKEN_SECRET as string ,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id, email: user.email, role: role! },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "7d" }
    );

    // Store refresh token in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        role: role!,
      },
    };
  }
}
