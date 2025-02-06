import { type BaseSchema } from "../common/dto/base.dto";
import { Types } from "mongoose";

export interface ICommission extends BaseSchema {
  transaction: Types.ObjectId;
  amount: Number;
  type: "local" | "international";
}
