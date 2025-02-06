// commission.routes.ts
import { Router } from "express";
import { getAllCommissionsController } from "./commission.controller";
import { authMiddleware } from "../common/middleware/auth.middleware";
import { isAdmin } from "../common/middleware/isadmin.middleware";

const router = Router();

// Route to get all commissions (Admin only)
router.get("/", authMiddleware, isAdmin, getAllCommissionsController);

export default router;
