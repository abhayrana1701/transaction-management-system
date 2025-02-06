"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserFullDetails = exports.changePassword = exports.refreshAccessTokenService = exports.logoutUser = exports.getUserById = exports.updateUser = exports.loginUser = exports.createUser = void 0;
const user_schema_1 = __importDefault(require("./user.schema"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_helper_1 = require("../common/helper/token.helper");
const http_errors_1 = __importDefault(require("http-errors"));
const transaction_schema_1 = __importDefault(require("../transaction/transaction.schema"));
/**
 * Encrypts a plain-text password using bcrypt.
 *
 * @param {string} password - The plain-text password to be encrypted.
 * @returns {Promise<string>} The encrypted password.
 */
const encryptPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.hash(password, 12);
});
/**
 * Checks if a user already exists in the database by email.
 *
 * @param {string} email - The email to check for existing users.
 * @returns {Promise<boolean>} Returns `true` if the email is already taken, otherwise `false`.
 */
const emailExists = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_schema_1.default.findOne({ email });
    return !!user;
});
/**
 * Creates a new user in the database.
 *
 * @param {UserCreationData} userData - The data required to create a new user.
 * @returns {Promise<any>} The newly created user object.
 * @throws {HttpError} If the email is already in use, a 400 error is thrown.
 */
const createUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = userData;
    if (yield emailExists(email)) {
        throw (0, http_errors_1.default)(400, "This email is already in use.");
    }
    const newUser = new user_schema_1.default({
        name,
        email,
        password,
    });
    yield newUser.save();
    return newUser;
});
exports.createUser = createUser;
/**
 * Logs in a user by validating the email and password, and generating tokens.
 *
 * @param {UserLoginData} loginData - The login credentials (email and password).
 * @returns {Promise<{user: any, tokens: {accessToken: string, refreshToken: string}}>}
 * The logged-in user and generated tokens (access and refresh).
 * @throws {HttpError} If the email or password is incorrect, a 401 error is thrown.
 */
const loginUser = (loginData) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = loginData;
    const user = yield user_schema_1.default.findOne({ email });
    if (!user) {
        throw (0, http_errors_1.default)(401, "Incorrect email or password.");
    }
    // const isPasswordCorrect = await bcrypt.compare(password, user.password);
    // if (!isPasswordCorrect) {
    //   throw createHttpError(401, "Incorrect email or password.");
    // }
    const { accessToken, refreshToken } = (0, token_helper_1.generateTokens)({
        _id: user._id.toString(),
        email: user.email,
        role: user.role,
    });
    console.log(user._id.toString());
    return {
        user,
        tokens: { accessToken, refreshToken },
    };
});
exports.loginUser = loginUser;
/**
 * Updates the user information. Optionally updates the password if provided.
 *
 * @param {string} userId - The ID of the user to be updated.
 * @param {UserUpdateData} updateData - The data to update the user (including password).
 * @returns {Promise<any>} The updated user object.
 * @throws {HttpError} If no user is found with the given ID, a 404 error is thrown.
 */
const updateUser = (userId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = updateData, otherFields = __rest(updateData, ["password"]);
    const updatedFields = Object.assign({}, otherFields);
    if (password) {
        updatedFields.password = yield encryptPassword(password);
    }
    const updatedUser = yield user_schema_1.default.findByIdAndUpdate(userId, updatedFields, { new: true });
    if (!updatedUser) {
        throw (0, http_errors_1.default)(404, "No user found with this ID.");
    }
    return updatedUser;
});
exports.updateUser = updateUser;
/**
 * Retrieves a user by their ID.
 *
 * @param {string} userId - The ID of the user to retrieve.
 * @returns {Promise<any | null>} The user object or null if not found.
 * @throws {HttpError} If no user is found, a 404 error is thrown.
 */
const getUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_schema_1.default.findById(userId);
    if (!user) {
        throw (0, http_errors_1.default)(404, "No user exists with the provided ID.");
    }
    return user;
});
exports.getUserById = getUserById;
/**
 * Logs out a user by invalidating their refresh token.
 *
 * @param {string} refreshToken - The refresh token to invalidate.
 * @returns {Promise<void>} Resolves with no return value.
 */
const logoutUser = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    yield user_schema_1.default.findOneAndUpdate({ refreshToken }, { refreshToken: null });
});
exports.logoutUser = logoutUser;
/**
 * Refreshes the access token using a valid refresh token.
 *
 * @param {string} refreshToken - The refresh token to generate a new access token.
 * @returns {Promise<{ accessToken: string }>} The new access token.
 * @throws {HttpError} If the refresh token is invalid or expired, a 401 error is thrown.
 */
const refreshAccessTokenService = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const newAccessToken = (0, token_helper_1.refreshAccessToken)(refreshToken);
    if (!newAccessToken) {
        throw (0, http_errors_1.default)(401, "Invalid or expired refresh token.");
    }
    return { accessToken: newAccessToken };
});
exports.refreshAccessTokenService = refreshAccessTokenService;
/**
 * Changes the password of a user after validating the current password.
 *
 * @param {string} userId - The ID of the user whose password needs to be changed.
 * @param {string} currentPassword - The current password to validate.
 * @param {string} newPassword - The new password to set.
 * @returns {Promise<void>} Resolves with no return value.
 * @throws {HttpError} If the current password is incorrect or the user is not found, an error is thrown.
 */
const changePassword = (userId, currentPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_schema_1.default.findById(userId);
    if (!user) {
        throw (0, http_errors_1.default)(404, "User not found.");
    }
    const isPasswordValid = yield bcrypt_1.default.compare(currentPassword, user.password);
    if (!isPasswordValid) {
        throw (0, http_errors_1.default)(400, "The current password you entered is incorrect.");
    }
    const encryptedNewPassword = yield encryptPassword(newPassword);
    user.password = encryptedNewPassword;
    yield user.save();
});
exports.changePassword = changePassword;
/**
 * Retrieves all details of a user along with all transactions in which the user is involved.
 * @param userId - The ID of the user.
 * @returns An object containing the user details and an array of transactions.
 */
const getUserFullDetails = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Retrieve the user (all fields are returned)
    const user = yield user_schema_1.default.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    const transactions = yield transaction_schema_1.default.find({
        $or: [{ user: userId }, { recipient: userId }],
    })
        .populate("recipient", "name") // Only include the recipient's name
        .populate("adminApprovedBy", "name");
    return { user, transactions };
});
exports.getUserFullDetails = getUserFullDetails;
