import dotenv from "dotenv";
import http from "http";
dotenv.config();
import connectDB from "./src/database";
import app from "./src/express";


connectDB();

const server = http.createServer(app);

server.listen(process.env.NODE_PORT, () => {
  console.log("Server Started at Port :" + process.env.NODE_PORT);
});
