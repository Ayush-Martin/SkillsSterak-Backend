import { IResponse } from "../interfaces/IResponse";

/**
 * A function to generate a success json Response
 * 
 * @param {string} message - The success message to be returned
 * @param {T} [data] - The data to be returned, defaults to `null`
 * @returns {IResponse<T>} - The success response
 */
export const successResponse = <T>(message: string, data?: T): IResponse<T> => {
  return { success: true, message, data };
};

/**
 * A function to generate an error JSON response.
 * 
 * @param {string} error - The error message to be returned.
 * @returns {IResponse<null>} - The error response.
 */
export const errorResponse = (error: string): IResponse<null> => {
  // Return an object conforming to the IResponse interface with success set to false and the error message.
  return { success: false, error };
};
