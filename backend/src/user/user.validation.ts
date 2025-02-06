import { body } from "express-validator";

export const createUser = [
  body("name")
    .notEmpty()
    .withMessage("Name is required.")
    .isString()
    .withMessage("Name must be a string."),
  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("The email must be in a valid format."),
  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isString()
    .withMessage("Password must be a string.")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long."),
];

export const loginUser = [
  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("The email must be in a valid format."),
  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isString()
    .withMessage("Password must be a string.")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];

export const updateUser = [
  body("name")
    .optional()
    .isString()
    .withMessage("Name must be a string."),
  body("email")
    .optional()
    .isEmail()
    .withMessage("The email must be in a valid format."),
  body("password")
    .optional()
    .isString()
    .withMessage("Password must be a string.")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];

export const forgotPassword = [
  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("The email must be in a valid format."),
];

export const resetPassword = [
  body("token").notEmpty().withMessage("Reset token is required."),
  body("newPassword")
    .notEmpty()
    .withMessage("New password is required.")
    .isString()
    .withMessage("New password must be a string.")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters long."),
];

export const changePassword = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required.")
    .isString()
    .withMessage("Current password must be a string."),
  body("newPassword")
    .notEmpty()
    .withMessage("New password is required.")
    .isString()
    .withMessage("New password must be a string.")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters long."),
];