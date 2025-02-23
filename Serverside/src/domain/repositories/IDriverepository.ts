import { Driver } from "../models/Driver";

export interface IDriverRepository {
  create(driver: Driver): Promise<Driver>;
  findByEmail(email: string): Promise<Driver | null>;

  updateStatus(driverId: string, status: "pending" | "approved" | "rejected"): Promise<void>;
  blockDriver(driverId: string, isBlocked: boolean): Promise<void>;
}
