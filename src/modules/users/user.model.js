import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Please enter a valid email address"
        ]
    },

    password: {
        type: String,
        required: true,
        minlength: [6, "password must be atleast 6 character long"]
    },

    createdAt: {
        type: Date,
        default: Date.now()
    },

    role: {
        type: String,
       enum: ["user", "admin", "mentor"],
       default: "user"
    },

    isverified: {
        type: Boolean,
        default: false
    },

    avatar: {
        type: String,
        default: ""
    },

    bio: {
        type: String,
        maxlength: 600,
        default: ""
    },

    reputation: {
        type: Number,
        default: 0
    }

}, {
    timestamps: true
});

const User = mongoose.model("User", UserSchema);

export default User;