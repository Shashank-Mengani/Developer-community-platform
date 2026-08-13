
import Answer from "../models/answer.model.js";
import Question from "../models/question.model.js";
import Vote from "../models/vote.model.js";
import { AppError } from "../utils/AppError.js";

export const questionVote = async (req, res, next) => {
    try {
        const questionId = req.params.id;
        const userId = req.user.id;
        const { type } = req.body;

        if(!["up", "down".includes(type)]){
            throw new AppError("Invalid vote type", 400);
        }

        const question = await Question.findById(questionId);

        if(!question){
            throw new AppError("Question not found", 404);
        }

        const existingVote = await Vote.findOne({
            user: userId,
            question: questionId
        });

        if(existingVote){
            throw new AppError("You have already voted on this question", 400);
        }

        const vote = await Vote.create({
            user: userId,
            question: questionId,
            type
        });

        if(type === "up"){
            question.voteCount += 1;
        } else{
            question.voteCount -= 1;
        }

        await question.save();

        res.status(201).json({
            message: "Vote added successfully",
            voteCount: question.voteCount
        });

    } catch (error) {
        next(error);
    }
}

export const answerVote = async (req, res, next) => {
    try {
        const answerId = req.params.id;
        const userId = req.user.id;
        const { type } = req.body;

        if(!["up", "down"].includes(type)){
            throw new AppError("Invalid vote Type", 400);
        }

        const answer = await Answer.findById(answerId);
        if(!answer){
            throw new AppError("Answer not found", 404);
        }

        const existingVote = await Vote.findOne({
            answer: answerId,
            user: userId
        });
        if(existingVote){
            throw new AppError("You have already voted on this Answer", 400);
        }

        const vote = await Vote.create({
            answer: answerId,
            user: userId,
            type
        });
        if(type === "up"){
            answer.voteCount += 1;
        } else{
            answer.voteCount -= 1;
        }

        await answer.save();

        res.status(201).json({ 
            message: "vote added successfully",
            answer: answer.voteCount
        });

    } catch (error) {
        next(error);
    }
}

export const questionVotesById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const votes = await Vote.find({
            question: id
        }).populate("user", "username");

        res.status(200).json({ 
            message: "vote fetched successfully",
            data: votes
        });

    } catch (error) {
        next(error);
    }
}

export const answerVotesById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const votes = await Vote.find({
            answer: id
        }).populate("user", "username");

        res.status(200).json({
            message: "votes fetched successfully",
            data: votes
        });

    } catch (error) {
        next(error);
    }
}