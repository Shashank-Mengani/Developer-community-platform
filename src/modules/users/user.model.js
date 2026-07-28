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

    role: {
        type: String,
       enum: ["user", "admin", "mentor"],
       default: "user"
    },

    isverified: {
        type: Boolean,
        default: true
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

UserSchema.virtual('followerCount').get(function() {
    return this.followers.length;
});

UserSchema.virtual('followingCount').get(function() {
    return this.following.length;
});

//Pre-save hook
UserSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
});

//Instance method: compare password
UserSchema.methods.comparePassword = async function(candidate){
    return bcrypt.compare(candidate, this.password)
}


const User = mongoose.model("User", UserSchema);

export default User;