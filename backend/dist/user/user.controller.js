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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfileHandler = exports.changePasswordHandler = exports.resetPasswordHandler = exports.forgotPasswordHandler = exports.refreshTokenHandler = exports.updateUserProfileHandler = exports.logoutUserHandler = exports.loginUserHandler = exports.registerUserHandler = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const userService = __importStar(require("./user.service"));
const response_helper_1 = require("../common/helper/response.helper");
const token_helper_1 = require("../common/helper/token.helper");
const user_schema_1 = __importDefault(require("./user.schema"));
const email_helper_1 = require("../common/helper/email.helper");
const user_service_1 = require("./user.service");
/**
 * Handler to register a new user.
 * Creates a new user and generates access and refresh tokens.
 *
 * @param {Request} req - The request object containing user data.
 * @param {Response} res - The response object to send the response.
 * @returns {Promise<void>} - The response with user data and tokens upon successful registration.
 */
exports.registerUserHandler = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    // Create a new user
    const newUser = yield userService.createUser({ name, email, password });
    // Generate access and refresh tokens
    const { accessToken, refreshToken } = (0, token_helper_1.generateTokens)({
        _id: newUser._id.toString(),
        email: newUser.email,
        role: newUser.role,
    });
    // Store the refresh token in the user's document
    yield userService.updateUser(newUser._id.toString(), { refreshToken });
    // Send response with user details and tokens
    res.status(201).send((0, response_helper_1.createResponse)({
        user: {
            id: newUser._id.toString(),
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
        },
        accessToken: accessToken,
        refreshToken: refreshToken,
    }, "User registered successfully."));
}));
/**
 * Handler to log in an existing user.
 * Verifies user credentials and generates access and refresh tokens.
 *
 * @param {Request} req - The request object containing the login credentials (email and password).
 * @param {Response} res - The response object to send the response.
 * @returns {Promise<void>} - The response with user data and tokens upon successful login.
 */
exports.loginUserHandler = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const { user, tokens } = yield userService.loginUser({ email, password });
    // Store the refresh token in the user's document
    yield userService.updateUser(user._id.toString(), { refreshToken: tokens.refreshToken });
    // Send response with user details and tokens
    res.send((0, response_helper_1.createResponse)({
        user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
        },
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
    }, "User logged in successfully."));
}));
/**
 * Handler to log out the user.
 * Clears the refresh token from the cookies and invalidates it.
 *
 * @param {Request} req - The request object containing the refresh token in cookies.
 * @param {Response} res - The response object to send the response.
 * @returns {Promise<void>} - The response confirming the user has been logged out.
 */
exports.logoutUserHandler = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const refreshToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
    // If no refresh token, respond with an error
    if (!refreshToken) {
        res.status(400).send((0, response_helper_1.createResponse)(null, "No refresh token provided"));
        return;
    }
    // Log out the user (invalidate the refresh token)
    yield userService.logoutUser(refreshToken);
    // Clear the refresh token cookie
    res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "strict" });
    res.status(200).send((0, response_helper_1.createResponse)(null, "User logged out successfully"));
}));
/**
 * Handler to update the user profile.
 * Allows the authenticated user to update their own details.
 *
 * @param {Request} req - The request object containing the user's ID and the data to update.
 * @param {Response} res - The response object to send the response.
 * @returns {Promise<void>} - The response with updated user data.
 */
exports.updateUserProfileHandler = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Ensure the user is authenticated
    if (!req.user) {
        res.status(401).send((0, response_helper_1.createResponse)(null, "User not authenticated"));
        return;
    }
    const userId = req.user._id;
    const updateData = req.body;
    // Update the user's profile with the provided data
    const updatedUser = yield userService.updateUser(userId, updateData);
    // Send response with the updated user data
    res.send((0, response_helper_1.createResponse)(updatedUser, "User profile updated successfully"));
}));
/**
 * Handler to refresh the user's access token using the refresh token.
 * This is used when the access token has expired but the refresh token is still valid.
 *
 * @param {Request} req - The request object containing the refresh token.
 * @param {Response} res - The response object to send the response with new tokens.
 * @returns {Promise<void>} - The response with new access and refresh tokens.
 */
exports.refreshTokenHandler = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.body;
    // If no refresh token, respond with an error
    if (!refreshToken) {
        res.status(401).json({ message: "Refresh token is required" });
        return;
    }
    // Verify the refresh token's validity
    const userPayload = (0, token_helper_1.verifyRefreshToken)(refreshToken);
    if (!userPayload) {
        res.status(401).json({ message: "Invalid or expired refresh token" });
        return;
    }
    // Fetch the user from the database
    const user = yield user_schema_1.default.findById(userPayload._id);
    if (!user || user.refreshToken !== refreshToken) {
        res.status(403).json({ message: "Invalid refresh token" });
        return;
    }
    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = (0, token_helper_1.generateTokens)({
        _id: user._id.toString(),
        email: user.email,
        role: user.role,
    });
    // Update the user's refresh token
    user.refreshToken = newRefreshToken;
    yield user.save();
    // Set the new refresh token as a cookie
    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
    });
    // Respond with the new tokens
    res.json({ accessToken, refreshToken: newRefreshToken });
}));
/**
 * Handler to initiate the password reset process.
 * Sends a password reset email to the user with a reset token.
 *
 * @param {Request} req - The request object containing the user's email.
 * @param {Response} res - The response object to send the response.
 * @returns {Promise<void>} - The response confirming the password reset email has been sent.
 */
exports.forgotPasswordHandler = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    // Check if the user exists
    const user = yield user_schema_1.default.findOne({ email });
    if (!user) {
        res.status(404).send((0, response_helper_1.createResponse)(null, "User not found"));
        return;
    }
    // Generate a reset token and update the user's resetToken field
    const resetToken = (0, token_helper_1.generateResetToken)(user._id);
    yield userService.updateUser(user._id.toString(), { resetToken });
    // Send the reset password email with the reset token
    yield (0, email_helper_1.sendResetPasswordEmail)(user.email, resetToken);
    // Respond confirming the email has been sent
    res.status(200).send((0, response_helper_1.createResponse)(null, "Reset password email sent"));
}));
/**
 * Handler to reset the user's password.
 * Verifies the reset token and updates the user's password.
 *
 * @param {Request} req - The request object containing the reset token and new password.
 * @param {Response} res - The response object to send the response.
 * @returns {Promise<void>} - The response confirming the password has been reset.
 */
exports.resetPasswordHandler = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, newPassword } = req.body;
    // Verify the reset token and get the user's ID
    const userId = (0, token_helper_1.verifyResetToken)(token);
    if (!userId) {
        res.status(400).send((0, response_helper_1.createResponse)(null, "Invalid or expired reset token"));
        return;
    }
    // Update the user's password and clear the reset token
    yield userService.updateUser(userId, { password: newPassword, resetToken: null });
    // Respond confirming the password reset
    res.status(200).send((0, response_helper_1.createResponse)(null, "Password reset successfully"));
}));
/**
 * Handler to change the user's password.
 * Verifies the current password and updates to the new one.
 *
 * @param {Request} req - The request object containing the user's ID, current password, and new password.
 * @param {Response} res - The response object to send the response.
 * @returns {Promise<void>} - The response confirming the password has been changed.
 */
exports.changePasswordHandler = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Ensure the user is authenticated
    if (!req.user) {
        res.status(401).send((0, response_helper_1.createResponse)(null, "User not authenticated"));
        return;
    }
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;
    // Change the user's password
    yield userService.changePassword(userId, currentPassword, newPassword);
    // Respond confirming the password has been changed
    res.status(200).send((0, response_helper_1.createResponse)(null, "Password changed successfully"));
}));
/**
 * Controller to send the full details of the authenticated user along with all their transactions.
 */
exports.getUserProfileHandler = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Ensure the user is authenticated (authentication middleware should set req.user)
    if (!req.user) {
        res.status(401).send((0, response_helper_1.createResponse)(null, "User not authenticated"));
        return;
    }
    // Extract the user ID from the authenticated user object.
    const userId = req.user._id;
    // Call the service to retrieve the user details and transactions.
    const result = yield (0, user_service_1.getUserFullDetails)(userId);
    // Send the response including both user details and transactions.
    res
        .status(200)
        .send((0, response_helper_1.createResponse)(result, "User details and transactions retrieved successfully"));
}));
