"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// commission.routes.ts
const express_1 = require("express");
const commission_controller_1 = require("./commission.controller");
const auth_middleware_1 = require("../common/middleware/auth.middleware");
const isadmin_middleware_1 = require("../common/middleware/isadmin.middleware");
const router = (0, express_1.Router)();
// Route to get all commissions (Admin only)
router.get("/", auth_middleware_1.authMiddleware, isadmin_middleware_1.isAdmin, commission_controller_1.getAllCommissionsController);
exports.default = router;
