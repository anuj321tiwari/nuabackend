import { Router } from "express";
import multer from "multer";
import fileDB from "../models/file_modal.js";
import VerifyToken from "../middleware/verifytoken.js";

const route = Router()

const File_uploadRoute = () => {
    const File_storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "uploads")
        },
        filename: (req, file,cb) => {
            cb(null, `${(Date.now())}${file.originalname}`)
        }
    })
    const uploads = multer({storage: File_storage}) 
    route.post('/fileupload', VerifyToken(), uploads.array("filess"), async(req, res) => {

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No files uploaded", status:false });
        }
        
        const uploadedfiles = req.files.map((file) => ({
            ownerID: req.user.id,
            filename: file.filename,
            type: file.mimetype,
            size: file.size,
            sharedWith: [],
            filepath: file.path,
            sharelink : ""
        })) 

        try {
            await fileDB.insertMany(uploadedfiles)  
            return res.status(200).json({message:"file are been uploaded successfully", status: true})     
        } catch (error) {
            console.log('Error occured in File_Upload route -- /fileupload -- ', error)
            return res.status(500).json({message:"Something went wrong while uploading ", status:false})
        }
    })

    return route
}

export default File_uploadRoute