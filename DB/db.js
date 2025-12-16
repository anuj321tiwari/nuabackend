import dontenv from 'dotenv'
import mongoose from 'mongoose'

dontenv.config()

const connectDB = async () => {
    try {
        const uri = process.env.DB_URL
        await mongoose.connect(uri)
        console.log('Database connected')
    } catch (error) {
        console.error('Error in Connecting Mongo ', error)
    }
}

export default connectDB