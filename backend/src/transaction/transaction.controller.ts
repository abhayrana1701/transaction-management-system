import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import * as transactionService from "./transaction.service"; 
import { createResponse } from "../common/helper/response.helper"; 

/**
 * Handler to request adding funds to the user's account.
 * 
 * @param {Request} req - The request object containing the amount to be deposited.
 * @param {Response} res - The response object to send the response.
 * @returns {Promise<void>} - The response confirming the deposit request has been sent.
 */
export const requestAddFundsHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { amount,notes } = req.body;
    if (!req.user) {
      res.status(401).send(createResponse(null, "User not authenticated"));
      return;
    }
    const userId = req.user._id; 

    // Call the service function to request adding funds
    const result = await transactionService.requestAddFundsService({ amount, userId,notes });

    // Send response with success message
    res.status(201).send(createResponse(result, "Deposit request sent. Awaiting admin approval."));
  }
);

/**
 * Controller to process a withdrawal request.
 */
export const processWithdrawalHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { amount,notes } = req.body;

    if (!req.user) {
      res.status(401).send(createResponse(null, "User not authenticated"));
      return;
    }

    const userId = req.user._id;

    // Call the service to process the withdrawal
    const result = await transactionService.processWithdrawalService({
      userId,
      amount,
      notes,
    });

    res.status(200).send(
      createResponse(result, "Withdrawal processed successfully")
    );
  }
);


