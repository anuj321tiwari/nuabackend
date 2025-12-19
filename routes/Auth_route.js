import { Router } from "express";
import User from "../models/users_modal.js";
import bcrypt from "bcrypt"

import jwt from "jsonwebtoken"
import VerifyToken from "../middleware/verifytoken.js";

const route = Router()

const AuthRoute = () => {
    //For Register
    route.post('/register', async(req, res) => {
        const {email, password} = req.body

        try {
            if(!email && !password) return res.status(405).json({message: 'Email and password is required', status:false});

            const emailcheker = await User.findOne({email})
            if(emailcheker) return res.status(404).json({message: 'Email All ready Exists, You can login', status: false});

            const hashpass = await bcrypt.hash(password, 10)

            const payload = await User({
                email : email,
                password : hashpass
            })
            await payload.save()

            return res.status(200).json({message: "User Registered Successfully", status: true})
        } catch (error) {
            console.log("Error Occured in Auth Route -- /register -- ", error)
            return res.status(500).json({message: "Something Went Wrong While Registering", status:false})
        }
    })

    //For Login
    route.post('/login', async (req, res) => {
        const {email, password} = req.body

        try {
            if(!email && !password) return res.status(405).json({message: 'Email and password is required', status:false});

            const user = await User.findOne({email})
            if(!user) return res.status(400).json({message:"Email not exist", status:false});

            const check_Password_Match = await bcrypt.compare(password, user.password)
            if(!check_Password_Match) return res.status(400).json({message:"Password is Incorect", status:false});

            const Token = jwt.sign({
                id : user._id,
                email: user.email
            }, process.env.JWT_Sign)

            res.cookie('Authtoken', Token, {
                httpOnly:true,
                sameSite:'lax',
                secure:true, //development false
                sameSite: "none" //remove in development
            })

            return res.status(200).json({message:"Login Successful", status:true})
        } catch (error) {
            console.log("Error Occured in Auth Route -- /login -- ", error)
            return res.status(500).json({message: "Something went wrong while Login", status: false})
        }
    })

    route.get("/check-auth", VerifyToken(), async(req, res) => {
        const id = req.user.id
        const email = req.user.email
        try {
            if(id && email){
                return res.status(200).json({ authenticated: true })
            }else{
                return res.status(404).json({ authenticated : false})
            }   
        } catch (error) {
            console.log("Error Occured in Auth Route -- /check-auth -- ", error)
        }
    })

    route.post('/logout', (req,res) => {
        try {
            res.clearCookie('Authtoken', {
                httpOnly: true,
                secure: true,
                sameSite: "none"
            })
            return res.status(200).json({message: "user logout successfully"}) 
        } catch (error) {
            console.log("Error Occured in Auth Route -- /logout -- ", error)
            return res.status(500).json({message:"Something Went Wrong While Logout"})
        }
    })
    return route
}

export default AuthRoute
