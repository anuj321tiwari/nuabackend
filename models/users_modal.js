import mongoose from "mongoose";

const users = new mongoose.Schema({
    email: {
        type: String,
        require: [true, "Email is Required"],
        trim: true
    },
    password: {
        type: String,
        require: [true, "Password is required"],
        trim: true
    }
}, {timestamps: true})

const User = mongoose.model("user", users)
export default User