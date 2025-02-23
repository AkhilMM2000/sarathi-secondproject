import { Request, Response } from "express";
import { container } from "tsyringe";
import { RegisterUser } from "../../application/use_cases/RegisterUser";
import { VerifyOTP } from "../../application/use_cases/VerifyOTP";
import { ResendOTP } from "../../application/use_cases/ResendOTP";
import { Login } from "../../application/use_cases/Login";
import { RefreshToken } from "../../application/use_cases/Refreshtoken";


export class UserController {
  static async register(req: Request, res: Response) {
    try {
      const registerUser = container.resolve(RegisterUser);
      const user = await registerUser.execute(req.body);
      res.status(201).json({ success: true, message: "User registered successfully", user });
    } catch (error) {
      res.status(400).json({ success: false, error: error|| "Registration failed" });
    }
  }

  static async verifyOTPUser(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;
    
      console.log(req.body);
      
      const verifyOTP = container.resolve(VerifyOTP);
      const result = await verifyOTP.execute(req,res,email, otp,'user');
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      res.status(400).json({ success: false, error: error|| "OTP verification failed" });
    }
  }
  static async resendOTP(req: Request, res: Response) {
    try {
      const { email, role } = req.body;
      console.log(email,role);
      
      const resendOTP = container.resolve(ResendOTP);
      const result = await resendOTP.execute(email, role);
      res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Something went wrong" 
      });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const login = container.resolve(Login);
      const { email, password } = req.body;
      const result = await login.execute(req,res,email, password);

      res.status(200).json({
        success: true,
        message: "Login successful",
        accessToken: result.accessToken,
        user: result.user,
      });
    } catch (error) {
      res.status(400).json({ success: false, error: error || "Login failed" });
    }
  }
  static async refreshToken(req: Request, res: Response) {
    try {
      const refreshTokenUseCase = container.resolve(RefreshToken);
      const result = await refreshTokenUseCase.execute(req.cookies.refreshToken);

      if (!result.success) {
        return res.status(403).json({ success: false, message: result.message });
      }

      res.status(200).json({ success: true, accessToken: result.accessToken });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error", error });
    }
  }

  


}
