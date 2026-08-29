import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        targetId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },

        targetType: {
            type: String,
            enum: ["Question", "Answer"],
            required: true
        },

        type: {
            type: String,
            enum: ["up", "down"],
            required: true
        }
    },
    {
        timestamps: true
    }
);


// One user can have only one vote
// on one particular question/answer.
voteSchema.index(
    {
        user: 1,
        targetId: 1,
        targetType: 1
    },
    {
        unique: true
    }
);

const Vote = mongoose.model("Vote", voteSchema);

export default Vote;