
import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js"
import { AppError } from "../utils/AppError.js";

export const sharePost = async(req, res, next) => {
    try {
        const userId = req.user.id;
        const { postId } = req.params;

        const post = await Post.findById(postId);
                
        if (!post) {
            throw new AppError("Post not found", 404);
        }

        // console.log("userId:", userId);
        // console.log("post author:", post.author);
        
        if(post.author.toString() === userId.toString()){
            throw new AppError("You cannot share your own post", 400);
        }

        const notification = await Notification.create({
            recipient: post.author,
            sender: userId,
            type: "SHARE",
            message: "Someone shared your post",
            post: post._id
        });

        res.status(201).json({
            message: "Post Shared successfully",
            data: notification
        });

    } catch (error) {
        next(error);
    }
}

export const getNotifications = async (req, res, next) => {
    try {
        const userId = req.user.id;
        // console.log("user: ", userId);

        const notifications = await Notification.find({
            recipient: userId
        })
            .populate("sender", "name username")
            .populate("post", "content imageUrl")
            .sort({ createdAt: -1 });

        // console.log("notification: ", notifications);

        res.status(200).json({ 
            message: "Notifications fetched successfully",
            data: notifications
        });

    } catch (error) {
        next(error);
    }
}

export const markAsRead = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { notificationId } = req.params;

        // console.log("user: ", userId);
        // console.log("notificationId:", notificationId);

        const notification = await Notification.findOne({
            _id: notificationId
        });

        if(!notification){
            throw new AppError("Notification not found", 404);
        }

        if(notification.recipient.toString() !== userId.toString()){
            throw new AppError("You are not authorized to update this notification", 403);
        }

        notification.isRead = true;

        await notification.save();

        res.status(200).json({
            message: "Notification marked as read",
            data: notification
        });

    } catch (error) {
        next(error);
    }
};

export const markAllAsRead = async (req, res, next) => {
    try {
    const userId = req.user.id;

    const result = await Notification.updateMany(
        {
            recipient: userId,
            isRead: false
        },
        {
            $set: {
                isRead: true
            }
        }
    );

    res.status(200).json({
        message: "All notifications are marked as read",
        data: {
            modifiedCount: result.modifiedCount
        }
    });

    } catch (error) {
        next(error);
    }
};