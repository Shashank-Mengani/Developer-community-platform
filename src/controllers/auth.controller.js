import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateAccessToken, generaterefreshToken } from "../utils/jwt.token.js";
import { AppError } from '../utils/AppError.js';
import { sendWelcomeEmail } from '../emails/emailHandler.js';

export const signUp = async(req, res, next) => {
    try {
        const { name, email, password } = req.body;
        
        const existingUser = await User.findOne({ email: email.toLowerCase() });

        if(existingUser){
            throw new AppError("User already exist", 400);
        }

        const salt = await bcrypt.genSalt(12);
        const hashPassword = await bcrypt.hash(password, salt);

        const createUser = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashPassword
        });

        console.log("You’ve signed up using your: ", { name, email });

        const accessToken = generateAccessToken(createUser._id, res);
        generaterefreshToken(createUser._id, res);
        
        res.status(201).json({
            message: "user signUp successfully",
            data: {
                id: createUser._id,
                name: createUser.name,
                email: createUser.email
            },
            accessToken
        });

        // try {
        //     await sendWelcomeEmail(createUser.email, createUser.name, process.env.CLIENT_URL);
        // } catch (error) {
        //     console.log(error.message);
        // }

    } catch (error) {
        next(error);
    }
}

export const signIn = async(req, res, next) => {
    try {
        const { email, password } = req.body;

        if(!email || !password){
            throw new AppError("All fields are required", 400);
        }

        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({ email: normalizedEmail });

        if(!user){
            throw new AppError("User not found", 404);
        }

        const matchPassword = await bcrypt.compare(password, user.password);

        if(!matchPassword){
            throw new AppError("Invalid credentials", 400);
        }

        console.log("You’ve successfully logged in using your Gmail account: ", email);

        const accessToken = generateAccessToken(user._id, res);
        generaterefreshToken(user._id, res);

        res.status(200).json({
            message: "user signIn in successfully",
            data: {
                id: user._id,
                email: user.email,
                name: user.name
            },
            accessToken
        });

    } catch (error) {
        next(error);
    }
}

export const signOut = (req, res, next) => {
    try {
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        };

        res.clearCookie("accessToken", cookieOptions);
        res.clearCookie("refreshToken", cookieOptions);

        console.log("User was signed out");

        res.status(200).json({
            message: "user signed out successfully"
        });

    } catch (error) {
        next(error);
    }
}

export const refreshAccessToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        
        if(!refreshToken){
            throw new AppError("Refresh token not provided", 401);
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        const user = await User.findById(decoded.id);

        if (!user) {
            throw new AppError("User not found", 404);
        }
        
        const accessToken = generateAccessToken(user._id, res);
        
        res.status(200).json({
            message: "Access token refreshed",
            data: accessToken
        });

    } catch (error) {
        next(error);
    }
}

export const getCurrentUser = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).select("-password");

        if(!user){
            throw new AppError("User was not found", 404);
        }

        res.status(200).json({
            message: "Current user fetched successfully",
            data: user
        });

    } catch (error) {
        next(error);
    }
}