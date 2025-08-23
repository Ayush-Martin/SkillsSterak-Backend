import { connect } from "mongoose";
import envConfig from "../env";

const MONGO_URI = envConfig.MONGO_URI;

/**
 * Establishes a connection to the MongoDB database.
 *
 * Uses the configured `MONGO_URI` from environment variables.
 * Logs a success message when the connection is established.
 * Logs an error if the connection attempt fails.
 *
 * @returns {Promise<void>} Resolves once the connection is established.
 */
const connectToMongoDB = async (): Promise<void> => {
  try {
    await connect(MONGO_URI);
    console.info("[Database] Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }
};

export default connectToMongoDB;
