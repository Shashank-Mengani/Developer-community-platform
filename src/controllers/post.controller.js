import Post from "../models/post.model.js";
import User from '../models/user.model.js';

export const createPost = async (req, res) => {
    try {
        const userId = req.user.id;
        const { content, imageUrl } = req.body;

        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({ message: "user not found" });
        }

        const post = await Post.create({
            author: userId,
            content,
            imageUrl
        });

        res.status(201).json({ 
            message: "Post created successfully",
            data: post
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getPosts = async (req, res) => {
    
}

export const updatePost = async (req, res) => {
    try {
        const userId = req.user.id;
        const postId = req.params.id;
        const { type } = req.body;

        const post = await Post.findById(postId);

        if(!post){
            return res.status(404).json({ message: "Post not found" });
        }

        post.reactions.push({
            user: userId,
            type
        });

        await post.save();

        // if(post.author.toString() !== userId){
        //     return res.status(403).json({ message: "Not Authorized" });
        // }

        const postUpdate = await Post.findByIdAndUpdate(postId, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            message: "Post updated successfully",
            data: post
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}