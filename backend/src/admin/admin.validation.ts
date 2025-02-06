import { body } from "express-validator";

export const requestTransferValidation = [
  body("recipientId")
    .notEmpty()
    .withMessage("Recipient ID is required.")
    .isString()
    .withMessage("Recipient ID must be a string."),
  body("amount")
    .notEmpty()
    .withMessage("Amount is required.")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be a number greater than 0."),
];
