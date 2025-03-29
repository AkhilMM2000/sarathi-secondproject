import { ObjectId } from "mongoose";

export interface User {
  _id?: ObjectId; 
  name: string;
  email: string;
  mobile: string;
  profile:string;
  location?: {
    latitude: number;
    longitude: number;
  };
  place?:string;
  password: string;
  googleId?: string;
  referralCode?: string;
  role: "user" | "admin"; 
  isBlock:Boolean;
  createdAt?: Date;
}
