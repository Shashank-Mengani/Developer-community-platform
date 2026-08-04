import mongoose from "mongoose";

const voteSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
    },

    answer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Answer",
    },

    type: {
        type: String,
        enum: ["up", "down"],
        required: true
    }

}, { timestamps: true });

const Vote = mongoose.model("Vote", voteSchema);
export default Vote;