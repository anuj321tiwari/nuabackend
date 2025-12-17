import { Router } from "express";
import multer from "multer";
import fileDB from "../models/file_modal.js";
import VerifyToken from "../middleware/verifytoken.js";
import crypto from "crypto"
import fs, { stat } from "fs"

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
            originalFileName : file.originalname,
            type: file.mimetype,
            size: file.size,
            sharedWith: [],
            filepath: file.path,
            sharelink : crypto.randomBytes(32).toString("hex")
        })) 

        try {
            await fileDB.insertMany(uploadedfiles)  
            return res.status(200).json({message:"file are been uploaded successfully", status: true})     
        } catch (error) {
            console.log('Error occured in File_Upload route -- /fileupload -- ', error)
            return res.status(500).json({message:"Something went wrong while uploading ", status:false})
        }
    })

    route.delete('/file-delete/:id', VerifyToken(), async(req, res) => {
        try {
            const checkfile = await fileDB.findById(req.params.id)
            if(!checkfile) return res.status(400).json({message: "File Does not exists", status:false});
            fs.unlink(`./uploads/${checkfile.filename}`, (err) => {
                if(err) {    
                    console.log("Error in Deliting File From Local Route uploads ", err)
                    res.status(400).json({message: "Something Went Wrong While Deleting Files", status:false})
                    return
                }
            })
            await fileDB.findByIdAndDelete(req.params.id)
            return res.status(200).json({message: "File Is been Deleted", status:true})
        } catch (error) {
            console.log("Error in File_Upload route -- /file-delete/:id -- ", error)
            return res.status(500).json({message: "Something Went Wrong While Deleting Files", status:false})
        }
    })

    route.post('/assign-user', VerifyToken(), async(req, res) => {
        const { fileid, user_id } = req.body
        try {
            if(!user_id || !Array.isArray(user_id) || user_id.length === 0) {
                return res.status(400).json({message:"Please select at least one email to share with", status:false})
            }

            await fileDB.findByIdAndUpdate(fileid, {
                $addToSet : {sharedWith: {$each: user_id}}
            })
            return res.status(200).json({message: "File Shared"})
        } catch (error) {
            console.log("Error in File_Upload route -- /assign-user -- ", error)
            return res.status(500).json({ message: "Internal server error" });
        }
    })

    route.get('/shared-files', VerifyToken(), async (req, res) => {
        try {
            const response = await fileDB.find({
                $or: [
                    { ownerID : req.user.id },
                    {sharedWith: req.user.id}
                ]
            })
            return res.status(200).json(response)
        } catch (error) {
            console.log("Error in File_Upload route -- /shared-files -- ", error)
            return res.status(500).json({message: "Something Went Wrong While Getting Shared Files", status:false})
        }
    })

    return route
}

export default File_uploadRoute