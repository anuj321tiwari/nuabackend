import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

const VerifyToken = () => {
    return(req, res, next) => {
        const Token = req.cookies.authtoken

        try {
            const decodeToken = jwt.verify(Token, process.env.JWT_Sign );
            req.user = decodeToken
            next()
        } catch {
            return res.status(401).json({ message: "Invalid token", status:false});
        }
    }
}

export default VerifyToken