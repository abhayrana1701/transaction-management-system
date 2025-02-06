"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createResponse = void 0;
/**
 * Creates a standard success response object.
 *
 * @param {IResponse["data"]} data - The data to include in the response.
 * @param {string} [message] - An optional message providing additional information.
 *
 * @returns {IResponse} The response object with success set to true, and provided data and message.
 */
const createResponse = (data, message) => {
    return { data, message, success: true };
};
exports.createResponse = createResponse;
