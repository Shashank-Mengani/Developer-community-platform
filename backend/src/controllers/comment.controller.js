
import Answer from "../models/answer.model.js";
import Comment from "../models/comment.model.js";
import Question from "../models/question.model.js";
import Post from "../models/post.model.js";
import { AppError } from "../utils/AppError.js";

export const questionComment = async (req, res, next) => {
    try {
        const questionId = req.params.id;
        const author = req.user.id;
        const { body } = req.body;
        
        const question = await Question.findById(questionId);

        if(!question){
            throw new AppError("Question not found", 404);
        }

        const comment = await Comment.create({
            question: questionId,
            author,
            body
        });

        res.status(201).json({
            message: "Comment added successfully",
            data: comment
        });

    } catch (error) {
        next(error);
    }
}

export const commentQuestion = async (req, res, next) => {
    try {
        const { id } = req.params;

        const comments = await Comment.find({
            question: id
        }).populate("author");

        res.status(200).json({ 
            message: "Question Comments fetched successfully",
            data: comments
        });

    } catch (error) {
        next(error);
    }
}

export const answerComment = async (req, res, next) => {
    try {
        const answerId = req.params.id;
        const author = req.user.id;
        const { body } = req.body;

        const answer = await Answer.findById(answerId);

        if(!answer){
            throw new AppError("Answer not found", 404);
        }

        const comment = await Comment.create({
            answer: answerId,
            author,
            body
        });

        res.status(201).json({ 
            message: "Added comment successfully",
            data: comment
        });

    } catch (error) {
        next(error);
    }
}

export const getComments = async (req, res, next) => {
    try {
        const { id } = req.params;

        const comments = await Comment.find({
            answer: id
        }).populate("author");

        res.status(200).json({
            message: "Answer Comments fetched successfully",
            data: comments
        });
    } catch (error) {
        next(error);
    }
}

export const updateComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const comment = await Comment.findById(id);

        if(!comment){
            throw new AppError("Comment not found", 404);
        }

        // Check comment owner
        if(comment.author.toString() !== userId.toString()){
            throw new AppError("You are not authorized to update this comment", 403);            
        }
        
        comment.body = req.body.body;

        await comment.save();

        res.status(200).json({
            message: "Updated comment successfully",
            data: comment
        });

    } catch (error) {
        next(error);
    }
}

export const deleteComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const comment = await Comment.findById(id);

        if(!comment){
            throw new AppError("Comment not found", 404);
        }

        // Check comment owner
        if(comment.author.toString() !== userId.toString()){
            throw new AppError("You are not authorized to delete this comment", 403);
        }

        const deletedComment = await Comment.findByIdAndDelete(id);

        res.status(200).json({
            message: "comment deleted successfully",
            data: deletedComment
        });

    } catch (error) {
        next(error);
    }
}

export const postComment = async (req, res, next) => {
    try {

        const postId = req.params.id;
        const userId = req.user.id;

        const { body } = req.body;

        console.log("user: ", userId);
        console.log("post: ", postId);

        const post = await Post.findById(postId);

        if(!post){
            throw new AppError("Post not found", 404);
        }

        const comment = await Comment.create({
            post: postId,
            author: userId,
            body
        });

        await comment.populate("author", "name username");

        res.status(201).json({
            message: "Comment added successfully",
            data: comment
        });

    } catch (error) {
        next(error);
    }
}

export const getPostCommentsById = async (req, res, next) => {
    try {
        const postId = req.params.id

        const comments = await Comment.find({
            post: postId
        }).populate("author", "name username");

        res.status(200).json({
            message: "Comments fetched successfully",
            data: comments
        });

    } catch (error) {
        next(error);
    }
}

export const deletePostComment = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { postId, commentId } = req.params;

        console.log("post: ", postId);
        console.log("comment: ", commentId);

        const post = await Post.findById(postId);

        if(!post){
            throw new AppError("post not found", 404);
        }

        const comment = await Comment.findById(commentId);

        if(!comment){
            throw new AppError("Comment not found", 404)
        }

        if(comment.post.toString() !== postId.toString()){
            throw new AppError("Comment does not belong to this post", 400);
        }

        if(comment.author.toString() !== userId.toString()){
            throw new AppError("You can't delete comments", 401);
        }

        const deleteComment = await Comment.findByIdAndDelete(commentId);

        console.log("deleteC: ", deleteComment);
        res.status(200).json({
            message: "Comments deleted successfully"
        });

    } catch (error) {
        next(error);
    }
}