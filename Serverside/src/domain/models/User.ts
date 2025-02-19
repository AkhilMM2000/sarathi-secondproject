import { ObjectId } from "mongoose";

export interface User {
  _id?: ObjectId; 
  name: string;
  email: string;
  mobile: string;
  password: string;
  referralCode?: string;
  role: "user" | "admin"; 
  isBlock:Boolean;
  createdAt?: Date;
}
