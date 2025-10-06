
import { GoogleGenAI } from "@google/genai";
import type { Question } from '../types';

if (!process.env.API_KEY) {
  // In a real app, you might want to show this to the user
  console.error("API_KEY environment variable not set. Using a placeholder key.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const getExplanationForQuestion = async (question: Question, correctAnswer: string): Promise<string> => {
  if (!process.env.API_KEY) {
     return Promise.resolve("API key is not configured. Cannot generate explanation.");
  }
  
  const optionsString = question.options 
    ? Object.entries(question.options).map(([key, value]) => `${key}: ${value}`).join('\n') 
    : 'This is not a multiple choice question.';
    
  const prompt = `
    You are an expert HSK 6 Chinese language tutor.
    For the following HSK 6 multiple-choice question, please provide a concise and clear explanation for why the correct answer is correct. Explain the relevant grammar point, vocabulary, or reasoning.
    Keep the explanation easy to understand for an advanced Chinese learner. Respond in English.

    Question: ${question.question}
    ${question.passage ? `Passage context:\n---\n${question.passage}\n---\n` : ''}
    Options:
    ${optionsString}

    Correct Answer: ${correctAnswer} - ${question.options ? question.options[correctAnswer] : ''}

    Explanation:
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error('Error generating explanation:', error);
    throw new Error('Failed to get explanation from Gemini API.');
  }
};
