
import express from "express"
import projectRoutes from "./project";

const allRoute = express.Router();

allRoute.use("/project",projectRoutes)

allRoute.get("/hello", (req, res) => {
    res.send('Hello World!');
  });

export default allRoute;