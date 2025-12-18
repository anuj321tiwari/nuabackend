import { Router } from "express";
import fileDB from "../models/file_modal.js";
import VerifyToken from "../middleware/verifytoken.js";
import User from "../models/users_modal.js";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import LinkAuthMiddleware from "../middleware/sharelinktokken.js";

const route = Router()

const __filename = fileURLToPath(import.meta.url)
console.log(__filename, "this is file name")

const __dirname = dirname(__filename)
const projectRoute = join(__dirname, '..')
const Show_File_Routes = () => {
    route.get("/get-allfiles", VerifyToken(), async(req,res) => {
        const id = req.user.id
        try {
            const response = await fileDB.find({ownerID : id})
            return res.status(200).json(response)
        } catch (error) {
            console.log("Error in Show_File_route -- /get-allfiles -- ", error)
            return res.status(500).json({message:"Something Went Wrong While Bringing Files", status:false})
        }
    })

    route.post('/search', async(req, res) => {
        const {email} = req.query
        try {
            const response = await User.find({email: email}).select('_id email')
            return res.status(200).json(response)     
        } catch (error) {
            console.log("Error in Show_File_route -- /search -- ", error)
            return res.status(500).json({message:"Something Went Wrong While Bringing Emails", status:false})
        }
    })

    route.get('/files/:id', VerifyToken(), async(req, res) => {
        const fileId = req.params.id
        try {
            const file = await fileDB.findById(fileId)

            if(!file) return res.status(400).json({message: "File not found", status: false});

            const userId = req.user.id
            // if(file.ownerID !== userId && !file.sharedWith.includes(userId)){
            //     return res.status(403).json({message: "Access denied", status:false})
            // }
            const filepath = join(projectRoute, file.filepath)
            return res.sendFile(filepath)
        } catch (error) {
            console.log("Error in Show_File_route -- /files/:id -- ", error)
            return res.status(500).json({message :"server error", status:false})
        }
    })

    route.get('/:sharelink', LinkAuthMiddleware(), async(req, res) => {
        console.log("hit ")
        console.log(req.params.sharelink)
        console.log(req.user.id)
        const linkedfile = await fileDB.findOne({ sharelink: req.params.sharelink })
        if(!linkedfile) return res.status(400).json({message: "File not found", status: false})

        const filepath = join(projectRoute, linkedfile.filepath)
        return res.sendFile(filepath)
    })
    return route
}

export default Show_File_Routes