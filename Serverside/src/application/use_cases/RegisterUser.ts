import { inject, injectable } from "tsyringe";
import { EmailService } from "../services/Emailservice"; 
import { UserRegistrationStore } from "../../infrastructure/store/UserRegisterStore"; 
import { User } from "../../domain/models/User";
@injectable()
export class RegisterUser {
  constructor(@inject("EmailService") private emailService: EmailService) {}

  async execute(userData: User) {
    const { name, email, mobile, password, referralCode } = userData;
   
    const store = UserRegistrationStore.getInstance();
   


    // Check if user already exists in memory (to prevent resending OTP)
    if (store.getUser(email)) throw new Error("OTP already sent to this email");

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store user data temporarily
    store.addUser(email, { name, email, mobile, password, referralCode, otp, otpExpires });

    // Send OTP to email
    await this.emailService.sendOTP(email, otp);
      console.log(`created ot is ${otp}` );

    return { message: "OTP sent to email" };
  }
}
