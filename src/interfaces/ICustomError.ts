/**
 * Extends the standard Error object to include an optional status code. Used to provide richer error information for HTTP responses and custom error handling.
 */
export interface ICustomError extends Error {
  status?: number | string;
}
