import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
    windowMs: 3 * 60 * 1000,
    limit: 3,
    message:{
        message: "Too many requests, Please try again later"
    }
});