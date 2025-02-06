import mongoose from "mongoose";
import { type ICommission} from "./commision.dto";

const Schema = mongoose.Schema;

const CommissionSchema = new Schema<ICommission>({
    transaction: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction", required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ["transfer", "withdrawal"], required: true },
});

export default mongoose.model("Commission", CommissionSchema);
