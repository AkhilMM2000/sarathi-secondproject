import { User } from "../models/User" ;
export type UserWithVehicleCount = User & { vehicleCount: number };
export interface IUserRepository {
  create(user: User): Promise<User>
  getUserById(userId: string): Promise<User | null>; 
  findByEmail(email: string): Promise<User|null>
  getUsers(): Promise<UserWithVehicleCount[]|null>;
  blockOrUnblockUser(userId: string, isBlock: boolean): Promise<UserWithVehicleCount | null>
  updateUser(userId: string, data: Partial<User>): Promise<User | null>;
}
