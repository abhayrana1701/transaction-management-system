import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

/**
 * Rate limiter middleware configuration.
 * 
 * This middleware is used to limit the number of requests a client can make in a given time window.
 * If the client exceeds the maximum number of requests, a 429 (Too Many Requests) status is returned.
 * 
 * @constant
 */
export const limiter = rateLimit({
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
export const applyRateLimiter = (req: Request, res: Response, next: NextFunction) => {
  limiter(req, res, next); 
};
