import { generateAIResponse } from "./generateAIResponse.service.js"

export const generateTags = async (question) => {
    return generateAIResponse({
        systemPrompt: `
            You are a senior software engineer.

            Generate relevant tags for the given developer question.

            Rules:
            - Return a maximum of 2 tags.
            - Tags must be concise.
            - Tags must be relevant to the question.
            - Tags must be lowercase.
            - Return ONLY valid JSON.
            - The JSON must be an object with a "tags" array.

            Example:
            {
                "tags": ["express", "jwt", "authentication"]
            }
        `,

        userPrompt: `
            Question: ${question}
        `
    });
}