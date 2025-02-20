import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../../domain/repositories/IUserepository";

@injectable()
export class RefreshToken {
  constructor(@inject("IUserRepository") private userRepository: IUserRepository) {}

  async execute(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: "No refresh token provided" });
    }

    try {
      const decoded: any = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || "refreshtokensecret");

      const user = await this.userRepository.findByEmail(decoded.email);
      if (!user) {
        return res.status(403).json({ success: false, message: "User not found" });
      }

      // Generate new access token
      const newAccessToken = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.ACCESS_TOKEN_SECRET || "accessstokensecret",
        { expiresIn: "15m" }
      );

      return res.status(200).json({ success: true, accessToken: newAccessToken });
    } catch (error) {
      return res.status(403).json({ success: false, message: "Invalid refresh token" });
    }
  }
}
