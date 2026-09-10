import Post from "../models/post.model.js";
import Share from "../models/share.model.js";
import { AppError } from "../utils/AppError.js";

export const sharePost = async (req, res, next) => {
    try {
        const currUser = req.user.id;
        const { postId, targetUser } = req.params;

        if(currUser === targetUser){
            throw new AppError("You can't share post with yourself", 400);
        }

        const post = await Post.findById(postId);

        if(!post){
            throw new AppError("Post not found", 404);
        }

        const existingShare = await Share.findOne({
            sharedBy: currUser,
            sharedWith: targetUser,
            post: postId
        });

        if(existingShare){
            throw new AppError("You were already shared Post", 400);
        }

        const share = await Share.create({
            sharedBy: currUser,
            sharedWith: targetUser,
            post: postId
        });

        await Post.findByIdAndUpdate(
            postId,
            { $inc: { shareCount: 1 } }
        )

        res.status(201).json({
            message: "Post shared successfully",
            data: share
        });

    } catch (error) {
        next(error);
    }
}

export const getReceivedShares = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const shares = await Share.find({
            sharedWith: userId
        }).populate("sharedBy", "username profilePicture")
        .populate("post")
        .sort({createdAt: -1});

        res.status(200).json({
            message: "Shared posts fetched successfully",
            data: shares
        });

    } catch (error) {
        next(error);
    }
}