
import Answer from '../models/answer.model.js';
import Question from '../models/question.model.js';
import { AppError } from '../utils/AppError.js';

export const createAnswer = async (req, res, next) => {
    try {

        const userId = req.user.id;
        const { questionId } = req.params;
        const { body } = req.body;

        if (!body?.trim()) {
            throw new AppError(
                "Answer body is required",
                400
            );
        }

        const question = await Question.findById(questionId);

        if(!question){
           throw new AppError("Question not found", 404);
        }

        const answer = await Answer.create({
            author: userId,
            body: body.trim(),
            question: questionId,
        });

        await answer.populate("author", "name username");

        await Question.findByIdAndUpdate(questionId, {
            $inc: { 
                answerCount: 1 
            }
        });

        res.status(201).json({ 
            message: "Answer created successfully",
            data: answer
         });

    } catch (error) {
        next(error);
    }
}

export const getAnswer = async (req, res, next) => {
    try {

        const { questionId } = req.params;

        const answer = await Answer.find({
            question: questionId
        })
            .populate("author", "name username")
            .populate("question", "title")
            .sort({ createdAt: 1 });

        res.status(200).json({
            message: "Fetched answers succesfully",
            data: answer
        });

    } catch (error) {
        next(error);
    }
}

export const getAnswerById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const answer = await Answer.findById(id);

        res.status(200).json({
            message: "Fetched answer succesfully",
            data: answer
        });
        
    } catch (error) {
        next(error);
    }
}

export const updateAnswer = async (req, res, next) => {
    try {
        const { id } = req.params;

        const answer = await Answer.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            message: "Answer updated successfully",
            data: answer
        });

    } catch (error) {
        next(error);
    }
}

export const acceptAnswer = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { answerId } = req.params;

        const answer = await Answer.findById(answerId);

        if (!answer) {
            throw new AppError("Answer not found", 404);
        }

        const question = await Question.findById(answer.question);

        if (!question) {
            throw new AppError("Question not found", 404);
        }

        // Only question author can accept an answer
        if (question.author.toString() !== userId.toString()) {
            throw new AppError(
                "Only the question author can accept an answer",
                403
            );
        }

        // If another answer is already accepted
        if (
            question.acceptedAnswer &&
            question.acceptedAnswer.toString() !== answerId
        ) {
            throw new AppError(
                "Another answer is already accepted",
                400
            );
        }

        // If this answer is already accepted,
        // don't accept it again
        if (answer.isAccepted) {
            throw new AppError(
                "Answer is already accepted",
                400
            );
        }

        answer.isAccepted = true;

        question.acceptedAnswer = answer._id;

        await answer.save();
        await question.save();

        res.status(200).json({
            message: "Answer accepted successfully",
            data: {
                answerId: answer._id,
                isAccepted: answer.isAccepted,
                acceptedAnswer: question.acceptedAnswer
            }
        });

    } catch (error) {
        next(error);
    }
};