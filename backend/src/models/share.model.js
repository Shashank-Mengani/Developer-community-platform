
import mongoose from "mongoose";

const shareSchema = new mongoose.Schema({

    sharedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    sharedWith: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    }

}, { timestamps: true });

shareSchema.index({
    sharedBy: 1, sharedWith: 1, post: 1 },
        { unique: true }
);

const Share = mongoose.model("Share", shareSchema);

export default Share;