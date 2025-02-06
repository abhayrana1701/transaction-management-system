"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyRateLimiter = exports.limiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
/**
 * Rate limiter middleware configuration.
 *
 * This middleware is used to limit the number of requests a client can make in a given time window.
 * If the client exceeds the maximum number of requests, a 429 (Too Many Requests) status is returned.
 *
 * @constant
 */
exports.limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
});
/**
 * Apply rate limiting to incoming requests.
 *
 * This function applies the rate limiting middleware to the request pipeline,
 * ensuring that requests are limited according to the defined configuration.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @param {NextFunction} next - The next middleware function to be called.
 */
const applyRateLimiter = (req, res, next) => {
    (0, exports.limiter)(req, res, next);
};
exports.applyRateLimiter = applyRateLimiter;
