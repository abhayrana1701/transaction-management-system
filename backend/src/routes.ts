import express from "express";
import userRoutes from "./user/user.route";
import transactionRoutes from "./transaction/transaction.route";
import adminRoutes from './admin/admin.route';
import commissionRoutes from './commission/commission.route';

const router = express.Router();

router.use("/users", userRoutes);
router.use("/transactions", transactionRoutes);
router.use("/admin", adminRoutes);
router.use("/admin", commissionRoutes);

export default router;