import { IResponse } from "../interfaces/IResponse";

export const successResponse = <T>(message: string, data?: T): IResponse<T> => {
  return { success: true, message, data };
};

export const errorResponse = (error: string): IResponse<null> => {
  return { success: false, error };
};
