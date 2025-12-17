import { Router } from "express";
import fileDB from "../models/file_modal.js";
import VerifyToken from "../middleware/verifytoken.js";
import User from "../models/users_modal.js";

const route = Router()

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
    return route
}

export default Show_File_Routes