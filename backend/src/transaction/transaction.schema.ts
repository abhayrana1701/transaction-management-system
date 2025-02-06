import mongoose from "mongoose";
import { type ITransaction } from "./transaction.dto";

const Schema = mongoose.Schema;

const TransactionSchema = new Schema<ITransaction>({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // Only for transfers
    amount: { type: Number, required: true },
    type: { type: String, enum: ["deposit", "transfer", "withdrawal"], required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    adminApprovedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    notes:{ type: String, default: "-" }
});

export default mongoose.model("Transaction", TransactionSchema);
