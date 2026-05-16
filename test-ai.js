import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = "AIzaSyD1B2aWhE28d_1LLy8J56AjixSagdgNMA0";
const genAI = new GoogleGenerativeAI(API_KEY);

async function test() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Say hello world");
    console.log("Success:", result.response.text());
  } catch (e) {
    console.error("Error:", e.message);
  }
}

test();
