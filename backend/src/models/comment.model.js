import mongoose from "mongoose";
import { required } from "zod/mini";

const commentSchema = new mongoose.Schema({

    body: {
        type: String,
        required: true,
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question"
    },

    answer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Answer"
    },

    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    }
    
}, { timestamps: true });

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;