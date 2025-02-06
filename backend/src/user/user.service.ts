import { UserCreationData, UserLoginData, UserUpdateData } from "./user.dto";
import UserModel from "./user.schema";
import bcrypt from "bcrypt";
import { generateTokens, refreshAccessToken } from "../common/helper/token.helper";
import createHttpError from "http-errors";
import Transaction from "../transaction/transaction.schema";

/**
 * Encrypts a plain-text password using bcrypt.
 * 
 * @param {string} password - The plain-text password to be encrypted.
 * @returns {Promise<string>} The encrypted password.
 */
const encryptPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 12);
};

/**
 * Checks if a user already exists in the database by email.
 * 
 * @param {string} email - The email to check for existing users.
 * @returns {Promise<boolean>} Returns `true` if the email is already taken, otherwise `false`.
 */
const emailExists = async (email: string): Promise<boolean> => {
  const user = await UserModel.findOne({ email });
  return !!user;
};

/**
 * Creates a new user in the database.
 * 
 * @param {UserCreationData} userData - The data required to create a new user.
 * @returns {Promise<any>} The newly created user object.
 * @throws {HttpError} If the email is already in use, a 400 error is thrown.
 */
export const createUser = async (userData: UserCreationData): Promise<any> => {
  const { name, email, password } = userData;

  if (await emailExists(email)) {
    throw createHttpError(400, "This email is already in use.");
  }

  const newUser = new UserModel({
    name,
    email,
    password,
  });

  await newUser.save();
  return newUser;
};

/**
 * Logs in a user by validating the email and password, and generating tokens.
 * 
 * @param {UserLoginData} loginData - The login credentials (email and password).
 * @returns {Promise<{user: any, tokens: {accessToken: string, refreshToken: string}}>} 
 * The logged-in user and generated tokens (access and refresh).
 * @throws {HttpError} If the email or password is incorrect, a 401 error is thrown.
 */
export const loginUser = async (loginData: UserLoginData) => {
  const { email, password } = loginData;

  const user = await UserModel.findOne({ email });

  if (!user) {
    throw createHttpError(401, "Incorrect email or password.");
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw createHttpError(401, "Incorrect email or password.");
  }

  const { accessToken, refreshToken } = generateTokens({
    _id: user._id.toString(),
    email: user.email,
    role:user.role,
  });
  console.log(user._id.toString());

  return {
    user,
    tokens: { accessToken, refreshToken },
  };
};

/**
 * Updates the user information. Optionally updates the password if provided.
 * 
 * @param {string} userId - The ID of the user to be updated.
 * @param {UserUpdateData} updateData - The data to update the user (including password).
 * @returns {Promise<any>} The updated user object.
 * @throws {HttpError} If no user is found with the given ID, a 404 error is thrown.
 */
export const updateUser = async (userId: string, updateData: UserUpdateData): Promise<any> => {
  const { password, ...otherFields } = updateData;
  const updatedFields: Partial<any> = { ...otherFields };

  if (password) {
    updatedFields.password = await encryptPassword(password);
  }

  const updatedUser = await UserModel.findByIdAndUpdate(userId, updatedFields, { new: true });

  if (!updatedUser) {
    throw createHttpError(404, "No user found with this ID.");
  }

  return updatedUser;
};

/**
 * Retrieves a user by their ID.
 * 
 * @param {string} userId - The ID of the user to retrieve.
 * @returns {Promise<any | null>} The user object or null if not found.
 * @throws {HttpError} If no user is found, a 404 error is thrown.
 */
export const getUserById = async (userId: string): Promise<any | null> => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw createHttpError(404, "No user exists with the provided ID.");
  }

  return user;
};

/**
 * Logs out a user by invalidating their refresh token.
 * 
 * @param {string} refreshToken - The refresh token to invalidate.
 * @returns {Promise<void>} Resolves with no return value.
 */
export const logoutUser = async (refreshToken: string): Promise<void> => {
  await UserModel.findOneAndUpdate({ refreshToken }, { refreshToken: null });
};

/**
 * Refreshes the access token using a valid refresh token.
 * 
 * @param {string} refreshToken - The refresh token to generate a new access token.
 * @returns {Promise<{ accessToken: string }>} The new access token.
 * @throws {HttpError} If the refresh token is invalid or expired, a 401 error is thrown.
 */
export const refreshAccessTokenService = async (refreshToken: string) => {
  const newAccessToken = refreshAccessToken(refreshToken);

  if (!newAccessToken) {
    throw createHttpError(401, "Invalid or expired refresh token.");
  }
  return { accessToken: newAccessToken };
};

/**
 * Changes the password of a user after validating the current password.
 * 
 * @param {string} userId - The ID of the user whose password needs to be changed.
 * @param {string} currentPassword - The current password to validate.
 * @param {string} newPassword - The new password to set.
 * @returns {Promise<void>} Resolves with no return value.
 * @throws {HttpError} If the current password is incorrect or the user is not found, an error is thrown.
 */
export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw createHttpError(404, "User not found.");
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    throw createHttpError(400, "The current password you entered is incorrect.");
  }

  const encryptedNewPassword = await encryptPassword(newPassword);
  user.password = encryptedNewPassword;

  await user.save();
};


/**
 * Retrieves all details of a user along with all transactions in which the user is involved.
 * @param userId - The ID of the user.
 * @returns An object containing the user details and an array of transactions.
 */
export const getUserFullDetails = async (userId: string) => {
  // Retrieve the user (all fields are returned)
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const transactions = await Transaction.find({
    $or: [{ user: userId }, { recipient: userId }],
  })
    .populate("recipient", "name")  // Only include the recipient's name
    .populate("adminApprovedBy", "name");

  return { user, transactions };
};
