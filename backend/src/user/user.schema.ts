
import mongoose from "mongoose";
import { type IUser } from "./user.dto";
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;

const UserSchema = new Schema<IUser>({
        name: { 
          type: String, 
          required: true 
        },
        email: { 
          type: String, 
          required: true 
        },
        password: { 
          type: String, 
          required: true 
        },
        refreshToken: {
          type: String,
          required: false,
          default: null,
        },
        role: { 
          type: String, 
          enum: ["user", "admin"], 
          default: "user"
        },
        walletBalance: { 
          type: Number, 
          default: 1000 // I have kept 1000 for testing purposes, later need to set to 0 
        },
});

const hashPassword = async (password: string) => {
  const hash = await bcrypt.hash(password, 12);
  return hash;
};

UserSchema.pre("save", async function (next) {
        if (this.password) {
                this.password = await hashPassword(this.password);
        }
        next();
});

export default mongoose.model<IUser>("User", UserSchema);