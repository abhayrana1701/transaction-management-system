"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestTransferValidation = void 0;
const express_validator_1 = require("express-validator");
exports.requestTransferValidation = [
    (0, express_validator_1.body)("recipientId")
        .notEmpty()
        .withMessage("Recipient ID is required.")
        .isString()
        .withMessage("Recipient ID must be a string."),
    (0, express_validator_1.body)("amount")
        .notEmpty()
        .withMessage("Amount is required.")
        .isFloat({ gt: 0 })
        .withMessage("Amount must be a number greater than 0."),
];
