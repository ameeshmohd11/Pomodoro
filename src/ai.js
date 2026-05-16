import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = "AIzaSyD1B2aWhE28d_1LLy8J56AjixSagdgNMA0"; // Using the provided key

const genAI = new GoogleGenerativeAI(API_KEY);

export const generateStudyPlan = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const fullPrompt = `You are a helpful, encouraging expert study planner AI. A student is asking you for a study plan: "${prompt}".
Create a very concise, practical breakdown for them using Pomodoro blocks (focus/break cycles). Keep it under 100 words so it fits well inside a small UI card. Do not use complex markdown, just brief text or simple bullet points.`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Sorry, I couldn't generate a plan right now. Please check your network or try again later.";
  }
};
