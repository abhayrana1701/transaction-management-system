import TransactionModel from "./transaction.schema";
import createHttpError from "http-errors";
import UserModel from "../user/user.schema";
import CommissionModel from "../commission/commission.schema";

interface AddFundsInput {
    amount: number;
    userId: string; 
    notes: string;
}

interface ProcessWithdrawalInput {
  userId: string;
  amount: number;
  notes: string;
}

export const requestAddFundsService = async ({
    amount,
    userId,
    notes,
}: AddFundsInput) => {

  // Retrieve the user
  const user = await UserModel.findById(userId);
  if (!user) {
    throw createHttpError(404, "User not found");
  }
  
    const transaction = new TransactionModel({
        user: userId,
        amount,
        type: "deposit",
        status: "pending",
        notes: notes,
    });

    await transaction.save();
    return { transaction:transaction }; // check later
};


/**
 * Service to process a withdrawal.
 */
export const processWithdrawalService = async ({
  userId,
  amount,
  notes
}: ProcessWithdrawalInput) => {
  // Retrieve the user
  const user = await UserModel.findById(userId);
  if (!user) {
    throw createHttpError(404, "User not found");
  }

  // Check if the user has sufficient funds
  if (user.walletBalance.valueOf() < amount) {
    throw createHttpError(400, "Insufficient balance");
  }

  // Commission for the withdrawal (e.g., 3%)
  const commissionRate = 0.03;
  const commissionAmount = amount * commissionRate;
  const finalWithdrawalAmount = amount - commissionAmount;

  // Deduct the withdrawal amount from the user's wallet balance
  user.walletBalance = Number(user.walletBalance)-amount;

  // Create a withdrawal transaction record
  const transaction = new TransactionModel({
    user: userId,
    type: "withdrawal",
    amount,
    commissionAmount,
    status: "approved", // Automatically approved
    notes:notes,
  });
  console.log("Transaction type:", transaction.type); // Check for any hidden characters


  await transaction.save();

  // Store commission record
  const commission = new CommissionModel({
    transaction: transaction._id,
    amount: commissionAmount,
    type: "withdrawal",
  });
  await commission.save();

  // Update user balance and save
  await user.save();

  // Find the admin (assuming one admin exists)
  const admin = await UserModel.findOne({ role: "admin" });
  if (admin) {
    // Add commission to the admin's wallet balance
    admin.walletBalance =Number(admin.walletBalance)+ commissionAmount;
    await admin.save();
  } else {
    console.error("Admin not found.");
  }

  return { withdrawnAmount: finalWithdrawalAmount, transaction };
};
