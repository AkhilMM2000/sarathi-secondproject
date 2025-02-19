import { injectable ,inject} from "tsyringe";
import { UserRegistrationStore } from "../../infrastructure/store/UserRegisterStore";
import { EmailService } from "../services/Emailservice"; 

@injectable()
export class ResendOTP {
  constructor(@inject("EmailService") private emailService: EmailService) {}
  async execute(email: string, role: string) {
    const store = UserRegistrationStore.getInstance();
    const existingUser = store.getUser(email);
console.log(existingUser);

    if (!existingUser) {
      throw new Error("No pending registration found. Please sign up again.");
    }

    // Generate new OTP
    const newOTP = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // Expires in 5 min

    // // Update the OTP in store
    // store.addUser({ ...existingUser, otp: newOTP, otpExpires });

    // Send OTP via email
    await this.emailService.sendOTP(email, newOTP);




    return { message: "OTP resent successfully" };
  }
}
