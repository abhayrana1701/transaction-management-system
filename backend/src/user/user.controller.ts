import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import * as userService from "./user.service";
import { UserCreationData, UserLoginData, UserUpdateData } from "./user.dto";
import { createResponse } from "../common/helper/response.helper";
import { generateTokens, verifyRefreshToken, verifyResetToken, generateResetToken } from "../common/helper/token.helper";
import UserModel from "./user.schema";
import { sendResetPasswordEmail } from "../common/helper/email.helper";
import { getUserFullDetails } from "./user.service";

/**
 * Handler to register a new user.
 * Creates a new user and generates access and refresh tokens.
 * 
 * @param {Request} req - The request object containing user data.
 * @param {Response} res - The response object to send the response.
 * @returns {Promise<void>} - The response with user data and tokens upon successful registration.
 */
export const registerUserHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { name, email, password }: UserCreationData = req.body;
    
    // Create a new user
    const newUser = await userService.createUser({ name, email, password });

    // Generate access and refresh tokens
    const { accessToken, refreshToken } = generateTokens({
      _id: newUser._id.toString(),
      email: newUser.email,
      role: newUser.role,
    });

    // Store the refresh token in the user's document
    await userService.updateUser(newUser._id.toString(), { refreshToken });

    // Send response with user details and tokens
    res.status(201).send(
      createResponse(
        {
          user: {
            id: newUser._id.toString(),
            name: newUser.name,
            email: newUser.email,
            role:newUser.role,
          },
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
        "User registered successfully."
      )
    );
  }
);

/**
 * Handler to log in an existing user.
 * Verifies user credentials and generates access and refresh tokens.
 * 
 * @param {Request} req - The request object containing the login credentials (email and password).
 * @param {Response} res - The response object to send the response.
 * @returns {Promise<void>} - The response with user data and tokens upon successful login.
 */
export const loginUserHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password }: UserLoginData = req.body;
    const { user, tokens } = await userService.loginUser({ email, password });

    // Store the refresh token in the user's document
    await userService.updateUser(user._id.toString(), { refreshToken: tokens.refreshToken });

    // Send response with user details and tokens
    res.send(
      createResponse(
        {
          user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          },
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
        "User logged in successfully."
      )
    );
  }
);

/**
 * Handler to log out the user.
 * Clears the refresh token from the cookies and invalidates it.
 * 
 * @param {Request} req - The request object containing the refresh token in cookies.
 * @param {Response} res - The response object to send the response.
 * @returns {Promise<void>} - The response confirming the user has been logged out.
 */
export const logoutUserHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies?.refreshToken;

    // If no refresh token, respond with an error
    if (!refreshToken) {
      res.status(400).send(createResponse(null, "No refresh token provided"));
      return;
    }

    // Log out the user (invalidate the refresh token)
    await userService.logoutUser(refreshToken);

    // Clear the refresh token cookie
    res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "strict" });
    res.status(200).send(createResponse(null, "User logged out successfully"));
  }
);

/**
 * Handler to update the user profile.
 * Allows the authenticated user to update their own details.
 * 
 * @param {Request} req - The request object containing the user's ID and the data to update.
 * @param {Response} res - The response object to send the response.
 * @returns {Promise<void>} - The response with updated user data.
 */
export const updateUserProfileHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    // Ensure the user is authenticated
    if (!req.user) {
      res.status(401).send(createResponse(null, "User not authenticated"));
      return;
    }

    const userId = req.user._id;
    const updateData: UserUpdateData = req.body;

    // Update the user's profile with the provided data
    const updatedUser = await userService.updateUser(userId, updateData);

    // Send response with the updated user data
    res.send(createResponse(updatedUser, "User profile updated successfully"));
  }
);

/**
 * Handler to refresh the user's access token using the refresh token.
 * This is used when the access token has expired but the refresh token is still valid.
 * 
 * @param {Request} req - The request object containing the refresh token.
 * @param {Response} res - The response object to send the response with new tokens.
 * @returns {Promise<void>} - The response with new access and refresh tokens.
 */
export const refreshTokenHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;

    // If no refresh token, respond with an error
    if (!refreshToken) {
      res.status(401).json({ message: "Refresh token is required" });
      return;
    }

    // Verify the refresh token's validity
    const userPayload = verifyRefreshToken(refreshToken);

    if (!userPayload) {
      res.status(401).json({ message: "Invalid or expired refresh token" });
      return;
    }

    // Fetch the user from the database
    const user = await UserModel.findById(userPayload._id);
    if (!user || user.refreshToken !== refreshToken) {
      res.status(403).json({ message: "Invalid refresh token" });
      return;
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens({
      _id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Update the user's refresh token
    user.refreshToken = newRefreshToken;
    await user.save();

    // Set the new refresh token as a cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    // Respond with the new tokens
    res.json({ accessToken, refreshToken: newRefreshToken });
  }
);

/**
 * Handler to initiate the password reset process.
 * Sends a password reset email to the user with a reset token.
 * 
 * @param {Request} req - The request object containing the user's email.
 * @param {Response} res - The response object to send the response.
 * @returns {Promise<void>} - The response confirming the password reset email has been sent.
 */
export const forgotPasswordHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    // Check if the user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(404).send(createResponse(null, "User not found"));
      return;
    }

    // Generate a reset token and update the user's resetToken field
    const resetToken = generateResetToken(user._id);
    await userService.updateUser(user._id.toString(), { resetToken });

    // Send the reset password email with the reset token
    await sendResetPasswordEmail(user.email, resetToken);

    // Respond confirming the email has been sent
    res.status(200).send(createResponse(null, "Reset password email sent"));
  }
);

/**
 * Handler to reset the user's password.
 * Verifies the reset token and updates the user's password.
 * 
 * @param {Request} req - The request object containing the reset token and new password.
 * @param {Response} res - The response object to send the response.
 * @returns {Promise<void>} - The response confirming the password has been reset.
 */
export const resetPasswordHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { token, newPassword } = req.body;

    // Verify the reset token and get the user's ID
    const userId = verifyResetToken(token);
    if (!userId) {
      res.status(400).send(createResponse(null, "Invalid or expired reset token"));
      return;
    }

    // Update the user's password and clear the reset token
    await userService.updateUser(userId, { password: newPassword, resetToken: null });

    // Respond confirming the password reset
    res.status(200).send(createResponse(null, "Password reset successfully"));
  }
);

/**
 * Handler to change the user's password.
 * Verifies the current password and updates to the new one.
 * 
 * @param {Request} req - The request object containing the user's ID, current password, and new password.
 * @param {Response} res - The response object to send the response.
 * @returns {Promise<void>} - The response confirming the password has been changed.
 */
export const changePasswordHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    // Ensure the user is authenticated
    if (!req.user) {
      res.status(401).send(createResponse(null, "User not authenticated"));
      return;
    }

    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    // Change the user's password
    await userService.changePassword(userId, currentPassword, newPassword);

    // Respond confirming the password has been changed
    res.status(200).send(createResponse(null, "Password changed successfully"));
  }
);


/**
 * Controller to send the full details of the authenticated user along with all their transactions.
 */
export const getUserProfileHandler= asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    // Ensure the user is authenticated (authentication middleware should set req.user)
    if (!req.user) {
      res.status(401).send(createResponse(null, "User not authenticated"));
      return;
    }

    // Extract the user ID from the authenticated user object.
    const userId = req.user._id;

    // Call the service to retrieve the user details and transactions.
    const result = await getUserFullDetails(userId);

    // Send the response including both user details and transactions.
    res
      .status(200)
      .send(createResponse(result, "User details and transactions retrieved successfully"));
  }
);
