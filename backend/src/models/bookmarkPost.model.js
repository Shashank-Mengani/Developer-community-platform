import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post",
        required: true
    }
}, { timestamps: true });

bookSchema.index({ user: 1, post: 1 }, { unique: true });

const BookmarkPost = mongoose.model("BookmarkPost", bookSchema);

export default BookmarkPost;