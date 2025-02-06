"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
/**
 * Middleware to check if the authenticated user is an admin.
 *
 * @param {Request} req - The incoming request object (should have `user` from authMiddleware)
 * @param {Response} res - The response object
 * @param {NextFunction} next - The function to pass control to the next middleware
 */
const isAdmin = (req, res, next) => {
    try {
        // Check if user is attached to request by authMiddleware
        if (!req.user) {
            return next({ status: 401, message: "Unauthorized: User not found." });
        }
        // Check if user is an admin
        if (req.user.role !== "admin") {
            return next({ status: 403, message: "Forbidden: Admins only." });
        }
        // User is admin, proceed to next middleware
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.isAdmin = isAdmin;
