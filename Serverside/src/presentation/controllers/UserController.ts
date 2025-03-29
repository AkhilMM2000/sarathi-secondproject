import { Request, Response } from "express";
import { container } from "tsyringe";
import { RegisterUser } from "../../application/use_cases/RegisterUser";
import { VerifyOTP } from "../../application/use_cases/VerifyOTP";
import { ResendOTP } from "../../application/use_cases/ResendOTP";
import { Login } from "../../application/use_cases/Login";

import { AddVehicle } from "../../application/use_cases/AddVehicle";
import { EditVehicle } from "../../application/use_cases/EditVehicle";
import { AuthError } from "../../domain/errors/Autherror";
import { AuthenticatedRequest } from "../../middleware/authMiddleware";
import { GetAllVehicle } from "../../application/use_cases/GetAllVehicle";
import { GetUserData } from "../../application/use_cases/User/GetUserData";
import { UpdateUserData } from "../../application/use_cases/User/UpdateUserData";
import { GetVehiclesByUser } from "../../application/use_cases/Admin/GetVehiclesByUser";

export class UserController {
  static async register(req: Request, res: Response) {
    try {
      const registerUser = container.resolve(RegisterUser);
      const user = await registerUser.execute(req.body);
      res.status(201).json({ success: true, message: "User registered successfully", user });
    } catch (error) {
      if (error instanceof AuthError) {
        res.status(error.statusCode).json({
            success: false,
            error: error.message, 
          });
          return 
        }
        
         res.status(500).json({ success: false, error: "Something went wrong" });
         return 
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
      const { email, password,role } = req.body;

     
    console.log(req.body);
    
      
      
      const { accessToken, refreshToken} = await login.execute(email, password,role);
      
      const refreshTokenKey = `${role}RefreshToken`;
    
      res.cookie(refreshTokenKey, refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
  
      });
      res.status(200).json({
        accessToken, role 
     
      });

    } catch (error) {
      if (error instanceof AuthError) {
      res.status(error.statusCode).json({
          success: false,
          error: error.message, 
        });
        return 
      }
      
       res.status(500).json({ success: false, error: "Something went wrong" });
       return 
    }
  }



  static async addVehicle(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const vehicleData = req.body;
    
      
      const addVehicleUseCase = container.resolve(AddVehicle);
      const vehicle = await addVehicleUseCase.execute({...vehicleData,userId:req.user?.id});

      
     
      res.status(201).json({ success: true, data: vehicle });
    
    } catch (error) {
      
      
      if (error instanceof AuthError) {
        res.status(error.statusCode).json({ success: false, message: error.message });
      
        
      } else {
        res.status(500).json({ success: false, message: "Internal Server Error" });
      }
    }
  }

  static async editVehicle(req: Request, res: Response) {
    try {
      const { vehicleId } = req.params; 
      const updateData = req.body;
console.log(updateData);

      const editVehicleUseCase = container.resolve(EditVehicle);
      const updatedVehicle = await editVehicleUseCase.execute(vehicleId, updateData);

     res.status(200).json({ success: true, data: updatedVehicle });
    } catch (error) {
      if (error instanceof AuthError) {
        res.status(error.statusCode).json({ success: false, message: error.message });
      }
       res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }

  
  static async getAllVehicle(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.id;
  
      // Check if userId is missing or not a string
      if (!userId || typeof userId !== "string") {
         res.status(400).json({ success: false, message: "Invalid or missing user ID" });
         return
      }
  
      const getVehiclesByUser = container.resolve(GetVehiclesByUser);
      const vehicles = await getVehiclesByUser.execute(userId);
  
    res.status(200).json({ success: true, data: vehicles });
    } catch (error) {
      if (error instanceof AuthError) {
        res.status(error.statusCode).json({ success: false, message: error.message });
      }
       res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
  
  static async getUserData(req: AuthenticatedRequest, res: Response) {
    try {
      const userId =req.user?.id// Assuming user ID is set in `req.user` by authentication middleware

      if (!userId) {
        res.status(400).json({ success: false, error: "User ID is required" });
        return
      }

      const getUserData = container.resolve(GetUserData);
      const user = await getUserData.execute(userId);


      res.status(200).json({ success: true, user });
    } catch (error) {
      if (error instanceof AuthError) {
        res.status(error.statusCode).json({ success: false, error: error.message });
        return
      }

      console.error("Error fetching user data:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }
  
  static async updateUser(req: Request, res: Response) {

    try {
      const userId = req.params.id 
      const updateData = req.body;
   
      if (!userId) {
      res.status(400).json({ success: false, message: "User ID is required" });
      return 
      }
  
      const updateUserData = container.resolve(UpdateUserData);
      const updatedUser = await updateUserData.execute(userId, updateData);
  
       res.status(200).json({ success: true, user: updatedUser });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ success: false, message: error.message });
      return
    }

  }



}
