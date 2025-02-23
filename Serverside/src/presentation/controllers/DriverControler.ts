import { Request, Response } from "express";
import { container } from "tsyringe";
import { RegisterUser } from "../../application/use_cases/RegisterUser";
import { VerifyOTP } from "../../application/use_cases/VerifyOTP";
import { ResendOTP } from "../../application/use_cases/ResendOTP";
import { Login } from "../../application/use_cases/Login";
import { RefreshToken } from "../../application/use_cases/Refreshtoken";
import { RegisterDriver } from "../../application/use_cases/RegisterDriver";

export class DriverController {


    static async registerDriver(req: Request, res: Response) {
        try {
            console.log(req.body);
            
          const DriverRegister= container.resolve(RegisterDriver);
          const response = await DriverRegister.execute(req.body);
          res.status(201).json({ success: true, ...response });
        } catch (error) {
          res.status(400).json({ success: false, error: error instanceof Error ? error.message : "Registration failed" });
        }
      
    
      }
      
    
}