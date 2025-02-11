export interface ICustomError extends Error {
  status?: number | string;
}
