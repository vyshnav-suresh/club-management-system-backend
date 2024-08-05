import mongoose, { model } from "mongoose";
import { ProjectType } from "../../../appTypes/project";
import { COLLECTION_PROJECT } from "..";



type IModel = Document & {};
type modelType = IModel &
    Pick<
    ProjectType,
    | "title"
    | "description"
    | "images"
    | "signature"
    | "languages"
    | "role"
    > & {};

const modelSchema : mongoose.Schema<modelType> = new mongoose.Schema(
    {
        title : {type : String},
        description : {type : String},
        images : {type : [String] },
        signature : {type : String },
        languages : {type : [String]},
        role : {type : String},
    },{
        timestamps : true,
        versionKey :false
    }
)


const ProjectModel = mongoose.model<modelType>(
    COLLECTION_PROJECT,
    modelSchema,
    COLLECTION_PROJECT
)

export default ProjectModel;