
import Answer from "../models/answer.model.js";
import Question from "../models/question.model.js";
import Vote from "../models/vote.model.js";

export const questionVote = async (req, res) => {
    try {
        const questionId = req.params.id;
        const userId = req.user.id;
        const { type } = req.body;

        if(!["up", "down".includes(type)]){
            return res.status(400).json({
                message: "Invalid vote type"
            });
        }

        const question = await Question.findById(questionId);

        if(!question){
            return res.status(404).json({
                message: "Question not found"
            });
        }

        const existingVote = await Vote.findOne({
            user: userId,
            question: questionId
        });

        if(existingVote){
            return res.status(400).json({ message: "You have already voted on this question" });
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
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const answerVote = async (req, res) => {
    try {
        const answerId = req.params.id;
        const userId = req.user.id;
        const { type } = req.body;

        if(!["up", "down"].includes(type)){
            return res.status(400).json({ message: "Invalid vote Type" });
        }

        const answer = await Answer.findById(answerId);
        if(!answer){
            return res.status(404).json({ message: "Answer not found" });
        }

        const existingVote = await Vote.findOne({
            answer: answerId,
            user: userId
        });
        if(existingVote){
            return res.status(400).json({ message: "You have already voted on this Answer" });
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
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const questionVotesById = async (req, res) => {
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
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const answerVotesById = async (req, res) => {
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
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}