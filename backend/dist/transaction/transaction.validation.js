"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const express_validator_1 = require("express-validator");
exports.createUser = [
    (0, express_validator_1.body)("amount")
        .notEmpty()
        .withMessage("Amount is required.")
        .isNumeric()
        .withMessage("Amount must be a number.")
        .custom((value) => {
        if (parseFloat(value) <= 0) {
            throw new Error("Amount must be greater than 0.");
        }
        return true;
    }),
];
