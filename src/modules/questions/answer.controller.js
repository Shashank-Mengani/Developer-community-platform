import Answer from "./answer.model.js";
import Question from "./question.model.js";

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