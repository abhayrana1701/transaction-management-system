"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const CommissionSchema = new Schema({
    transaction: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Transaction", required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ["transfer", "withdrawal"], required: true },
});
exports.default = mongoose_1.default.model("Commission", CommissionSchema);
