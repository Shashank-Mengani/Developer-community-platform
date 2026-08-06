import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    content: {
        type: String,
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
                enum: ["like", "love", "haha", "wow", "sad", "angry"],
                default: "like"
            },
            reactedAt: {
                type: Date,
                default: Date.now()
            }
        }
    ]
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);

export default Post;