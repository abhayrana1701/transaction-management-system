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
const userController = __importStar(require("./user.controller"));
const userValidation = __importStar(require("./user.validation"));
const auth_middleware_1 = require("../common/middleware/auth.middleware");
const catch_error_middleware_1 = require("../common/middleware/catch-error.middleware");
const router = (0, express_1.Router)();
router.post("/register", userValidation.createUser, catch_error_middleware_1.catchError, userController.registerUserHandler);
router.post("/login", userValidation.loginUser, catch_error_middleware_1.catchError, userController.loginUserHandler);
router.get("/profile", auth_middleware_1.authMiddleware, userController.getUserProfileHandler);
router.put("/profile", auth_middleware_1.authMiddleware, userValidation.updateUser, catch_error_middleware_1.catchError, userController.updateUserProfileHandler);
router.post("/logout", auth_middleware_1.authMiddleware, catch_error_middleware_1.catchError, userController.logoutUserHandler);
router.post("/forgot-password", userValidation.forgotPassword, catch_error_middleware_1.catchError, userController.forgotPasswordHandler);
router.post("/reset-password", userValidation.resetPassword, catch_error_middleware_1.catchError, userController.resetPasswordHandler);
router.post("/change-password", auth_middleware_1.authMiddleware, userValidation.changePassword, catch_error_middleware_1.catchError, userController.changePasswordHandler);
router.post("/refresh-token", userController.refreshTokenHandler);
exports.default = router;
