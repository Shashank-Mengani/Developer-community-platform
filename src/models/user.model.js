import mongoose from "mongoose";
import bcrypt from 'bcrypt';

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
        minlength: [6, "password must be atleast 6 character long"]
    },

    googleId: {
        type: String,
        trim: true,
        sparse: true,
        unique: true
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

    role: {
        type: String,
       enum: ["user", "admin", "mentor"],
       default: "user"
    },

    isverified: {
        type: Boolean,
        default: false
    },

    isActive: {
        type: Boolean,
        default: true
    },

    reputation: {
        type: Number,
        default: 0
    },

    //Social graph fields
    followers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    //Auth token fields
    refreshToken: {
        type: String,
        select: false
    },

    //Email verification fields
    emailVerificationOTP: {
        type: String,
        select: false
    },
    emailVerificationOTPExpiry: {
        type: Date,
        select: false
    },

    //Password reset fields
    passwordResetToken: {
        type: String,
        select: false
    },
    passwordResetExpiry: {
        type: Date,
        select: false
    },
    passwordChangedAt: {
        type: Date,
        select: false
    }

}, {
    timestamps: true
});

//virtual fields
UserSchema.virtual('followerCount').get(function() {
    return this.followers.length;
});

UserSchema.virtual('followingCount').get(function() {
    return this.following.length;
});

//Pre-save hook
// UserSchema.pre('save', async function () {
//     if(!this.isModified('password') || !this.password) return;
//     this.password = await bcrypt.hash(this.password, 12);
// });

//Instance method: compare password
UserSchema.methods.comparePassword = async function(candidate){
    if(!this.password){
        return false;
    }
    return bcrypt.compare(candidate, this.password)
}

const User = mongoose.model("User", UserSchema);

export default User;