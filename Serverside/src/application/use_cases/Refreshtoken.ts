import jwt from "jsonwebtoken";
import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../../domain/repositories/IUserepository"; 
@injectable()
export class RefreshToken {
  constructor(@inject("IUserRepository") private userRepository: IUserRepository) {}

  async execute(refreshToken: string) {
    if (!refreshToken) {
      return { success: false, message: "No refresh token provided" };
    }

    try {
      const decoded: any = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string);

      const user = await this.userRepository.findByEmail(decoded.email);
      if (!user) {
        return { success: false, message: "User not found" };
      }

      // Generate new access token
      const newAccessToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: "15m" }
      );

      return { success: true, accessToken: newAccessToken };
    } catch (error) {
      return { success: false, message: "Invalid refresh token" };
    }
  }
}
