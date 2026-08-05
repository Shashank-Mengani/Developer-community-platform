import mongoose from "mongoose";
import Question from "./question.model.js";

const answerSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true,
        trim: true
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question"
    },

    voteCount: {
        type: Number,
        default: 0
    },

    tags: [
        {
        type: String,
        trim: true,
        lowercase: true
        }
    ],

    isAccepted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Answer = mongoose.model("Answer", answerSchema);

export default Answer;