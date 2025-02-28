import { inject, injectable } from "tsyringe";
import { EmailService } from "../services/Emailservice"; 
import { UserRegistrationStore } from "../../infrastructure/store/UserRegisterStore"; 
import { randomInt } from "crypto";
import { Driver } from "../../domain/models/Driver";
@injectable()
export class RegisterDriver {
  constructor(
    @inject("EmailService") private emailService: EmailService,
  
  ) {}

  async execute(driverData:Driver ) {
    const { email } = driverData;

    const store = UserRegistrationStore.getInstance();
    if (store.getUser(email)) throw new Error("OTP already sent to this email");
 
    const otp = randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); 
    //store the data in the js map
    store.addUser(email,{...driverData,otp,otpExpires})
    
    
    // Send OTP to driver's email
    await this.emailService.sendOTP(email, otp);
  console.log(`${otp} for driver`);
  
    return { message: "OTP sent successfully. Please verify your email." };
  }

  
}

