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
        refPath: "itemType",
        required: true
    },

}, { timestamps: true });

bookmarkSchema.index({ user: 1, itemType: 1, item: 1 }, { unique: true });
const Bookmark = mongoose.model("Bookmark", bookmarkSchema);

export default Bookmark;