import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema({
    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    itemType: {
        type: String,
        enum: ["question", "answer"],
        required: true
    },

    item: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }

}, { timestamps: true });

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);

export default Bookmark;