import Bookmark from "../models/bookmark.model.js";
import Question from "../models/question.model.js";
import Answer from "../models/answer.model.js";

export const createBookmark = async (req, res) => {
    try {
        const userId = req.user.id;
        const { type, id } = req.body;

        if(!["question", "answer"].includes(type)){
            return res.status(400).json({
                message: "Invalid Bookmark type"
        });        
        }    

        const item = type === "question" ? await Question.findById(id) : await Answer.findById(id);

        if (!item) {
        return res.status(404).json({
            message: `${type} not found`
        });
        }   
        
        const existing = await Bookmark.findOne({
            user: userId,
            item: id,
            itemType:type
        });

        if (existing) {
        return res.status(409).json({
            success: false,
            message: "Already bookmarked",
        });
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
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const removeBookmark = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemType, item } = req.body;

        const bookmark = await Bookmark.findOneAndDelete({
            user: userId,
            itemType: itemType,
            item: item
        });

        if(!bookmark){
            return res.status(404).json({ message: "Bookmark not found" });
        }

        res.status(200).json({ 
            message: "Bookmark removed successfully",
            data: bookmark
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}