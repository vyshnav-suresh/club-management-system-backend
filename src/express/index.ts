import express, {  Express } from "express";

import allRoute from "../routes";
const cors = require('cors');


const app: Express = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use("/upload", express.static("upload"));
app.use("/", allRoute);



export default app;