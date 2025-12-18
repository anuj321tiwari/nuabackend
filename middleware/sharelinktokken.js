import cookies from "cookie-parser";

import jwt from 'jsonwebtoken';

export default function authMiddleware(req, res, next) {
    const token = req.cookies.Authtoken;

    // 1️⃣ No token → redirect to login
    if (!token) {
        const redirect = encodeURIComponent(req.originalUrl);
        return res.redirect(
            `http://localhost:5173/login?redirect=${redirect}`
        );
    }

    try {
        // 2️⃣ Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3️⃣ Token valid → attach user
        req.user = decoded;
        next();

    } catch (err) {
        // 4️⃣ Invalid / expired token
        res.clearCookie('Authtoken');

        const redirect = encodeURIComponent(req.originalUrl);
        return res.redirect(
            `http://localhost:5173/login?redirect=${redirect}`
        );
    }
}
