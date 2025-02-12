import { config } from "dotenv";
import connectToMongoDB from "./config/DB/mongoDb";
import connectToRedis from "./config/DB/redis";
import app from "./app";

config();

const PORT = process.env.PORT || 5000;

connectToMongoDB();
connectToRedis();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
