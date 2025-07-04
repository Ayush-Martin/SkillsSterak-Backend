import { connect } from "mongoose";
import envConfig from "../env";

const MONGO_URI = envConfig.MONGO_URI;

/**
 * Connects to the MongoDB database using the provided MONGO_URI.
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
