import Bookmark from "../models/bookmark.model.js";
import Question from "../models/question.model.js";
import Answer from "../models/answer.model.js";
import { AppError } from "../utils/AppError.js";

export const createBookmark = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { type, id } = req.body;

        if(!["question", "answer"].includes(type)){
            throw new AppError("Invalid Bookmark type", 400);        
        }    

        const item = type === "question" ? await Question.findById(id) : await Answer.findById(id);

        if (!item) {
            throw new AppError("Item not found", 404);
        }   
        
        const existing = await Bookmark.findOne({
            user: userId,
            item: id,
            itemType:type
        });

        if (existing) {
            throw new AppError("Already bookmarked", 409);
        }

        const bookmark = await Bookmark.create({
            user: userId,
            item: id,
            itemType: type
        });

        res.status(201).json({
            message: "Bookmarked successfully",
            data: bookmark
        })

    } catch (error) {
        next(error);
    }
}

export const removeBookmark = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { itemType, item } = req.body;

        const bookmark = await Bookmark.findOneAndDelete({
            user: userId,
            itemType: itemType,
            item: item
        });

        if(!bookmark){
            throw new AppError("Bookmark not found", 404);
        }

        res.status(200).json({ 
            message: "Bookmark removed successfully",
            data: bookmark
        });
    } catch (error) {
        next(error);
    }
}