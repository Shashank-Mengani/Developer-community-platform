
import Answer from "../models/answer.model.js";
import Question from "../models/question.model.js";
import Vote from "../models/vote.model.js";
import { AppError } from "../utils/AppError.js";


export const vote = async (req, res, next) => {

    try {

        const userId = req.user.id;

        const {
            targetId,
            targetType,
            type
        } = req.body;


        // Validate target type

        if (!["Question", "Answer"].includes(targetType)) {

            throw new AppError(
                "Invalid target type",
                400
            );

        }


        // Validate vote type

        if (!["up", "down"].includes(type)) {

            throw new AppError(
                "Invalid vote type",
                400
            );

        }


        // Find target

        let target;

        if (targetType === "Question") {

            target = await Question.findById(
                targetId
            );

        } else {

            target = await Answer.findById(
                targetId
            );

        }


        if (!target) {

            throw new AppError(
                `${targetType} not found`,
                404
            );

        }


        // Check existing vote

        const existingVote = await Vote.findOne({
            user: userId,
            targetId,
            targetType
        });


        // No previous vote
        if (!existingVote) {

            await Vote.create({
                user: userId,
                targetId,
                targetType,
                type
            });


            if (type === "up") {
                target.voteCount += 1;
            } else {
                target.voteCount -= 1;
            }


            await target.save();


            return res.status(201).json({
                message: "Vote added successfully",
                voteCount: target.voteCount,
                userVote: type
            });

        }


        // Same vote → remove vote

        if (existingVote.type === type) {

            await Vote.findByIdAndDelete(
                existingVote._id
            );


            if (type === "up") {
                target.voteCount -= 1;
            } else {
                target.voteCount += 1;
            }


            await target.save();


            return res.status(200).json({
                message: "Vote removed successfully",
                voteCount: target.voteCount,
                userVote: null
            });

        }


        // Different vote → change vote

        existingVote.type = type;

        await existingVote.save();


        if (type === "up") {

            // down → up
            target.voteCount += 2;

        } else {

            // up → down
            target.voteCount -= 2;

        }


        await target.save();


        return res.status(200).json({
            message: "Vote updated successfully",
            voteCount: target.voteCount,
            userVote: type
        });


    } catch (error) {

        next(error);

    }

};

export const getVoteStatus = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { targetType, targetId } = req.params;

        if (!["Question", "Answer"].includes(targetType)) {
            throw new AppError(
                "Invalid target type",
                400
            );
        }

        let target;

        if (targetType === "Question") {
            target = await Question.findById(targetId);
        } else {
            target = await Answer.findById(targetId);
        }

        if (!target) {
            throw new AppError(
                `${targetType} not found`,
                404
            );
        }

        const existingVote = await Vote.findOne({
            user: userId,
            targetId,
            targetType
        });

        res.status(200).json({
            message: "Vote status fetched successfully",
            data: {
                voteCount: target.voteCount,
                userVote: existingVote?.type || null
            }
        });

    } catch (error) {
        next(error);
    }
};