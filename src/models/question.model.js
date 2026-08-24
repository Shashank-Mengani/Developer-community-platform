import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },

    body: {
        type: String,
        required: true
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    views: {
        type: Number,
        default: 0
    },

    voteCount: {
        type: Number,
        default: 0
    },

    answerCount: {
        type: Number,
        default: 0
    },

    tags: [
        {
        type: String,
        trim: true,
        lowercase: true,
        default: []
        }
    ],

    acceptAnswer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Answer"
    }
}, { timestamps: true });

const Question = mongoose.model("Question", questionSchema);

export default Question;