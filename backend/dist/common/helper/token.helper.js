"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyResetToken = exports.generateResetToken = exports.refreshAccessToken = exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateTokens = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const RESET_PASSWORD_SECRET = process.env.RESET_PASSWORD_SECRET;
/**
 * Generates access and refresh tokens based on the provided payload.
 *
 * @param {TokenPayload} payload - The data to include in the JWT payload (e.g., user ID and email)
 * @returns {Object} An object containing both the access token and refresh token
 * @returns {string} returns accessToken - The generated access token
 * @returns {string} returns refreshToken - The generated refresh token
 */
const generateTokens = (payload) => {
    const tokenData = __rest(payload, []);
    // Generate access token (expires in 15 minutes)
    const accessToken = jsonwebtoken_1.default.sign(tokenData, ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    });
    // Generate refresh token (expires in 7 days)
    const refreshToken = jsonwebtoken_1.default.sign(tokenData, REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    });
    return { accessToken, refreshToken };
};
exports.generateTokens = generateTokens;
/**
 * Verifies a given token using a specified secret key.
 *
 * @param {string} token - The token to verify
 * @param {string} secretKey - The secret key used to verify the token
 * @returns {T | null} Returns the decoded payload of the token if valid, otherwise null
 *
 * @template T - The expected type of the decoded token payload
 */
const verifyToken = (token, secretKey) => {
    try {
        // Verify the token and return decoded data
        const decoded = jsonwebtoken_1.default.verify(token, secretKey);
        return decoded;
    }
    catch (error) {
        // Log the error if verification fails
        console.error("Error verifying token:", error);
        return null;
    }
};
/**
 * Verifies an access token and returns the decoded user data.
 *
 * @param {string} token - The access token to verify
 * @returns {IUser | null} Returns the decoded user object if the token is valid, otherwise null
 */
const verifyAccessToken = (token) => {
    return verifyToken(token, ACCESS_TOKEN_SECRET);
};
exports.verifyAccessToken = verifyAccessToken;
/**
 * Verifies a refresh token and returns the decoded user data.
 *
 * @param {string} token - The refresh token to verify
 * @returns {IUser | null} Returns the decoded user object if the token is valid, otherwise null
 */
const verifyRefreshToken = (token) => {
    return verifyToken(token, REFRESH_TOKEN_SECRET);
};
exports.verifyRefreshToken = verifyRefreshToken;
/**
 * Refreshes the access token using a valid refresh token.
 *
 * @param {string} refreshToken - The refresh token used to generate a new access token
 * @returns {string | null} Returns the new access token if the refresh token is valid, otherwise null
 */
const refreshAccessToken = (refreshToken) => {
    const user = (0, exports.verifyRefreshToken)(refreshToken);
    if (user) {
        return (0, exports.generateTokens)(user).accessToken;
    }
    return null;
};
exports.refreshAccessToken = refreshAccessToken;
/**
 * Generates a password reset token for a user.
 *
 * @param {string} userId - The ID of the user requesting the password reset
 * @returns {string} Returns the generated password reset token
 */
const generateResetToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, RESET_PASSWORD_SECRET, { expiresIn: "1h" });
};
exports.generateResetToken = generateResetToken;
/**
 * Verifies a password reset token and returns the user ID.
 *
 * @param {string} token - The reset token to verify
 * @returns {string | null} Returns the user ID if the token is valid, otherwise null
 */
const verifyResetToken = (token) => {
    const decoded = verifyToken(token, RESET_PASSWORD_SECRET);
    return decoded ? decoded.userId : null;
};
exports.verifyResetToken = verifyResetToken;
