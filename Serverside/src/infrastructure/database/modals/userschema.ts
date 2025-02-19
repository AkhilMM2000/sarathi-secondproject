import mongoose, { Schema, Document } from "mongoose";
import { User } from "../../../domain/models/User";

interface UserDocument extends Omit<User, "_id">, Document {}

const UserSchema = new Schema<UserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true },
  referralCode: { type: String },
  isBlock:{type:Boolean,default:false},
  role:{type:String,required:true,default:'user'},
  createdAt: { type: Date, default: Date.now },
  
});

export default mongoose.model<UserDocument>("User", UserSchema);




