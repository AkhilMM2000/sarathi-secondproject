import jwt from "jsonwebtoken";

export class AuthService {
  static generateAccessToken(payload: object): string {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: "1m" });
  }

  static generateRefreshToken(payload: object): string {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: "7d" });
  }
}
