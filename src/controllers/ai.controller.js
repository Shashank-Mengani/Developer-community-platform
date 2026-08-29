
import { reviewCode } from "../ai-services/codeReview.service.js";
import { explainTheCode } from "../ai-services/codeExplain.service.js";
import { generateTags } from "../ai-services/questionTags.service.js";


export const codeReview = async (req, res) => {
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

export const generateQuestionTag = async (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({
                message: "Question is required",
                success: false
            });
        }

        const questionTags = await generateTags(question);

        res.status(200).json({
            success: true,
            data: questionTags
        });

        console.log(questionTags);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to generate question tags",
            success: false
        });
    }
};
