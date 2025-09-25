import { GoogleGenAI, Type } from "@google/genai";
import { AIFeedback, AITutorFeedback } from "../types";

const apiKey = import.meta.env.VITE_API_KEY;

if (!apiKey) {
    throw new Error("VITE_API_KEY is not defined. Please check your .env file.");
}

const ai = new GoogleGenAI({ apiKey });

export const validateShortAnswer = async (
    question: string,
    correctAnswer: string,
    userAnswer: string
): Promise<AIFeedback> => {
    const prompt = `
        The question is: "${question}"
        The correct answer is: "${correctAnswer}"
        The user's submitted answer is: "${userAnswer}"

        Evaluate the user's answer and respond in the specified JSON format.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: "You are an AI teaching assistant. Your task is to evaluate a user's answer to a quiz question for semantic correctness. Respond ONLY with a valid JSON object.",
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        isCorrect: {
                            type: Type.BOOLEAN,
                            description: "Whether the user's answer is semantically correct."
                        },
                        feedback: {
                            type: Type.STRING,
                            description: "A brief explanation of why the user's answer is correct or incorrect."
                        }
                    }
                }
            }
        });

        const jsonString = response.text?.trim();
        if (!jsonString) {
            throw new Error("Received an empty or invalid response from the AI.");
        }
        const result = JSON.parse(jsonString);
        return result as AIFeedback;

    } catch (error) {
        console.error("Error validating answer with Gemini API:", error);
        return {
            isCorrect: false,
            feedback: "Sorry, I couldn't validate your answer at this time. Please try again later.",
        };
    }
};


export const getExerciseFeedback = async (
    task: string,
    exampleSolution: string,
    userAnswer: string
): Promise<AITutorFeedback> => {
    const prompt = `
        You are an encouraging and helpful teaching assistant. Your goal is to provide constructive feedback on a user's answer to an exercise, not just to grade it.
        
        Here is the context:
        - The exercise task was: "${task}"
        - An example of a good solution is: "${exampleSolution}"
        - The user's submitted answer is: "${userAnswer}"

        Please analyze the user's answer in relation to the example solution and provide feedback.
        - Start by acknowledging their effort and pointing out what they did well.
        - Gently guide them on how they could improve their answer to be more like the example solution.
        - Keep the tone positive and supportive.
        - Respond ONLY with a valid JSON object in the specified format.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        feedback: {
                            type: Type.STRING,
                            description: "Supportive and constructive feedback for the user, comparing their answer to the example solution."
                        }
                    }
                }
            }
        });
        const jsonString = response.text?.trim();
        if (!jsonString) {
            throw new Error("Received an empty response from the AI.");
        }
        return JSON.parse(jsonString) as AITutorFeedback;
    } catch (error) {
        console.error("Error getting exercise feedback from Gemini API:", error);
        return {
            feedback: "Sorry, I couldn't process your answer right now. Please check your answer and try again."
        };
    }
};