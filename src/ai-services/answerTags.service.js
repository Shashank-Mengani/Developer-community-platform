import { generateAIResponse } from "./generateAIResponse.service.js"

export const answerTags = async (body) => {
    return generateAIResponse({
        systemPrompt: `
            you are a senior backend engineer.
            provide relavant tags for answer.
            return maximum 3 tags.
        `,
        userPrompt: `
            Answer body: ${body}
        `
    });
}