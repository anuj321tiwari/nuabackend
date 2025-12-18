import express from 'express'
import connectDB from './DB/db.js'
import cors from 'cors'
import AuthRoute from './routes/Auth_route.js'
import cookieParser from 'cookie-parser'
import File_uploadRoute from './routes/File_Upload.js'
import Show_File_Routes from './routes/Show_File_routes.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.use(cors({
    origin: 'http://localhost:5173',
    credentials:true
}))

app.use((req, res, next) => {
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; connect-src 'self' http://localhost:8000; frame-src 'self' http://localhost:8000;"
    );
    next();
});
connectDB()

app.use("/api", AuthRoute())
app.use("/api", File_uploadRoute())
app.use("/api", Show_File_Routes())

app.listen(8000, () => {
    console.log('Server Started')
})