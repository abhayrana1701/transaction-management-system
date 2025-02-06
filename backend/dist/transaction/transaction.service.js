"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processWithdrawalService = exports.requestAddFundsService = void 0;
const transaction_schema_1 = __importDefault(require("./transaction.schema"));
const http_errors_1 = __importDefault(require("http-errors"));
const user_schema_1 = __importDefault(require("../user/user.schema"));
const commission_schema_1 = __importDefault(require("../commission/commission.schema"));
const requestAddFundsService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ amount, userId, notes, }) {
    // Retrieve the user
    const user = yield user_schema_1.default.findById(userId);
    if (!user) {
        throw (0, http_errors_1.default)(404, "User not found");
    }
    const transaction = new transaction_schema_1.default({
        user: userId,
        amount,
        type: "deposit",
        status: "pending",
        notes: notes,
    });
    yield transaction.save();
    return { transaction: transaction }; // check later
});
exports.requestAddFundsService = requestAddFundsService;
/**
 * Service to process a withdrawal.
 */
const processWithdrawalService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId, amount, notes }) {
    // Retrieve the user
    const user = yield user_schema_1.default.findById(userId);
    if (!user) {
        throw (0, http_errors_1.default)(404, "User not found");
    }
    // Check if the user has sufficient funds
    if (user.walletBalance.valueOf() < amount) {
        throw (0, http_errors_1.default)(400, "Insufficient balance");
    }
    // Commission for the withdrawal (e.g., 3%)
    const commissionRate = 0.03;
    const commissionAmount = amount * commissionRate;
    const finalWithdrawalAmount = amount - commissionAmount;
    // Deduct the withdrawal amount from the user's wallet balance
    user.walletBalance = Number(user.walletBalance) - amount;
    // Create a withdrawal transaction record
    const transaction = new transaction_schema_1.default({
        user: userId,
        type: "withdrawal",
        amount,
        commissionAmount,
        status: "approved", // Automatically approved
        notes: notes,
    });
    console.log("Transaction type:", transaction.type); // Check for any hidden characters
    yield transaction.save();
    // Store commission record
    const commission = new commission_schema_1.default({
        transaction: transaction._id,
        amount: commissionAmount,
        type: "withdrawal",
    });
    yield commission.save();
    // Update user balance and save
    yield user.save();
    // Find the admin (assuming one admin exists)
    const admin = yield user_schema_1.default.findOne({ role: "admin" });
    if (admin) {
        // Add commission to the admin's wallet balance
        admin.walletBalance = Number(admin.walletBalance) + commissionAmount;
        yield admin.save();
    }
    else {
        console.error("Admin not found.");
    }
    return { withdrawnAmount: finalWithdrawalAmount, transaction };
});
exports.processWithdrawalService = processWithdrawalService;
