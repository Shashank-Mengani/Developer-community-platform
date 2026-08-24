import { success } from "zod";
import { reviewCode } from "../ai-services/codeReview.service.js";
import { explainTheCode } from "../ai-services/codeExplain.service.js";
import { generateQuestionTags } from "../ai-services/questionTags.service.js";


export const codeReview = async (req, res, next) => {
    try {
        const { code, language } = req.body;

        if(!code){
            return res.status(400).json({
                message:  "Code is required",
                success: false
            });
        }

        const result = await reviewCode(
            code,
            language || "javascript"
        );

        res.status(200).json({
            success:true,
            data: result
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Unable to review code"
        });
    }
}

export const explainCode = async (req, res) => {
    try {
        const { code, language } = req.body;

        if(!code){
            return res.status(400).json({
                message: "Code is required",
                success: false
            });
        }

        const resultCode = await explainTheCode(
            code,
            language || "javascript"
        );

        res.status(200).json({
            success: true,
            data: resultCode
        });
        console.log(resultCode);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to explain code"
        });
    }
}

export const questionTag = async (req, res) => {
    try {

        const { title, description } = req.body;

        if(!title || !description){
            return res.status(400).json({
                success: false,
                message: "Title and Describtion fields are required"
            });
        }

        const result = await generateQuestionTags(
            title,
            description
        );

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error("AI question tags error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to generate question tags"
        });
    }
}