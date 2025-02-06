"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchError = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const express_validator_1 = require("express-validator");
const http_errors_1 = __importDefault(require("http-errors"));
/**
 * Middleware to catch validation errors from the `express-validator` library.
 *
 * This middleware checks if the validation result from `express-validator` is valid.
 * If there are validation errors, it throws a `400 Bad Request` error with the error details.
 * If there are no validation errors, it proceeds to the next middleware.
 *
 * @param {Request} req - The incoming request object
 * @param {Response} res - The outgoing response object
 * @param {NextFunction} next - The next function in the middleware stack
 *
 * @returns {void} This function doesn't return anything. It either throws an error or calls `next()`.
 */
exports.catchError = (0, express_async_handler_1.default)((req, res, next) => {
    // Get the validation errors from the request
    const errors = (0, express_validator_1.validationResult)(req);
    // Check if there are validation errors
    const isError = errors.isEmpty();
    if (!isError) {
        // If there are errors, prepare the error response and throw a 400 error
        const data = { errors: errors.array() };
        throw (0, http_errors_1.default)(400, {
            message: "Validation error!",
            data,
        });
    }
    else {
        // If there are no errors, proceed to the next middleware
        next();
    }
});
