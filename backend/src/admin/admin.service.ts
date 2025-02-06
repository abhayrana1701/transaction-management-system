import TransactionModel from "../transaction/transaction.schema";
import UserModel from "../user/user.schema";
import { Types } from "mongoose";
import createHttpError from "http-errors";
import CommissionModel from "../commission/commission.schema"; 

interface ApproveDepositInput {
  transactionId: string;
  adminId: string;
}

interface RequestTransferInput {
  senderId: string;
  recipientId: string;
  amount: number;
}

interface ApproveTransferInput {
  transactionId: string;
  adminId: string;
}

/**
 * Service to approve a deposit transaction.
 */
export const approveDepositService = async ({
  transactionId,
  adminId,
}: ApproveDepositInput) => {
  
  const transaction = await TransactionModel.findById(transactionId);
  if (!transaction || transaction.type !== "deposit" || transaction.status !== "pending") {
    throw createHttpError(400, "Invalid transaction");
  }

  const user = await UserModel.findById(transaction.user);
  if (!user) {
    throw createHttpError(404, "User not found");
  }

  // Update user's wallet balance and transaction status
  user.walletBalance = user.walletBalance.valueOf() + transaction.amount.valueOf();
  transaction.status = "approved";
  transaction.adminApprovedBy = new Types.ObjectId(adminId);

  await user.save();
  await transaction.save();

  return { transaction };
};

interface RequestTransferInput {
  senderId: string;
  recipientId: string;
  amount: number;
}

/**
 * Service to handle the creation of a transfer transaction.
 */
export const requestTransferService = async ({
  senderId,
  recipientId,
  amount,
}: RequestTransferInput) => {
  // Retrieve sender information
  const sender = await UserModel.findById(senderId);
  if (!sender) {
    throw createHttpError(404, "Sender not found");
  }
  
  // Check if the sender has sufficient balance
  if (sender.walletBalance.valueOf() < amount) {
    throw createHttpError(400, "Insufficient balance");
  }

  const transaction = new TransactionModel({
    user: senderId,
    recipient: recipientId,
    amount,
    type: "transfer",
    status: "pending",
  });

  await transaction.save();
  return { transaction };
};


interface ApproveTransferInput {
  transactionId: string;
  adminId: string;
}

/**
 * Service to handle the approval of a transfer transaction.
 */
export const approveTransferService = async ({
  transactionId,
  adminId,
}: ApproveTransferInput) => {
  // Retrieve the transaction by its ID
  const transaction = await TransactionModel.findById(transactionId);
  if (!transaction || transaction.type !== "transfer" || transaction.status !== "pending") {
    throw createHttpError(400, "Invalid transaction");
  }

  // Retrieve sender and recipient users
  const sender = await UserModel.findById(transaction.user);
  const recipient = await UserModel.findById(transaction.recipient);

  if (!sender || !recipient) {
    throw createHttpError(404, "User not found");
  }

  // Check if the sender has sufficient balance
  if (sender.walletBalance < transaction.amount) {
    throw createHttpError(400, "Insufficient balance");
  }

  // Commission for the transfer (e.g., 3%)
  const commissionRate = 0.03;
  const commissionAmount = transaction.amount.valueOf() * commissionRate;

  // Deduct the transfer amount from the sender's wallet
  sender.walletBalance = Number(sender.walletBalance) - Number(transaction.amount);

  // Add the transfer amount to the recipient's wallet
  recipient.walletBalance = Number(recipient.walletBalance) + Number(transaction.amount);

  // Add the commission to the admin's wallet
  const admin = await UserModel.findOne({ role: "admin" });
  if (admin) {
    admin.walletBalance = Number(admin.walletBalance)+commissionAmount;
    await admin.save();
  } else {
    throw createHttpError(404, "Admin not found");
  }

  // Update the transaction status
  transaction.status = "approved";
  transaction.adminApprovedBy = new Types.ObjectId(adminId);

  // Save the updates to the database
  await sender.save();
  await recipient.save();
  await transaction.save();

  // Store commission record for the admin
  const commission = new CommissionModel({
    transaction: transaction._id,
    amount: commissionAmount,
    type: "transfer",
    admin: admin._id, // Optionally store the admin who received the commission
  });

  await commission.save();

  return { transaction };
};

/**
 * Service to fetch pending transactions.
 */
export const getPendingTransactionsService = async () => {
  const transactions = await TransactionModel.find({ status: "pending" })
    .populate("user", "name email") // Populate user details
    .populate("recipient", "name email") // Populate recipient details for transfers
    .sort({ createdAt: -1 }); // Sort by latest transactions first

  return { transactions }; // No need to throw an error, just return an empty array if no results
};
