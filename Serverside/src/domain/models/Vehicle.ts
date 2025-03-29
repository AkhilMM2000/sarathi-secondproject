import { Types } from "mongoose";

// Enum for Vehicle Type
export enum VehicleType {
  CAR = "four wheel",
  HEAVY = "Heavy",
}

export interface Vehicle {
  _id?: string;
  userId: Types.ObjectId;
  vehicleImage: string;
  rcBookImage: string;
  Register_No: string;
  ownerName: string;
  vehicleName: string;
  vehicleType: VehicleType; // Strict Enum
  polution_expire: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

