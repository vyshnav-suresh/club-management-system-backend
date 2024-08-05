import { RequestHandler } from "express";
import { FieldValidationError, validationResult } from "express-validator";
import { errorResponse } from "../../config";
import ProjectModel from "../../database/models/project/projectModel";
import { getPaginationParams, response200, response404, response500 } from "../../common/response";
import { paginationQueryBuilder } from "../../common/mongoose";
import { deleteImage, deleteImages, getImagesFromReq, saveMedia, } from "../../common/media";


export const createOrUpdateProject : RequestHandler = async (req,res,next) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errorResponse(errors.array() as FieldValidationError[]),
      });
    }

    const { id } = req.params;

    const { title ,description,languages,role} = req.body;
    try {


      let imageData : any = req.files; 
        const images = getImagesFromReq(imageData,"images") 
        const signature = getImagesFromReq(imageData,"signature",true)    

        if(id){
          const oldModel = await ProjectModel.findById(id);
            if(oldModel){
              if(signature) deleteImage(oldModel.signature);
              if(images) deleteImages(oldModel.images);              
            }
            const oneModel = await ProjectModel.findByIdAndUpdate(id,
                {
                    title,
                    description,
                    languages,
                     images: images, // Save paths to banner images
                     signature: signature ,      
                     role
                })

            if(oneModel){
                return response200({res,message : "Project Updated Succeffully"})
            }
            return response404({ res });
        }

        const newModel = new ProjectModel({
            title ,
            description,
            languages,
            images : images,
            signature : signature,
            role
        });

        await newModel.save()

    } catch (error : any) {

        return response500({ res, data: error.toString() });
    }
    return response200({ res, message: "Project created successfully" });
}

export const getAllPojects: RequestHandler = async (req, res, next) => {
    
    try {
      
      let filterData: any = {};
  
      const projects = await paginationQueryBuilder({
        _model: ProjectModel,
        select:
        "title description languages role banner signature images",
        query: req.query,
        likeSearch: "title role",
       
        where: filterData,
      });
      return response200({
        res,
        data: projects,
        message: "Projects get successfully",
      });
    } catch (e: any) {
      return response500({ res, message: e.toString() });
    }
  };