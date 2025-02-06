import { type ErrorRequestHandler } from "express";
import { type ErrorResponse } from "../helper/response.helper";

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
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // Construct the error response object
  const response: ErrorResponse = {
    success: false,
    error_code: (err?.status ?? 500) as number,
    message: (err?.message ?? "Something went wrong!") as string,
    data: err?.data ?? {},
  };

  // Send the error response with the appropriate status code and message
  res.status(response.error_code).send(response);
  next();
};

export default errorHandler;
