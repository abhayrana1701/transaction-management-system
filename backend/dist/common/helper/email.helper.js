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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResetPasswordEmail = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
/**
 * Create a transporter for sending emails via Gmail using nodemailer.
 */
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // Email username
        pass: process.env.EMAIL_PASS, // Email password
    },
});
/**
 * Sends an email using the provided details.
 *
 * @param {Object} options - The email options
 * @param {string} options.to - The recipient email address
 * @param {string} options.subject - The subject of the email
 * @param {string} options.html - The HTML content of the email
 *
 * @throws Will throw an error if the email cannot be sent.
 */
const sendEmail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ to, subject, html, }) {
    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender's email address
        to,
        subject,
        html,
    };
    try {
        // Send the email
        yield transporter.sendMail(mailOptions);
    }
    catch (error) {
        // Log and throw error if sending fails
        console.error("Error sending email:", error);
        throw new Error("Email could not be sent.");
    }
});
exports.sendEmail = sendEmail;
/**
 * Sends a password reset email to the specified email address.
 *
 * @param {string} email - The recipient's email address
 * @param {string} token - The token for password reset
 *
 * @returns {Promise<void>} Resolves when the email has been successfully sent
 *
 * @throws Will throw an error if the email cannot be sent.
 */
const sendResetPasswordEmail = (email, token) => __awaiter(void 0, void 0, void 0, function* () {
    // Construct the password reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    // Compose the message to be sent
    const message = `
    <p>Hello,</p>
    <p>We received a request to reset the password for your account.</p>
    <p>If you did not request this change, please ignore this email. If you want to proceed with resetting your password, click the link below:</p>
    <a href="${resetUrl}" target="_blank">${resetUrl}</a>
    <p>This link will expire in 1 hour for your security.</p>
    <p>Thank you for being a valued member of our platform!</p>
    <p>If you have any issues, feel free to contact support.</p>
  `;
    // Send the password reset email
    yield (0, exports.sendEmail)({
        to: email,
        subject: "Password Reset Request",
        html: message,
    });
});
exports.sendResetPasswordEmail = sendResetPasswordEmail;
