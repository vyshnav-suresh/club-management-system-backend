import multer, { Field } from "multer";
import path from "path"
import fs from 'fs';




export const saveMedia = (key : string) => {
    const storage = multer.diskStorage({
        destination: `./upload/${key}`,
        filename: (req, file, cb) => {
            cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
        }
    });
    const upload = multer({
        storage: storage,
        limits: {
            fileSize: 2 * 1024 * 1024 // 2 MB limit
        }
    }).single(key);

    return upload
};


export const saveMedias = (key : string, docs : Field[]) => {
    const storage = multer.diskStorage({
        destination: `./upload/${key}`,
        filename: (req, file, cb) => {
            cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
        }
    });
    const upload = multer({
        storage: storage,
        limits: {
            fileSize: 2 * 1024 * 1024 // 2 MB limit
        }
    }).fields(docs);
    

    return upload
};


export function getImagesFromReq(files: { [fieldname: string]: Express.Multer.File[] } ,key :string,single? : boolean):string | string[] {
    const images = (files as { [fieldname: string]: Express.Multer.File[] })[key];
    if(single) return images ? images[0].path : ""
    return images ? images.map((file: Express.Multer.File) => file?.path) : [];
}

export const getImageFromReq = (item : any)=>{         
    const img =  item?.path;
    return img
}


export function deleteImages(imagePaths: string[]) {
    imagePaths.forEach((imagePath) => {
        fs.unlinkSync(imagePath);
    });
} 
export function deleteImage(imagePath: string) {
    fs.unlinkSync(imagePath)
} 