"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("./admin.controller");
const auth_middleware_1 = require("../common/middleware/auth.middleware"); // Assuming you have an admin auth middleware
const isadmin_middleware_1 = require("../common/middleware/isadmin.middleware");
const router = express_1.default.Router();
// Route to approve deposit (Admin only)
router.post("/approve-deposit", auth_middleware_1.authMiddleware, isadmin_middleware_1.isAdmin, admin_controller_1.approveDepositHandler);
// Route to request transfer (User)
router.post("/request-transfer", auth_middleware_1.authMiddleware, admin_controller_1.requestTransferHandler);
// Route to approve transfer (Admin only)
router.post("/approve-transfer", auth_middleware_1.authMiddleware, isadmin_middleware_1.isAdmin, admin_controller_1.approveTransferHandler);
// Route to fetch all pending transactions (Admin only)
router.get("/pending-transactions", auth_middleware_1.authMiddleware, isadmin_middleware_1.isAdmin, admin_controller_1.getPendingTransactionsHandler);
exports.default = router;
