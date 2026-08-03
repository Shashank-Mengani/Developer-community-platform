import Question from './question.model.js';

export const createQuestions = async (req, res) => {
    try {
        const { title, body, views } = req.body;

        const existingQuestion = await Question.findOne({
            title: title
        });

        if(existingQuestion){
            return res.status(401).json({ message: "Bad Request "});
        }

        const question = await Question.insertMany(req.body);

        res.status(201).json({
            message: "question added successfully",
            data: question
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getQuestion = async (req, res) => {
    try {
        const questions = await Question.find();

        res.status(200).json({ 
            message: "questions fetched successfully",
            data: questions
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getQuestionById = async (req, res) => {
    try {
        const { id } = req.params.id;

        const question = await Question.findById(req.params.id);
        res.status(200).json({
            message: "Retrieved question succesfully",
            data: question
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateQuestion = async (req, res) => {
    try {
        const { id } = req.params;

        const question = await Question.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({ 
            message: "Updated question successfully",
            data: question
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" })
    }
}

export const deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;

        const question = await Question.findByIdAndDelete(id);
        if(!question){
            return res.status(404).json({ message: "Question not found" });
        }
        res.status(200).json({ message: "Question deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}