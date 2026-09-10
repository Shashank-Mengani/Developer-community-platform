import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
    windowMs: 3 * 60 * 1000,
    limit: 3,
    message:{
        message: "Too many requests, Please try again later"
    }
});

export const profileUpdateLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 1,

    keyGenerator: (req) => req.user.id,
    
    message: {
        message: "You can update your profile again after 10 minutes."
    },
    standardHeaders: "draft-7",
    legacyHeaders: false
});