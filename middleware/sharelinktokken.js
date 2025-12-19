import jwt from 'jsonwebtoken';
import dotenv from "dotenv"

dotenv.config()

const LinkAuthMiddleware = () => {
    return(req, res, next) => {
        const token = req.cookies.Authtoken
        if (!token) {
            const redirect = encodeURIComponent(req.originalUrl);
            return res.redirect(
                `https://nuafrontend.vercel.app/login?redirect=${redirect}`
            );
        }
    
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
    
        } catch (err) {
            const redirect = encodeURIComponent(req.originalUrl);
            return res.redirect(
                `https://nuafrontend.vercel.app/login?redirect=${redirect}`
            );
        }
    }
}

export default LinkAuthMiddleware
