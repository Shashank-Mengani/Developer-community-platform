import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({

    body: {
        type: String,
        required: true
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question"
    },

    answer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Answer"
    }
    
}, { timestamps: true });

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;