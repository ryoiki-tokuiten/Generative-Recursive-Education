import { getInitialLessonPrompt } from "./prompts/initialLessonPrompt";
import { getFollowUpLessonPrompt } from "./prompts/followUpLessonPrompt";
import { GoogleGenAI } from "@google/genai";

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API Key not found");
    }
    return new GoogleGenAI({ apiKey });
};

const MODEL_NAME = 'gemini-3.5-flash';

// gemma-4-31b-it
// gemma-4-26b-a4b-it

const CLEAN_REGEX = /```html|```/g;

export const generateInitialLesson = async (topic: string): Promise<string> => {
    const ai = getClient();

    const prompt = getInitialLessonPrompt(topic);


    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt
        });

        return (response.text || "").replace(CLEAN_REGEX, '').trim();
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
};

export const generateFollowUpLesson = async (
    currentTopic: string,
    clickedElementHtml: string,
    userQuestion: string
): Promise<string> => {
    const ai = getClient();

    const prompt = getFollowUpLessonPrompt(currentTopic, clickedElementHtml, userQuestion);

    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
        });

        return (response.text || "").replace(CLEAN_REGEX, '').trim();
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
};
