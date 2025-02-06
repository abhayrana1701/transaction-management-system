import { body } from "express-validator";

export const createUser = [
  body("amount")
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
