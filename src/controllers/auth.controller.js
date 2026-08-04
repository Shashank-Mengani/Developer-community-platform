import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import { generateToken } from "../utils/jwt.token.js";


export const signUp = async(req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({
                message: "Invalid email format"
            });
        }

        if(password.length <= 5){
            return res.status(400).json({
                message: "password must me at least 5 characters"
            });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });

        if(existingUser){
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const salt = await bcrypt.genSalt(12);
        const hashPassword = await bcrypt.hash(password, salt);

        const createUser = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashPassword
        });

        const token = generateToken(createUser._id, res);
        
        res.status(201).json({
            message: "user signUp successfully",
            data: {
                id: createUser._id,
                name: createUser.name,
                email: createUser.email
            },
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const signIn = async(req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email: email.toLowerCase()});

        if(!user){
            return res.status(404).json({ message: "user not found" });
        }

        const matchPassword = await bcrypt.compare(password, user.password);

        if(!matchPassword){
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user._id, res);

        res.status(200).json({
            message: "user signIn",
            data: {
                id: user._id,
                email: user.email.toLowerCase(),
                name: user.name
            },
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const signOut = (req, res) => {
    try {
        res.cookie("jwt", " ", {
            httpOnly: true,
            expires: new Date(0)
        });

        res.status(200).json({
            message: "user signed out successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}