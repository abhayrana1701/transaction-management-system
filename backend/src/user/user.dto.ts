import { type BaseSchema } from "../common/dto/base.dto";

export interface IUser extends BaseSchema {
  name: string;
  email: string;
  password: string;
  refreshToken?: string;
  role: "user" | "admin"; 
  walletBalance: Number;
}

export interface UserCreationData {
  name: string;
  email: string;
  password: string;
}

export interface UserLoginData {
  email: string;
  password: string;
}

export interface UserUpdateData {
  name?: string;
  email?: string;
  password?: string;
  refreshToken?: string;
  resetToken?: string | null;
}