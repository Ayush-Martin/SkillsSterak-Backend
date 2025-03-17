import mongoose from "mongoose";

/**
 * A utility function to convert a given string to a mongoose ObjectId.
 * @param {string} id - The string to be converted
 * @returns {ObjectId} - The converted ObjectId
 */
export const getObjectId = (id: string): mongoose.Schema.Types.ObjectId => {
  return id as unknown as mongoose.Schema.Types.ObjectId;
};
