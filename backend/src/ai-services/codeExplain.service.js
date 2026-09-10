import { generateAIResponse } from "./generateAIResponse.service.js"


export const explainTheCode = async (code, language) => {
    return generateAIResponse({
        systemPrompt: `
            you are a senior backend engineer.

            Explain code clearly for a beginner step by step.

            Return the response as valid JSON with the following fields:
            {
                "contents": [],
                "difficulty": "",
                "summary": ""
            } 
        `,

        userPrompt: `
            Explain this ${language} code:
            ${code} `
    });
}