import jwt from "jsonwebtoken";
import { IUser } from "../../user/user.dto";
import { config } from "dotenv";

config();

interface TokenPayload {
  _id: string;
  email: string;
  role: string;
}

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
export const generateTokens = (payload: TokenPayload) => {
  const { ...tokenData } = payload;

  // Generate access token (expires in 15 minutes)
  const accessToken = jwt.sign(tokenData, ACCESS_TOKEN_SECRET!, {
    expiresIn: "15m",
  });

  // Generate refresh token (expires in 7 days)
  const refreshToken = jwt.sign(tokenData, REFRESH_TOKEN_SECRET!, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

/**
 * Verifies a given token using a specified secret key.
 * 
 * @param {string} token - The token to verify
 * @param {string} secretKey - The secret key used to verify the token
 * @returns {T | null} Returns the decoded payload of the token if valid, otherwise null
 * 
 * @template T - The expected type of the decoded token payload
 */
const verifyToken = <T>(token: string, secretKey: string): T | null => {
  try {
    // Verify the token and return decoded data
    const decoded = jwt.verify(token, secretKey) as T;
    return decoded;
  } catch (error) {
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
export const verifyAccessToken = (token: string): IUser | null => {
  return verifyToken<IUser>(token, ACCESS_TOKEN_SECRET!);
};

/**
 * Verifies a refresh token and returns the decoded user data.
 * 
 * @param {string} token - The refresh token to verify
 * @returns {IUser | null} Returns the decoded user object if the token is valid, otherwise null
 */
export const verifyRefreshToken = (token: string): IUser | null => {
  return verifyToken<IUser>(token, REFRESH_TOKEN_SECRET!);
};

/**
 * Refreshes the access token using a valid refresh token.
 * 
 * @param {string} refreshToken - The refresh token used to generate a new access token
 * @returns {string | null} Returns the new access token if the refresh token is valid, otherwise null
 */
export const refreshAccessToken = (refreshToken: string): string | null => {
  const user = verifyRefreshToken(refreshToken);
  if (user) {
    return generateTokens(user).accessToken;
  }
  return null;
};

/**
 * Generates a password reset token for a user.
 * 
 * @param {string} userId - The ID of the user requesting the password reset
 * @returns {string} Returns the generated password reset token
 */
export const generateResetToken = (userId: string): string => {
  return jwt.sign({ userId }, RESET_PASSWORD_SECRET!, { expiresIn: "1h" });
};

/**
 * Verifies a password reset token and returns the user ID.
 * 
 * @param {string} token - The reset token to verify
 * @returns {string | null} Returns the user ID if the token is valid, otherwise null
 */
export const verifyResetToken = (token: string): string | null => {
  const decoded = verifyToken<{ userId: string }>(token, RESET_PASSWORD_SECRET!);
  return decoded ? decoded.userId : null;
};
