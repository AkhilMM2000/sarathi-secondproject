import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../../domain/repositories/IUserepository"; 
import { UserRegistrationStore } from "../../infrastructure/store/UserRegisterStore";
import { User } from "../../domain/models/User";

@injectable()
export class VerifyOTP {
  constructor(@inject("IUserRepository") private userRepository: IUserRepository) {}

  async execute(email: string, otp: string) {
    const store = UserRegistrationStore.getInstance();
    const userData = store.getUser(email);
   console.log(userData);
   

    if (!userData) throw new Error("OTP expired or invalid");
  
    if (userData.otp !== otp || userData.otpExpires < new Date()) {
      throw new Error("Invalid or expired OTP");
    }
    // OTP verified, remove user from memory
    store.removeUser(email);

    // Save user in the database
    const user = await this.userRepository.create(userData);

    return { message: "OTP verified, user registered", user };
  }
}
