"use server"

import { GoogleGenerativeAI } from "@google/generative-ai";

export type FlashcardType = {
  id: string
  question: string
  answer: string
  deckId: string
  nextReviewDate: string
  difficulty: "easy" | "medium" | "hard" | null
}

export type DeckType = {
  id: string
  title: string
  description: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

export async function generateFlashcardsFromTopic(topic: string): Promise<FlashcardType[]> {
  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" })

    const prompt = `Generate 10 concise flashcards with questions and answers for this topic: ${topic}.
    Format your response as a JSON array with objects containing 'question' and 'answer' fields.
    Example format:
    [
      {
        "question": "What is photosynthesis?",
        "answer": "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with carbon dioxide and water, generating oxygen as a byproduct."
      }
    ]
    Make sure the response is valid JSON and contains exactly 10 flashcards.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Extract JSON from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error("Failed to parse JSON from Gemini response")
    }

    const jsonStr = jsonMatch[0]
    const flashcards = JSON.parse(jsonStr)

    // Add IDs and other required fields
    return flashcards.map((card: { question: string; answer: string }) => ({
      id: crypto.randomUUID(),
      question: card.question,
      answer: card.answer,
      deckId: "", // This will be set when adding to a deck
      nextReviewDate: new Date().toISOString(),
      difficulty: null,
    }))
  } catch (error) {
    console.error("Error generating flashcards:", error)
    throw new Error("Failed to generate flashcards")
  }
}

export async function generateFlashcardsFromText(text: string): Promise<FlashcardType[]> {
  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `Summarize this text into 10 flashcards with clear question-answer pairs:
    
    ${text}
    
    Format your response as a JSON array with objects containing 'question' and 'answer' fields.
    Example format:
    [
      {
        "question": "What is photosynthesis?",
        "answer": "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with carbon dioxide and water, generating oxygen as a byproduct."
      }
    ]
    Make sure the response is valid JSON and contains exactly 10 flashcards.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const responseText = response.text()

    // Extract JSON from the response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error("Failed to parse JSON from Gemini response")
    }

    const jsonStr = jsonMatch[0]
    const flashcards = JSON.parse(jsonStr)

    // Add IDs and other required fields
    return flashcards.map((card: { question: string; answer: string }) => ({
      id: crypto.randomUUID(),
      question: card.question,
      answer: card.answer,
      deckId: "", // This will be set when adding to a deck
      nextReviewDate: new Date().toISOString(),
      difficulty: null,
    }))
  } catch (error) {
    console.error("Error generating flashcards:", error)
    throw new Error("Failed to generate flashcards")
  }
}
