import Groq from "groq-sdk";
import 'dotenv/config';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

export async function generateAIResponse({
    systemPrompt,
    userPrompt
}) {
    try {
    const response = await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages: [
            {
                role: "system",
                content: `${systemPrompt}
            Return your response as valid JSON.`,    
            },
            {
                role: "user",
                content: userPrompt
            }
        ],

        reasoning_effort: "low",
        max_completion_tokens: 1000,

        response_format: {
            type: "json_object"
        },
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
        throw new Error("LLM returned empty response");
    }

    return JSON.parse(content);

} catch(error){
    console.log("Groq error: ", error)
    throw error;
} 
}

export const explainTheCode = async (code, language) => {
    try {
        const response = await groq.chat.completions.create({
            model: "openai/gpt-oss-20b",
            messages: [
                {
                    role: "system",
                    content: `
                        you are a senior backend engineer.

                        Explain code clearly for a beginner step by step and also use fields like contents, difficulty etc.

                        Return the response as valid JSON. 
                    `
                },

                {
                    role: "user",
                    content: `
                        Explain this ${language} code:
                        ${code}
                    `
                }
            ],

            reasoning_effort: "low",
            max_completion_tokens: 1000,
            response_format: {
                type: "json_object"
            },
        });

        const content = response.choices[0]?.message?.content;
        return JSON.parse(content);
    } catch (error) {
        console.log("Groq error:", error);
        throw error;
    }
}