import Notification from "../models/notification.model";
import Post from "../models/post.model"

export const sharePost = async(req, res) => {
    try {
        const userId = req.user;
        const { postId } = req.params;

        const post = await Post.findById(postId);
                
        if (!post) {
        return res.status(404).json({
            message: "Post not found",
        });
        }
        
        if(post.author.toString() === userId.toString()){
            return res.status(400).json({ message: "You cannot share your own post" });
        }

        const notification = await Notification.create({
            recipient: post.author,
            sender: userId,
            type: "Share",
            post: post.id
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