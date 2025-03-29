import { Driver } from "../models/Driver";

export interface IDriverRepository {
  create(driver: Driver): Promise<Driver>;
  findByEmail(email: string): Promise<Driver | null>;
  getDrivers(): Promise<Driver[]>; 
  findDriverById(driverId: string): Promise<Driver | null>; 
  updateStatus(driverId: string, status: "pending" | "approved" | "rejected", reason?: string):Promise<Driver | null>; 
  blockOrUnblockDriver(driverId: string, isBlocked: boolean): Promise<void>;
  update(userId: string, data: Partial<Driver>): Promise<Driver | null>;
}
