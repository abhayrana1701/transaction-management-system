import { type Response, type Request, type NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";

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
export const catchError = expressAsyncHandler(
  (req: Request, res: Response, next: NextFunction) => {
    // Get the validation errors from the request
    const errors = validationResult(req);

    // Check if there are validation errors
    const isError = errors.isEmpty();

    if (!isError) {
      // If there are errors, prepare the error response and throw a 400 error
      const data = { errors: errors.array() };
      throw createHttpError(400, {
        message: "Validation error!",
        data,
      });
    } else {
      // If there are no errors, proceed to the next middleware
      next();
    }
  }
);
