
import { answerTags } from '../ai-services/answerTags.service.js';
import Answer from '../models/answer.model.js';
import Question from '../models/question.model.js';
import { AppError } from '../utils/AppError.js';

export const createAnswer = async (req, res, next) => {
    try {

        const userId = req.user.id;
        const { id } = req.params;
        const { body } = req.body;

        const question = await Question.findById(id);

        console.log("question: ", question);

        if(!question){
           throw new AppError("Question not found", 404);
        }

        const aiResult = await answerTags(body);

        let tags = [];
        if(Array.isArray(aiResult.tags)){
            tags = aiResult.tags;
        }

        const answer = await Answer.create({
            author: userId,
            body: body,
            question: id,
            tags
        });

        const updateQuestion = await Question.findByIdAndUpdate(id, {
            $inc: { answerCount: 1 }
        }, { new: true });
        
        // console.log(updateQuestion);

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
        const answer = await Answer.find();

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

export const updateAnswer = async (req, res) => {
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