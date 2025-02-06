import { Router } from "express";
import * as transactionController from "./transaction.controller";
import { authMiddleware } from "../common/middleware/auth.middleware";  // Protect routes that require authentication
import { catchError } from "../common/middleware/catch-error.middleware";  // Handle errors

const router = Router();

// Route to request adding funds to the user's account
router.post(
  "/request-add-funds",  // Endpoint for requesting funds
  authMiddleware,  // Ensure the user is authenticated
  catchError,  // Catch any errors that occur
  transactionController.requestAddFundsHandler  // Handle the fund request logic
);

// Route to process a withdrawal request
router.post(
  "/process-withdrawal",  // Endpoint for processing withdrawals
  authMiddleware,  // Ensure the user is authenticated
  catchError,  // Catch any errors that occur
  transactionController.processWithdrawalHandler  // Handle the withdrawal logic
);

export default router;
