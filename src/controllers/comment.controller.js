
import Answer from "../models/answer.model.js";
import Comment from "../models/comment.model.js";
import Question from "../models/question.model.js";

export const questionComment = async (req, res) => {
    try {
        const questionId = req.params.id;
        const author = req.user.id;
        const { body } = req.body;
        
        const question = await Question.findById(questionId);

        if(!question){
            return res.status(404).json({ message: "Question not found" });
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
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const commentQuestion = async (req, res) => {
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
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const answerComment = async (req, res) => {
    try {
        const answerId = req.params.id;
        const author = req.user.id;
        const { body } = req.body;

        const answer = await Answer.findById(answerId);

        if(!answer){
            return res.status(404).json({ message: "Answer not found" });
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
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getComments = async (req, res) => {
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
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const comment = await Comment.findById(id);

        if(!comment){
            return res.status(404).json({
                message: "Comment not found"
            });
        }

        // Check comment owner
        if(comment.author.toString() !== userId){
            return res.status(403).json({
                message: "You cannot update this comment"
            });            
        }
        
        comment.body = req.body.body;

        await comment.save();

        res.status(200).json({
            message: "Updated comment successfully",
            data: comment
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const comment = await Comment.findById(id);

        if(!comment){
            return res.status(404).json({ message: "Comment not found" });
        }

        // Check comment owner
        if(comment.author.toString() !== userId){
            res.status(403).json({ message: "You cannot delete this comment" });
        }

        const deletedComment = await Comment.findByIdAndDelete(id);

        res.status(200).json({
            message: "comment deleted successfully",
            data: deletedComment
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}