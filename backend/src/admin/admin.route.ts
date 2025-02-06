import express from "express";
import {
  approveDepositHandler,
  requestTransferHandler,
  approveTransferHandler,
  getPendingTransactionsHandler
} from "./admin.controller";
import { authMiddleware} from "../common/middleware/auth.middleware"; // Assuming you have an admin auth middleware
import { isAdmin} from "../common/middleware/isadmin.middleware"; 

const router = express.Router();

// Route to approve deposit (Admin only)
router.post("/approve-deposit", authMiddleware, isAdmin, approveDepositHandler);

// Route to request transfer (User)
router.post("/request-transfer", authMiddleware, requestTransferHandler);

// Route to approve transfer (Admin only)
router.post("/approve-transfer", authMiddleware, isAdmin, approveTransferHandler);

// Route to fetch all pending transactions (Admin only)
router.get("/pending-transactions", authMiddleware, isAdmin, getPendingTransactionsHandler);

export default router;
