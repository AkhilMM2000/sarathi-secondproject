import { inject, injectable } from "tsyringe";
import { EmailService } from "../services/Emailservice"; 
import { IRedisrepository } from "../../domain/repositories/IRedisrepository";
import { User } from "../../domain/models/User";
import { AuthError } from "../../domain/errors/Autherror";
@injectable()
export class RegisterUser {
  constructor(
    @inject("EmailService") private emailService: EmailService,
    @inject("UserRegistrationStore") private store: IRedisrepository
) {}

  async execute(userData: User) {
    const { name, email, mobile, password, referralCode } = userData;
   

   
   let j=await this.store.getUser(email)
console.log(j,'sss');

    // Check if user already exists in memory (to prevent resending OTP)
    if (await this.store.getUser(email)) {
      await this.store.removeUser(email)
      // throw new AuthError("OTP already sent to this email", 429);
  }
  
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Store user data temporarily
    await this.store.addUser(email, { name, email, mobile, password, referralCode, otp, otpExpires });
console.log(await this.store.getUser(email),'for user');

    // Send OTP to email
    await this.emailService.sendOTP(email, otp);
    

    return { message: "OTP sent to email" };
  }
  
}
