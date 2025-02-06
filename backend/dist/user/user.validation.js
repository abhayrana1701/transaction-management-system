"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.resetPassword = exports.forgotPassword = exports.updateUser = exports.loginUser = exports.createUser = void 0;
const express_validator_1 = require("express-validator");
exports.createUser = [
    (0, express_validator_1.body)("name")
        .notEmpty()
        .withMessage("Name is required.")
        .isString()
        .withMessage("Name must be a string."),
    (0, express_validator_1.body)("email")
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("The email must be in a valid format."),
    (0, express_validator_1.body)("password")
        .notEmpty()
        .withMessage("Password is required.")
        .isString()
        .withMessage("Password must be a string.")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long."),
];
exports.loginUser = [
    (0, express_validator_1.body)("email")
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("The email must be in a valid format."),
    (0, express_validator_1.body)("password")
        .notEmpty()
        .withMessage("Password is required.")
        .isString()
        .withMessage("Password must be a string.")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long"),
];
exports.updateUser = [
    (0, express_validator_1.body)("name")
        .optional()
        .isString()
        .withMessage("Name must be a string."),
    (0, express_validator_1.body)("email")
        .optional()
        .isEmail()
        .withMessage("The email must be in a valid format."),
    (0, express_validator_1.body)("password")
        .optional()
        .isString()
        .withMessage("Password must be a string.")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long"),
];
exports.forgotPassword = [
    (0, express_validator_1.body)("email")
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("The email must be in a valid format."),
];
exports.resetPassword = [
    (0, express_validator_1.body)("token").notEmpty().withMessage("Reset token is required."),
    (0, express_validator_1.body)("newPassword")
        .notEmpty()
        .withMessage("New password is required.")
        .isString()
        .withMessage("New password must be a string.")
        .isLength({ min: 8 })
        .withMessage("New password must be at least 8 characters long."),
];
exports.changePassword = [
    (0, express_validator_1.body)("currentPassword")
        .notEmpty()
        .withMessage("Current password is required.")
        .isString()
        .withMessage("Current password must be a string."),
    (0, express_validator_1.body)("newPassword")
        .notEmpty()
        .withMessage("New password is required.")
        .isString()
        .withMessage("New password must be a string.")
        .isLength({ min: 8 })
        .withMessage("New password must be at least 8 characters long."),
];
