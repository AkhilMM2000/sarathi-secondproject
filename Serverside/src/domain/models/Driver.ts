import { ObjectId } from "mongoose";

export interface Driver {
    _id?:ObjectId;
    name: string;
    email: string;
    mobile: string;
    password: string;
    profileImage: string;
    location: {
      latitude: number;
      longitude: number;
    };
    place:string;
    aadhaarNumber: string;
    licenseNumber: string;
    aadhaarImage: string;
    licenseImage: string;
    status: "pending" | "approved" | "rejected";
    isBlock: boolean; 
    role:"driver",
    reason?: string; 
    createdAt?: Date;
  }
  