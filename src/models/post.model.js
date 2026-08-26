import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },

    imageUrl: {
        type: String,
        default: ""
    },

    visibility:{
        type: String,
        enum: ["public", "private"],
        default: "public"
    },

    reactions:[
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            type: {
                type: String,
                enum: ["like", "love"],
                default: "like"
            },
            reactedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],

    shareCount: {
        type: Number,
        default: 0
    }

}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);

export default Post;