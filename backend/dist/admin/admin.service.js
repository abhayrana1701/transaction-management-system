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
exports.getPendingTransactionsService = exports.approveTransferService = exports.requestTransferService = exports.approveDepositService = void 0;
const transaction_schema_1 = __importDefault(require("../transaction/transaction.schema"));
const user_schema_1 = __importDefault(require("../user/user.schema"));
const mongoose_1 = require("mongoose");
const http_errors_1 = __importDefault(require("http-errors"));
const commission_schema_1 = __importDefault(require("../commission/commission.schema"));
/**
 * Service to approve a deposit transaction.
 */
const approveDepositService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ transactionId, adminId, }) {
    const transaction = yield transaction_schema_1.default.findById(transactionId);
    if (!transaction || transaction.type !== "deposit" || transaction.status !== "pending") {
        throw (0, http_errors_1.default)(400, "Invalid transaction");
    }
    const user = yield user_schema_1.default.findById(transaction.user);
    if (!user) {
        throw (0, http_errors_1.default)(404, "User not found");
    }
    // Update user's wallet balance and transaction status
    user.walletBalance = user.walletBalance.valueOf() + transaction.amount.valueOf();
    transaction.status = "approved";
    transaction.adminApprovedBy = new mongoose_1.Types.ObjectId(adminId);
    yield user.save();
    yield transaction.save();
    return { transaction };
});
exports.approveDepositService = approveDepositService;
/**
 * Service to handle the creation of a transfer transaction.
 */
const requestTransferService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ senderId, recipientId, amount, }) {
    // Retrieve sender information
    const sender = yield user_schema_1.default.findById(senderId);
    if (!sender) {
        throw (0, http_errors_1.default)(404, "Sender not found");
    }
    // Check if the sender has sufficient balance
    if (sender.walletBalance.valueOf() < amount) {
        throw (0, http_errors_1.default)(400, "Insufficient balance");
    }
    const transaction = new transaction_schema_1.default({
        user: senderId,
        recipient: recipientId,
        amount,
        type: "transfer",
        status: "pending",
    });
    yield transaction.save();
    return { transaction };
});
exports.requestTransferService = requestTransferService;
/**
 * Service to handle the approval of a transfer transaction.
 */
const approveTransferService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ transactionId, adminId, }) {
    // Retrieve the transaction by its ID
    const transaction = yield transaction_schema_1.default.findById(transactionId);
    if (!transaction || transaction.type !== "transfer" || transaction.status !== "pending") {
        throw (0, http_errors_1.default)(400, "Invalid transaction");
    }
    // Retrieve sender and recipient users
    const sender = yield user_schema_1.default.findById(transaction.user);
    const recipient = yield user_schema_1.default.findById(transaction.recipient);
    if (!sender || !recipient) {
        throw (0, http_errors_1.default)(404, "User not found");
    }
    // Check if the sender has sufficient balance
    if (sender.walletBalance < transaction.amount) {
        throw (0, http_errors_1.default)(400, "Insufficient balance");
    }
    // Commission for the transfer (e.g., 3%)
    const commissionRate = 0.03;
    const commissionAmount = transaction.amount.valueOf() * commissionRate;
    // Deduct the transfer amount from the sender's wallet
    sender.walletBalance = Number(sender.walletBalance) - Number(transaction.amount);
    // Add the transfer amount to the recipient's wallet
    recipient.walletBalance = Number(recipient.walletBalance) + Number(transaction.amount);
    // Add the commission to the admin's wallet
    const admin = yield user_schema_1.default.findOne({ role: "admin" });
    if (admin) {
        admin.walletBalance = Number(admin.walletBalance) + commissionAmount;
        yield admin.save();
    }
    else {
        throw (0, http_errors_1.default)(404, "Admin not found");
    }
    // Update the transaction status
    transaction.status = "approved";
    transaction.adminApprovedBy = new mongoose_1.Types.ObjectId(adminId);
    // Save the updates to the database
    yield sender.save();
    yield recipient.save();
    yield transaction.save();
    // Store commission record for the admin
    const commission = new commission_schema_1.default({
        transaction: transaction._id,
        amount: commissionAmount,
        type: "transfer",
        admin: admin._id, // Optionally store the admin who received the commission
    });
    yield commission.save();
    return { transaction };
});
exports.approveTransferService = approveTransferService;
/**
 * Service to fetch pending transactions.
 */
const getPendingTransactionsService = () => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield transaction_schema_1.default.find({ status: "pending" })
        .populate("user", "name email") // Populate user details
        .populate("recipient", "name email") // Populate recipient details for transfers
        .sort({ createdAt: -1 }); // Sort by latest transactions first
    return { transactions }; // No need to throw an error, just return an empty array if no results
});
exports.getPendingTransactionsService = getPendingTransactionsService;
