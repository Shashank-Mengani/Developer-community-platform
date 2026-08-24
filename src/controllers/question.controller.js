import { generateQuestionTags } from '../ai-services/questionTags.service.js';
import Question from '../models/question.model.js';
import { AppError } from '../utils/AppError.js';

export const createQuestions = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { title, body } = req.body;

        const existingQuestion = await Question.findOne({
            title: title
        });

        if(existingQuestion){
            throw new AppError("Bad Request", 401);
        }

        const aiResult = await generateQuestionTags(title, body);

        let tags = [];
        if(Array.isArray(aiResult.tags)){
            tags = aiResult.tags;
        }

        const question = await Question.create({
            author: userId,
            title,
            body,
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
        const questions = await Question.find();

        res.status(200).json({ 
            message: "questions fetched successfully",
            data: questions
        });

    } catch (error) {
        next(error);
    }
}

export const getQuestionById = async (req, res, next) => {
    try {
        const { id } = req.params.id;

        const question = await Question.findById(req.params.id);
        res.status(200).json({
            message: "Retrieved question succesfully",
            data: question
        });

    } catch (error) {
        next(error);
    }
}

export const updateQuestion = async (req, res, next) => {
    try {
        const { id } = req.params;

        const question = await Question.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({ 
            message: "Updated question successfully",
            data: question
        });

    } catch (error) {
        next(error);
    }
}

export const deleteQuestion = async (req, res, next) => {
    try {
        const { id } = req.params;

        const question = await Question.findByIdAndDelete(id);
        if(!question){
            throw new AppError("Question not found", 404);
        }
        res.status(200).json({ message: "Question deleted successfully" });
    } catch (error) {
        next(error);
    }
}