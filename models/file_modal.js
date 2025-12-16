import mongoose from "mongoose";

const file_upload = new mongoose.Schema({
    ownerID : { type : mongoose.Schema.Types.ObjectId },
    filename : { type: String},
    type: { type: String },
    size: { type: Number },
    sharedWith: [{type: mongoose.Schema.Types.ObjectId, ref: "user"}],
    filepath: { type: String },
    sharelink : { type: String }
}, {timestamps: true})

const fileDB = mongoose.model("fileupload", file_upload)

export default fileDB
