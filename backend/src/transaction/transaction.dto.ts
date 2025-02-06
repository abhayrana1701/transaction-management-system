import { type BaseSchema } from "../common/dto/base.dto";
import { Types } from "mongoose";

export interface ITransaction extends BaseSchema {
  user: Types.ObjectId;
  recipient?: Types.ObjectId; // Only for transfers
  amount: Number;
  type: "deposit" | "transfer" | "withdrawal";
  status?: "pending" | "approved" | "rejected";
  adminApprovedBy?: Types.ObjectId;
  notes: string;
}
