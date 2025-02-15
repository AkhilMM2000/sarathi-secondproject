import { injectable } from "tsyringe";
import { IUserRepository } from "../../domain/repositories/IUserepository"; 
import { User } from "../../domain/models/User";
import UserModel from "./modals/userschema";  // MongoDB Schema

@injectable()
export class MongoUserRepository implements IUserRepository {
  async create(user: User): Promise<User> {
    const newUser = new UserModel(user);
    return await newUser.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return await UserModel.findOne({ email });
  }
 
  
}
