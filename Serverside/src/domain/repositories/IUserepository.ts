import { User } from "../models/User" ;

export interface IUserRepository {
  create(user: User): Promise<User>;
  findByEmail(email: string): Promise<User|null>;
}
