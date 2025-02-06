"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transactionController = __importStar(require("./transaction.controller"));
const auth_middleware_1 = require("../common/middleware/auth.middleware"); // Protect routes that require authentication
const catch_error_middleware_1 = require("../common/middleware/catch-error.middleware"); // Handle errors
const router = (0, express_1.Router)();
// Route to request adding funds to the user's account
router.post("/request-add-funds", // Endpoint for requesting funds
auth_middleware_1.authMiddleware, // Ensure the user is authenticated
catch_error_middleware_1.catchError, // Catch any errors that occur
transactionController.requestAddFundsHandler // Handle the fund request logic
);
// Route to process a withdrawal request
router.post("/process-withdrawal", // Endpoint for processing withdrawals
auth_middleware_1.authMiddleware, // Ensure the user is authenticated
catch_error_middleware_1.catchError, // Catch any errors that occur
transactionController.processWithdrawalHandler // Handle the withdrawal logic
);
exports.default = router;
