import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError.js';

export const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        const token =
            authHeader?.startsWith("Bearer ")
                ? authHeader.split(" ")[1]
                : req.cookies.accessToken;

        if (!token) {
            return next(new AppError("No token provided", 401));
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();
    } catch (error) {
        next(new AppError("Invalid or expired token", 401));
    }
};