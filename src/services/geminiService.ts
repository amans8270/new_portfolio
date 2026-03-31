import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured. Please add it to your environment variables.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export async function askAmanAgent(question: string, resumeContext: string) {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
    You are Aman's Neural Terminal Agent. 
    You have access to Aman's resume context:
    ---
    ${resumeContext}
    ---
    Answer questions about Aman Singh based on this context. 
    Be professional, concise, and stay in character as a terminal AI.
    If the information isn't in the context, say you don't have that specific data but mention Aman's general expertise in AI and Full-Stack.
    Aman's GitHub: github.com/amans8270
    Aman's LinkedIn: https://www.linkedin.com/in/aman-singh-03571713a/
  `;

  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model,
      contents: question,
      config: {
        systemInstruction,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Agent Error:", error);
    return error instanceof Error && error.message.includes("GEMINI_API_KEY") 
      ? "Error: Neural link offline (API key missing)."
      : "Error: Neural link interrupted. Please try again.";
  }
}
