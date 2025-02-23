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
    aadhaarNumber: string;
    licenseNumber: string;
    aadhaarImage: string;
    licenseImage: string;
    status: "pending" | "approved" | "rejected";
    isBlock: boolean; 
    role:"driver",
    createdAt?: Date;
  }
  