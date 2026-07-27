import User from "../users/user.model.js";
import bcrypt from 'bcrypt';

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
        
        res.status(201).json({
            message: "user signUp successfully",
            data: {
                id: createUser._id,
                name: createUser.name,
                email: createUser.email
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}