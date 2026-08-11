import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 4,
    message:{
        message: "Too many requests, Please try again later"
    }
});