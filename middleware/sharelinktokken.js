import jwt from 'jsonwebtoken';
import dotenv from "dotenv"

dotenv.config()

const LinkAuthMiddleware = () => {
    return(req, res, next) => {
        const token = req.cookies.Authtoken
        if (!token) {
            return res.status(401).json({Share_Link_authenticated: false})
        }
    
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
    
        } catch (err) {
            return res.status(401).json({Share_Link_authenticated: false})
        }
    }
}

export default LinkAuthMiddleware
