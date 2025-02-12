import { connect } from "mongoose";
import { config } from "dotenv";

config();

const MONGO_URI = process.env.MONGO_URI || "";

const connectToMongoDB = async () => {
  try {
    await connect(MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }
};

export default connectToMongoDB;
