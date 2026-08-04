import Answer from '../models/answer.model.js';
import Question from '../models/question.model.js';

export const createAnswer = async (req, res) => {
    try {
        const { id } = req.params;
        const { body } = req.body;

        console.log("DB:", Question.db.name);

        const question = await Question.findById(id);

        console.log("question: ", question);

        if(!question){
            return res.status(404).json({ message: "Question not found" });
        }

        const answer = await Answer.create({
            body: body,
            question: id
        });

        const updateQuestion = await Question.findByIdAndUpdate(id, {
            $inc: { answerCount: 1 }
        }, { new: true });
        console.log(updateQuestion);

        res.status(201).json({ message: "Answer created successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getAnswer = async (req, res) => {
    try {
        const answer = await Answer.find();

        res.status(200).json({
            message: "Fetched answers succesfully",
            data: answer
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getAnswerById = async (req, res) => {
    try {
        const { id } = req.params;
        const answer = await Answer.findById(id);

        res.status(200).json({
            message: "Fetched answer succesfully",
            data: answer
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
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
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}