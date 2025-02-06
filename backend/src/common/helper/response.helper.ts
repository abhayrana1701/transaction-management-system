/**
 * Interface representing the structure of a response.
 * 
 * @interface
 */
interface IResponse {
  success: boolean;
  message?: string;
  data: object | null | any;
}

/**
 * Type representing an error response. Extends IResponse with an additional error code.
 * 
 * @type {ErrorResponse}
 */
export type ErrorResponse = IResponse & {
  error_code: number;
};

/**
 * Creates a standard success response object.
 * 
 * @param {IResponse["data"]} data - The data to include in the response.
 * @param {string} [message] - An optional message providing additional information.
 * 
 * @returns {IResponse} The response object with success set to true, and provided data and message.
 */
export const createResponse = (
  data: IResponse["data"],
  message?: string
): IResponse => {
  return { data, message, success: true };
};
