import { injectable } from "tsyringe";
import { IUserRepository, UserWithVehicleCount } from "../../domain/repositories/IUserepository"; 
import { User } from "../../domain/models/User";
import UserModel from "./modals/userschema";  // MongoDB Schema
import { isValidObjectId, Types } from "mongoose";


@injectable()
export class MongoUserRepository implements IUserRepository {
  async create(user: User): Promise<User> {
    try {
      const newUser = new UserModel(user);
      const savedUser = await newUser.save();
      return savedUser.toObject() as User;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Failed to create user");
    }
  }
  async updateUser(userId: string, data: Partial<User>): Promise<User | null> {
    if (!isValidObjectId(userId)) throw new Error("Invalid user ID");
     
    const user = await UserModel.findById(userId);
    if (!user) return null;
  
    Object.assign(user, data);
  
    await user.save();
  
    return user.toObject() as User;
  }
    
  async findByEmail(email: string): Promise<User | null> {
    try {
      return await UserModel.findOne({ email });
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw new Error("Failed to find user");
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    try {
      if (!isValidObjectId(userId)) return null; // ✅ Validate ID format
      return await UserModel.findById(new Types.ObjectId(userId));
    } catch (error) {
      console.error("Error finding user by ID:", error);
      throw new Error("Failed to find user by ID");
    }
  }
  
  
  async getUsers():Promise<UserWithVehicleCount[]|null>{
    try {
      const usersWithVehicleCount = await UserModel.aggregate([
        {
          $lookup: {
            from: "vehicles",
            localField: "_id",
            foreignField: "userId",
            as: "vehicles",
          },
        },
        {
          $addFields: {
            vehicleCount: { $size: "$vehicles" },
          },
        },
        {
          $project: {
            password: 0, // Hide sensitive fields
            vehicles: 0, // Remove vehicles array if not needed
          },
        },
      ]);

      return usersWithVehicleCount;
    } catch (error) {
      console.log(error);
      
      throw new Error(`Failed to get users: ${(error as Error).message}`);
    }
  }
  
async blockOrUnblockUser(userId: string,isBlock: boolean): Promise<UserWithVehicleCount | null> {
  try {
    if (!isValidObjectId(userId.trim())) {
      throw new Error("Invalid userId format");
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId.trim(),
      { isBlock },
      { new: true }
    ).lean();

    if (!updatedUser) {
      return null; // User not found
    }

    // Fetch vehicle count
    const vehicleCountResult = await UserModel.aggregate([
      {
        $match: { _id: new Types.ObjectId(userId.trim()) },
      },
      {
        $lookup: {
          from: "vehicles",
          localField: "_id",
          foreignField: "userId",
          as: "vehicles",
        },
      },
      {
        $addFields: {
          vehicleCount: { $size: "$vehicles" },
        },
      },
      {
        $project: {
          vehicles: 0, // Remove vehicles array
        },
      },
    ]);

    if (vehicleCountResult.length === 0) {
      return null;
    }

    return {
      ...updatedUser,
      vehicleCount: vehicleCountResult[0].vehicleCount,
    } as unknown as UserWithVehicleCount; 
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to block user: ${(error as Error).message}`);
  }
}
}