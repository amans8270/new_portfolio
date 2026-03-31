import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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
    return "Error: Neural link interrupted. Please try again.";
  }
}
