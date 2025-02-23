import nodemailer from "nodemailer";
import { injectable } from "tsyringe";

@injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail", // Use your email provider
      auth: {
        user: process.env.EMAIL_USER, // Set in .env
        pass: process.env.EMAIL_PASS, // Set in .env
      },
    });
  }

  async sendOTP(email: string, otp: string): Promise<void> {
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
    };
    
    await this.transporter.sendMail(mailOptions);
  }
}
