import User from "../models/user.model.js";
import { generateAccessToken, generaterefreshToken } from "../utils/jwt.token.js";
import { AppError } from "../utils/AppError.js";

export const googleLogin = async (req, res, next) => {
    try {
        const { googleId, name, email } = req.user;

        // Check user by Google ID
        let user = await User.findOne({ googleId });

        // If Google account is not linked
        if (!user) {

            // Check existing email account
            user = await User.findOne({
                email: email.toLowerCase()
            });

            if (user) {
                // Link Google account with existing user
                user.googleId = googleId;
                user.isverified = true;

                await user.save();

            } else {

                // Create new Google user
                user = await User.create({
                    name,
                    email: email.toLowerCase(),
                    googleId,
                    isverified: true
                });
            }
        }

        const accessToken = generateAccessToken(user._id, res);
        const refreshToken = generaterefreshToken(user._id, res);

        return res.status(200).json({
            message: "Google login successful",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                googleId: user.googleId
            },
            accessToken,
            refreshToken
        });


    } catch (error) {
        next(error);
    }
};