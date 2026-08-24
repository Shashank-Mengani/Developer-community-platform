import { generateAIResponse } from "./generateAIResponse.service.js"

export const generateQuestionTags = (title, body) => {             

    return generateAIResponse({
        systemPrompt: `
            you are a developer community assisstant.
            Generate relevant programming tags.
            return maximum a 5 tags.
        `,

        userPrompt: `
            Question tile: ${title}
            Question description: ${body}
        `
    });
}