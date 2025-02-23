import { injectable } from "tsyringe";
import { IDriverRepository } from "../../domain/repositories/IDriverepository";
import { Driver } from "../../domain/models/Driver";
import DriverModel from "./modals/Driverschema";// MongoDB Schema

@injectable()
export class MongoDriverRepository implements IDriverRepository {
  async create(driver: Driver): Promise<Driver> {
    const newDriver = new DriverModel(driver);
    const savedDriver = await newDriver.save();

    // Convert to a plain JavaScript object
    return savedDriver.toObject() as Driver;
  }

  async findByEmail(email: string): Promise<Driver | null> {
    return await DriverModel.findOne({ email });
  }

 

  async updateStatus(driverId: string, status: "pending" | "approved" | "rejected"): Promise<void> {
    await DriverModel.findByIdAndUpdate(driverId, { status });
  }

  async blockDriver(driverId: string, isBlocked: boolean): Promise<void> {
    await DriverModel.findByIdAndUpdate(driverId, { isBlocked });
  }

}
