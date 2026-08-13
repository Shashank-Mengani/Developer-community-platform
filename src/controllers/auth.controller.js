import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import { generateAccessToken, generaterefreshToken } from "../utils/jwt.token.js";
import { AppError } from '../utils/AppError.js';

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

        const accessToken = generateAccessToken(createUser._id, res);
        const refreshToken = generaterefreshToken(createUser._id, res);
        
        res.status(201).json({
            message: "user signUp successfully",
            data: {
                id: createUser._id,
                name: createUser.name,
                email: createUser.email
            },
            accessToken,
            refreshToken
        });

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

        const user = await User.findOne({ email: email.toLowerCase()});

        if(!user){
            throw new AppError("User not found", 404);
        }

        const matchPassword = await bcrypt.compare(password, user.password);

        if(!matchPassword){
            throw new AppError("Invalid credentials", 400);
        }

        const accessToken = generateAccessToken(user._id, res);
        const refreshToken = generaterefreshToken(user._id, res);

        res.status(200).json({
            message: "user signIn",
            data: {
                id: user._id,
                email: user.email.toLowerCase(),
                name: user.name
            },
            accessToken,
            refreshToken
        });

    } catch (error) {
        next(error);
    }
}

export const signOut = (req, res, next) => {
    try {
        res.cookie("jwt", " ", {
            httpOnly: true,
            expires: new Date(0)
        });

        res.status(200).json({
            message: "user signed out successfully"
        });
    } catch (error) {
        next(error);
    }
}