import connectToMongoDB from "./config/DB/mongoDb";
import connectToRedis from "./config/DB/redis";
import app from "./app";
import http from "http";
import setUpSocket from "./config/socket";
import envConfig from "./config/env";

connectToMongoDB();
connectToRedis();

const server = http.createServer(app);

export const io = setUpSocket(server);

server.listen(envConfig.PORT, () => {
  console.log(`Server is running on port ${envConfig.PORT}`);
});
