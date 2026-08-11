
import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js"

export const sharePost = async(req, res) => {
    try {
        const userId = req.user.id;
        const { postId } = req.params;

        const post = await Post.findById(postId);
                
        if (!post) {
        return res.status(404).json({
            message: "Post not found",
        });
        }
        console.log("userId:", userId);
        console.log("post author:", post.author);
        
        if(post.author.toString() === userId.toString()){
            return res.status(400).json({ message: "You cannot share your own post" });
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
        console.log(error);
        res.status(500).json( { message: "Internal server error" });
    }
}

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log("user: ", userId);
        const notifications = await Notification.find({
            recipient: userId
        });
        console.log("notification: ", notifications);

        res.status(200).json({ 
            message: "Notifications fetched successfully",
            data: notifications
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const markAsRead = async (req, res) => {
    // your logic
    try {
        const userId = req.user.id;
        const { notificationId } = req.params;

        console.log("user: ", userId);
        console.log("notificationId:", notificationId);

        const notification = await Notification.findOneAndUpdate({
            _id: notificationId,
            recipient: userId
        },
        {
            isRead: true
        },
        {
            returnDocument: "after",
            runValidators: true
        }
    );

        if(!notification){
            return res.status(404).json({ message: "Notification not found" });
        }    

        res.status(200).json({
            message: "Notification marked as read",
            data: notification
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const markAllAsRead = async (req, res) => {
    // your logic
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
        data: result
    });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};