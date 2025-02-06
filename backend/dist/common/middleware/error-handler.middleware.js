"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Global error handler middleware.
 *
 * This middleware is used to catch errors in the application and format them into a standard response
 * format, sending them back to the client with an appropriate HTTP status code.
 *
 * @param {Error} err - The error object that was thrown in the application
 * @param {Request} req - The incoming request object
 * @param {Response} res - The outgoing response object
 * @param {NextFunction} next - The next middleware function in the pipeline
 *
 * @returns {void} This function does not return anything. It sends an error response and passes control to the next middleware.
 */
const errorHandler = (err, req, res, next) => {
    var _a, _b, _c;
    // Construct the error response object
    const response = {
        success: false,
        error_code: ((_a = err === null || err === void 0 ? void 0 : err.status) !== null && _a !== void 0 ? _a : 500),
        message: ((_b = err === null || err === void 0 ? void 0 : err.message) !== null && _b !== void 0 ? _b : "Something went wrong!"),
        data: (_c = err === null || err === void 0 ? void 0 : err.data) !== null && _c !== void 0 ? _c : {},
    };
    // Send the error response with the appropriate status code and message
    res.status(response.error_code).send(response);
    next();
};
exports.default = errorHandler;
