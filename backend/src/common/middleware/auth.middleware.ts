import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../helper/token.helper";

/**
 * Middleware to authenticate the user based on the access token in the request header.
 * 
 * This middleware will check if the `Authorization` header is present, and if the token is valid.
 * If the token is valid, the user is added to the request object and the next middleware is called.
 * If the token is invalid or missing, an error is passed to the next middleware.
 * 
 * @param {Request} req - The incoming request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The function to pass control to the next middleware
 * 
 * @returns {Promise<void>} This function does not return anything. It calls next() to pass control to the next middleware.
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Retrieve the authorization header
    const authHeader = req.headers.authorization;

    // Check if authorization header is missing
    if (!authHeader) {
      return next({ status: 401, message: "Access token is required." });
    }

    // Extract the token from the header (assuming Bearer token format)
    const token = authHeader.split(" ")[1];

    // If the token is missing after splitting, return an error
    if (!token) {
      return next({ status: 401, message: "Invalid token format. Token is required." });
    }

    // Verify the token and retrieve the user
    const user = verifyAccessToken(token);

    // If the token is invalid or expired, return an error
    if (!user) {
      return next({ status: 401, message: "Invalid or expired access token." });
    }

    // Add the user to the request object to be accessed in the next middleware
    req.user = user;

    // Pass control to the next middleware
    next();
  } catch (error) {
    // Pass any errors to the error-handling middleware
    next(error);
  }
};
