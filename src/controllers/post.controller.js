import Post from "../models/post.model.js";
import User from '../models/user.model.js';
import { AppError } from "../utils/AppError.js";

export const createPost = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { content, imageUrl, visibility } = req.body;

        const user = await User.findById(userId);

        if(!user){
            throw new AppError("User not found", 404);
        }

        const post = await Post.create({
            author: userId,
            content,
            imageUrl,
            visibility
        });

        res.status(201).json({ 
            message: "Post created successfully",
            data: post
        });

    } catch (error) {
        next(error);
    }
}

export const getPostsByUser = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const posts = await Post.find({
            author: userId
        }).populate("author", "name username");

        if(posts.length === 0){
            throw new AppError("Posts not found", 404);
        }

        res.status(200).json({
            message: "User posts fetched successfully",
            data: posts
        });

    } catch (error) {
        next(error);
    }
}

export const getAllPosts = async (req, res, next) => {
    try {
        const posts = await Post.find()
                .populate("author", "name username")
                .sort({ createdAt: -1 });
               
        return res.status(200).json({
            message: "Posts fetched successfully",
            data: posts
        });

    } catch (error) {
        next(error);
    }
}

export const getPostById = async(req, res, next) => {
    try {
        const postId = req.params.id;
        
        console.log("postId: ", postId);

        const post = await Post.findById(postId);

        if(!post){
            throw new AppError("Post not found", 404);
        }

        res.status(200).json({
            message: "Fetched post successfully",
            data: post
        });

    } catch (error) {
        next(error);
    }
} 

export const updatePost = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const postId = req.params.id;

        const post = await Post.findById(postId);

        if(!post){
            throw new AppError("Post not found", 404);
        }

    
        if(post.author.toString() !== userId){
            throw new AppError("You are not authorized to perform this action", 403);
        }

        const postUpdate = await Post.findByIdAndUpdate(postId, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            message: "Post updated successfully",
            data: postUpdate
        });

    } catch (error) {
        next(error);
    }
}

export const reactToPost = async(req, res, next) => {
    try {
        const userId = req.user.id;
        const postId = req.params.id;
        const { type } = req.body;

        const post = await Post.findById(postId);

        if(!post){
            throw new AppError("Post not found", 404);
        }

        const existingReaction = post.reactions.find(reaction => reaction.user.toString() === userId.toString());

        if(existingReaction){
            existingReaction.type = type;
        } else{
            post.reactions.push({
                user: userId,
                type
            });
        }
        await post.save();

        await post.populate("author", "name username");

        console.log(`post was ${type} by someone`);

        return res.status(200).json({
            message: "Reaction added successfully",
            data: post
        });
        
    } catch (error) {
        next(error);
    }
}

export const deletePost = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const postId = req.params.id;

        // console.log("userId: ", userId);
        // console.log("postId: ", postId);

        const post = await Post.findById(postId);

        if(!post){
            throw new AppError("Post not found", 404);
        }

        if(post.author.toString() !== userId.toString()){
            throw new AppError("You are not authorized to delete this post", 403);
        }

        const deleteId = await Post.findByIdAndDelete(postId);

        res.status(200).json({
            message: "Post deleted successfully",
            data: deleteId
        });

    } catch (error) {
        next(error);
    }
}