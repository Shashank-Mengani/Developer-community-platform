
import Question from '../models/question.model.js';
import { AppError } from '../utils/AppError.js';
import { generateTags } from '../ai-services/questionTags.service.js';

export const createQuestions = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { title, body } = req.body;

        const existingQuestion = await Question.findOne({
            title: title.trim()
        });

        if(existingQuestion){
            throw new AppError("Bad Request", 401);
        }

        const aiResult = await generateTags(
            `${title}\n${body}`
        );

        console.log("AI TAG RESULT:", aiResult);

        let tags = [];
        if(Array.isArray(aiResult?.tags)){
            tags = aiResult.tags;
        }

        const question = await Question.create({
            author: userId,
            title: title.trim(),
            body: body.trim(),
            tags
        });

        res.status(201).json({
            message: "question added successfully",
            data: question
        });

    } catch (error) {
        next(error);
    }
}

export const getQuestion = async (req, res, next) => {
    try {

        const questions = await Question.find()
            .populate("author", "name username")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Questions fetched successfully",
            data: questions
        });

    } catch (error) {
        next(error);
    }
};


export const getQuestionById = async (req, res, next) => {
    try {
        const { questionId } = req.params;

        const question = await Question.findByIdAndUpdate(
            questionId,
            {
                $inc: {
                    views: 1
                }
            },
            {
                new: true
            }
        )
        .populate("author", "name username");

        if (!question) {
            throw new AppError(
                "Question not found",
                404
            );
        }

        res.status(200).json({
            message: "Question retrieved successfully",
            data: question
        });

    } catch (error) {
        next(error);
    }
};


export const deleteQuestion = async (req, res, next) => {
    try {
        const { questionId } = req.params;
        const userId = req.user.id;

        const question = await Question.findById(questionId);

        if(!question){
            throw new AppError("Question not found", 404);
        }

        if(question.author.toString() !== userId.toString()){
            throw new AppError("You are not authorized to delete this question", 403);
        }

        await Question.findByIdAndDelete(questionId);

        res.status(200).json({ 
            message: "Question deleted successfully" 
        });

    } catch (error) {
        next(error);
    }
}


export const getQuestionBySearch = async (req, res, next) => {
    try {

        const { search } = req.query;

        if (!search?.trim()) {
            throw new AppError(
                "Search query is required",
                400
            );
        }

        const questions = await Question.find({
            $or: [
                {
                    title: {
                        $regex: search.trim(),
                        $options: "i"
                    }
                },
                {
                    body: {
                        $regex: search.trim(),
                        $options: "i"
                    }
                },
                {
                    tags: {
                        $regex: search.trim(),
                        $options: "i"
                    }
                }
            ]
        })
        .populate("author", "name username")
        .sort({
            createdAt: -1
        });

        res.status(200).json({
            message: "Questions found",
            data: questions
        });

    } catch (error) {
        next(error);
    }
};


export const getQuestionByVotes = async (req, res, next) => {
    try {

        const questions = await Question.find()
            .populate("author", "name username")
            .sort({
                voteCount: -1
            });

        res.status(200).json({
            message: "Questions sorted by votes",
            data: questions
        });

    } catch (error) {
        next(error);
    }
};


export const getQuestionByAnswers = async (req, res, next) => {
    try {

        const questions = await Question.find()
            .populate("author", "name username")
            .sort({
                answerCount: -1
            });

        res.status(200).json({
            message: "Questions sorted by answers",
            data: questions
        });

    } catch (error) {
        next(error);
    }
};


export const getQuestionsByTag = async (req, res, next) => {
    try {

        const { tag } = req.params;

        if (!tag?.trim()) {
            throw new AppError("Tag is required", 400);
        }

        const questions = await Question.find({
            tags: tag.trim().toLowerCase()
        })
        .populate("author", "name username")
        .sort({
            createdAt: -1
        });

        res.status(200).json({
            message: "Questions fetched by tag successfully",
            data: questions
        });

    } catch (error) {
        next(error);
    }
};


export const getAllQuestionTags = async (req, res, next) => {
    try {

        const tags = await Question.distinct("tags");

        res.status(200).json({
            message: "Question tags fetched successfully",
            data: tags.sort()
        });

    } catch (error) {
        next(error);
    }
};
