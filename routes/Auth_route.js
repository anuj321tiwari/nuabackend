import { Router } from "express";
import User from "../models/users_modal.js";
import bcrypt from "bcrypt"

import jwt from "jsonwebtoken"

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
                secure:false,
            })

            return res.status(200).json({message:"Login Successful", status:true})
        } catch (error) {
            console.log("Error Occured in Auth Route -- /login -- ", error)
            return res.status(500).json({message: "Something went wrong while Login", status: false})
        }
    })
    return route
}

export default AuthRoute
