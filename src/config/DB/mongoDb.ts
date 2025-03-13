import { connect } from "mongoose";
import { config } from "dotenv";

config();

const MONGO_URI = process.env.MONGO_URI || "";

/**
 * Connects to the MongoDB database using the MONGO_URI environment variable.
 * If the connection is successful, logs a success message to the console.
 * If the connection fails, logs the error to the console.
 */
const connectToMongoDB = async (): Promise<void> => {
  try {
    await connect(MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }
};

export default connectToMongoDB;
