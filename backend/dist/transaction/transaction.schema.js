"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const TransactionSchema = new Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    recipient: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: false }, // Only for transfers
    amount: { type: Number, required: true },
    type: { type: String, enum: ["deposit", "transfer", "withdrawal"], required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    adminApprovedBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: false },
    notes: { type: String, default: "-" }
});
exports.default = mongoose_1.default.model("Transaction", TransactionSchema);
