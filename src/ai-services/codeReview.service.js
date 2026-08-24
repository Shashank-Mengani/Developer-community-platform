import { generateAIResponse } from "./generateAIResponse.service.js";


export async function reviewCode(code, language){
    return generateAIResponse({
    systemPrompt: `
      You are an expert software engineer for DevConnect.

      Review the user's code.

      Analyze:
      1. Bugs
      2. Security vulnerabilities
      3. Performance issues
      4. Code quality
      5. Improvements

      Return valid JSON.
    `,

    userPrompt: `
        Review this ${language} code:
            ${code}
    `,
    });
}

export async function explainCode(code, language){
    return generateAIResponse({
    systemPrompt: `
      You are an expert software engineer for DevConnect.

      Review the user's code.

      Analyze:
      1. Bugs
      2. Security vulnerabilities
      3. Performance issues
      4. Code quality
      5. Improvements

      Return valid JSON.
    `,

    userPrompt: `
        Review this ${language} code:
            ${code}
    `,
    });
}