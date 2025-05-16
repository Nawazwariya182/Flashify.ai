"use client"

import type { DeckType, FlashcardType } from "../actions/gemini-actions"

// Storage keys
const DECKS_STORAGE_KEY = "Flashify.ai_decks"
const FLASHCARDS_STORAGE_KEY = "Flashify.ai_flashcards"
const STATS_STORAGE_KEY = "Flashify.ai_stats"

// Stats type
export type StatsType = {
  streak: number
  lastStudyDate: string
  cardsReviewed: number
  cardsCreated: number
  studyDays: Record<string, number> // Date string -> cards studied
}

// Initialize stats if not exists
const initStats = (): StatsType => {
  return {
    streak: 0,
    lastStudyDate: "",
    cardsReviewed: 0,
    cardsCreated: 0,
    studyDays: {},
  }
}

// Get all decks
export const getDecks = (): DeckType[] => {
  if (typeof window === "undefined") return []

  const decksJson = localStorage.getItem(DECKS_STORAGE_KEY)
  return decksJson ? JSON.parse(decksJson) : []
}

// Get a single deck by ID
export const getDeckById = (id: string): DeckType | null => {
  const decks = getDecks()
  return decks.find((deck) => deck.id === id) || null
}

// Save a deck
export const saveDeck = (deck: DeckType): DeckType => {
  const decks = getDecks()
  const existingDeckIndex = decks.findIndex((d) => d.id === deck.id)

  if (existingDeckIndex >= 0) {
    // Update existing deck
    decks[existingDeckIndex] = {
      ...deck,
      updatedAt: new Date().toISOString(),
    }
  } else {
    // Add new deck
    decks.push({
      ...deck,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  }

  localStorage.setItem(DECKS_STORAGE_KEY, JSON.stringify(decks))
  return deck
}

// Delete a deck
export const deleteDeck = (id: string): void => {
  const decks = getDecks()
  const updatedDecks = decks.filter((deck) => deck.id !== id)
  localStorage.setItem(DECKS_STORAGE_KEY, JSON.stringify(updatedDecks))

  // Also delete all flashcards in this deck
  const flashcards = getFlashcards()
  const updatedFlashcards = flashcards.filter((card) => card.deckId !== id)
  localStorage.setItem(FLASHCARDS_STORAGE_KEY, JSON.stringify(updatedFlashcards))
}

// Get all flashcards
export const getFlashcards = (): FlashcardType[] => {
  if (typeof window === "undefined") return []

  const cardsJson = localStorage.getItem(FLASHCARDS_STORAGE_KEY)
  return cardsJson ? JSON.parse(cardsJson) : []
}

// Get flashcards for a specific deck
export const getFlashcardsForDeck = (deckId: string): FlashcardType[] => {
  const flashcards = getFlashcards()
  return flashcards.filter((card) => card.deckId === deckId)
}

// Get due flashcards for a specific deck
export const getDueFlashcardsForDeck = (deckId: string): FlashcardType[] => {
  const flashcards = getFlashcardsForDeck(deckId)
  const now = new Date()
  return flashcards.filter((card) => new Date(card.nextReviewDate) <= now)
}

// Save flashcards
export const saveFlashcards = (flashcards: FlashcardType[]): FlashcardType[] => {
  const allFlashcards = getFlashcards()

  // For each flashcard, update if exists or add if new
  flashcards.forEach((flashcard) => {
    const existingIndex = allFlashcards.findIndex((card) => card.id === flashcard.id)
    if (existingIndex >= 0) {
      allFlashcards[existingIndex] = flashcard
    } else {
      allFlashcards.push(flashcard)
    }
  })

  localStorage.setItem(FLASHCARDS_STORAGE_KEY, JSON.stringify(allFlashcards))

  // Update stats
  const stats = getStats()
  stats.cardsCreated += flashcards.filter((card) => !allFlashcards.some((existing) => existing.id === card.id)).length
  saveStats(stats)

  return flashcards
}

// Update a flashcard after review
export const updateFlashcardAfterReview = (
  flashcard: FlashcardType,
  difficulty: "easy" | "medium" | "hard",
): FlashcardType => {
  const allFlashcards = getFlashcards()
  const index = allFlashcards.findIndex((card) => card.id === flashcard.id)

  if (index === -1) return flashcard

  // Calculate next review date based on difficulty
  const nextReviewDate = calculateNextReviewDate(difficulty)

  const updatedCard = {
    ...allFlashcards[index],
    difficulty,
    nextReviewDate: nextReviewDate.toISOString(),
  }

  allFlashcards[index] = updatedCard
  localStorage.setItem(FLASHCARDS_STORAGE_KEY, JSON.stringify(allFlashcards))

  // Update stats
  updateStudyStats()

  return updatedCard
}

// Calculate next review date based on difficulty
const calculateNextReviewDate = (difficulty: "easy" | "medium" | "hard"): Date => {
  const now = new Date()

  switch (difficulty) {
    case "easy":
      // Review in 3 days
      return new Date(now.setDate(now.getDate() + 3))
    case "medium":
      // Review in 1 day
      return new Date(now.setDate(now.getDate() + 1))
    case "hard":
      // Review in 4 hours
      return new Date(now.setHours(now.getHours() + 4))
    default:
      return now
  }
}

// Get stats
export const getStats = (): StatsType => {
  if (typeof window === "undefined") return initStats()

  const statsJson = localStorage.getItem(STATS_STORAGE_KEY)
  return statsJson ? JSON.parse(statsJson) : initStats()
}

// Save stats
export const saveStats = (stats: StatsType): void => {
  localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats))
}

// Update study stats
export const updateStudyStats = (): void => {
  const stats = getStats()
  const today = new Date().toISOString().split("T")[0]

  // Update cards reviewed count
  stats.cardsReviewed += 1

  // Update study days
  stats.studyDays[today] = (stats.studyDays[today] || 0) + 1

  // Update streak
  const lastStudyDate = stats.lastStudyDate ? new Date(stats.lastStudyDate) : null
  const currentDate = new Date()

  if (lastStudyDate) {
    const yesterday = new Date(currentDate)
    yesterday.setDate(yesterday.getDate() - 1)

    // If last study was yesterday, increment streak
    if (lastStudyDate.toISOString().split("T")[0] === yesterday.toISOString().split("T")[0]) {
      stats.streak += 1
    }
    // If last study was before yesterday, reset streak
    else if (lastStudyDate < yesterday) {
      stats.streak = 1
    }
    // If last study was today, don't change streak
  } else {
    // First time studying
    stats.streak = 1
  }

  stats.lastStudyDate = currentDate.toISOString()
  saveStats(stats)
}

// Get study data for chart
export const getStudyDataForChart = (): { day: string; cards: number }[] => {
  const stats = getStats()
  const last7Days: { day: string; cards: number }[] = []

  // Get last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split("T")[0]
    const dayName = new Date(dateStr).toLocaleDateString("en-US", { weekday: "short" })

    last7Days.push({
      day: dayName,
      cards: stats.studyDays[dateStr] || 0,
    })
  }

  return last7Days
}

// Get calendar heatmap data
export const getCalendarData = (): Record<string, number> => {
  const stats = getStats()
  return stats.studyDays
}
