import jwt from 'jsonwebtoken';

export const generateAccessToken = (userId, res) => {
    const payload = { id: userId };
    const accesstoken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "15m"
    });

    res.cookie("accessToken", accesstoken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 30
    });
    return accesstoken;
}

export const generaterefreshToken = (userId, res) => {
    const payload = { id: userId};
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d"
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 7
    });

    return refreshToken;
}