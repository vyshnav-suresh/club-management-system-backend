import express from "express"
import { createOrUpdateProject, getAllPojects } from "../../controllers/project/projectController"
import { saveMedia, saveMedias } from "../../common/media";


const projectRoutes = express.Router()

projectRoutes.post("/add/:id?",saveMedias("project",[{name :"images" },{name : "signature"}]),createOrUpdateProject);
projectRoutes.get("/get",getAllPojects);


export default projectRoutes