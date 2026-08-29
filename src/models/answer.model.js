import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true,
        trim: true
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true
    },

    voteCount: {
        type: Number,
        default: 0
    },

    isAccepted: {
        type: Boolean,
        default: false
    }
    
}, { timestamps: true });

const Answer = mongoose.model("Answer", answerSchema);

export default Answer;