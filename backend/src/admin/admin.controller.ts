import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import * as transactionService from "./admin.service";
import { createResponse } from "../common/helper/response.helper";
import { sendEmail } from "../common/helper/email.helper";
import UserModel from "../user/user.schema";

/**
 * Handler to approve a deposit transaction.
 */
export const approveDepositHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { transactionId } = req.body;

    if (!transactionId) {
      res.status(400).send(createResponse(null, "Transaction ID is required"));
      return;
    }

    if (!req.user) {
      res.status(401).send(createResponse(null, "User not authenticated"));
      return;
    }

    const adminId = req.user._id;

    // Call the service function to approve deposit
    const result = await transactionService.approveDepositService({ transactionId, adminId });

    const user = await UserModel.findById(result.transaction.user).select("email");
    // Send email to the user notifying them of the approval.
    // Assume result.user.email contains the user's email.
    if(user){
      await sendEmail({
        to: user.email,
        subject: "Deposit Approved",
        html: `<p>Your deposit transaction with ID <strong>${transactionId}</strong> has been approved by our admin.</p>`
      });
    }

    // Send response with success message
    res.status(200).send(createResponse(result, "Deposit approved successfully"));
  }
);

/**
 * Handler to request a funds transfer to another user.
 */
export const requestTransferHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { recipientId, amount } = req.body;

    if (!req.user) {
      res.status(401).send(createResponse(null, "User not authenticated"));
      return;
    }

    const senderId = req.user._id;

    // Call service function to create the transfer request
    const result = await transactionService.requestTransferService({
      senderId,
      recipientId,
      amount,
    });

    res.status(201).send(
      createResponse(result, "Transfer request sent. Awaiting admin approval.")
    );
  }
);

/**
 * Handler to approve a transfer transaction.
 */
export const approveTransferHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { transactionId } = req.body;

    if (!transactionId) {
      res.status(400).send(createResponse(null, "Transaction ID is required"));
      return;
    }

    if (!req.user) {
      res.status(401).send(createResponse(null, "User not authenticated"));
      return;
    }

    const adminId = req.user._id;

    // Call service function to approve transfer
    const result = await transactionService.approveTransferService({
      transactionId,
      adminId,
    });

    const user = await UserModel.findById(result.transaction.user).select("email");
    if(user){
      await sendEmail({
        to: user.email,
        subject: "Transfer Approved",
        html: `<p>Your transfer transaction with ID <strong>${transactionId}</strong> has been approved by our admin.</p>`
      });
    }

    res
      .status(200)
      .send(createResponse(result, "Transfer approved successfully"));
  }
);

/**
 * Handler to retrieve all pending transactions.
 */
export const getPendingTransactionsHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {

    if (!req.user) {
      res.status(401).send(createResponse(null, "Admin not authenticated"));
      return;
    }

    const result = await transactionService.getPendingTransactionsService();
    res.status(200).send(createResponse(result, "Pending transactions retrieved successfully"));
  }
);
