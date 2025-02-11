import { config } from "dotenv";
import connectToMongoDB from "./config/mongoDb";
import app from "./app";

config();

const PORT = process.env.PORT || 5000;

connectToMongoDB();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
