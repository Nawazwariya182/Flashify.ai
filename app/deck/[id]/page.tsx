"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CheckCircle, XCircle, HelpCircle, Info, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Flashcard } from "@/components/flashcard"
import { Navbar } from "@/components/navbar"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  getDeckById,
  getFlashcardsForDeck,
  updateFlashcardAfterReview
} from "@/app/services/storage-service"
import {
  type FlashcardType,
  type DeckType,
} from "@/app/actions/gemini-actions"
import Image from "next/image"

export default function DeckReviewPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [deck, setDeck] = useState<DeckType | null>(null)
  const [flashcards, setFlashcards] = useState<FlashcardType[]>([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [reviewedCards, setReviewedCards] = useState<string[]>([])
  const [ratings, setRatings] = useState<Record<string, "easy" | "medium" | "hard">>({})
  const [showConfetti, setShowConfetti] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load deck and flashcards
    const loadedDeck = getDeckById(params.id)
    if (!loadedDeck) {
      // Deck not found, redirect to decks page
      router.push("/decks")
      return
    }

    setDeck(loadedDeck)
    const loadedFlashcards = getFlashcardsForDeck(params.id)
    setFlashcards(loadedFlashcards)
    setLoading(false)
  }, [params.id, router])

  const currentCard = flashcards[currentCardIndex]
  const progress = flashcards.length > 0 ? (reviewedCards.length / flashcards.length) * 100 : 0
  const isReviewComplete = flashcards.length > 0 && reviewedCards.length === flashcards.length

  useEffect(() => {
    if (isReviewComplete) {
      setShowConfetti(true)
      const timer = setTimeout(() => {
        setShowConfetti(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isReviewComplete])

  const handleRateCard = (rating: "easy" | "medium" | "hard") => {
    if (!currentCard) return

    // Update flashcard with new rating and next review date
    const updatedCard = updateFlashcardAfterReview(currentCard, rating)

    // Update local state
    setRatings((prev) => ({ ...prev, [currentCard.id]: rating }))

    if (!reviewedCards.includes(currentCard.id)) {
      setReviewedCards((prev) => [...prev, currentCard.id])
    }

    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex((prev) => prev + 1)
    }
  }

  const resetReview = () => {
    setCurrentCardIndex(0)
    setReviewedCards([])
    setRatings({})
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-background/50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block p-3 mb-4 bg-primary/10 rounded-full">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-xl font-medium">Loading deck...</h2>
          </div>
        </main>
      </div>
    )
  }

  if (!deck || flashcards.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-background/50">
        <Navbar />
        <main className="flex-1">
          <div className="container px-4 py-8 mx-auto md:px-6">
            <div className="flex items-center gap-2 mb-6">
              <Link href="/decks">
                <Button variant="ghost" size="sm" className="gap-1">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Decks
                </Button>
              </Link>
            </div>

            <div className="flex flex-col items-center justify-center py-20">
              <div className="p-4 mb-4 bg-primary/10 rounded-full">
                <Info className="w-10 h-10 text-primary" />
              </div>
              <h2 className="mb-2 text-xl font-semibold">No flashcards in this deck</h2>
              <p className="mb-6 text-muted-foreground text-center max-w-md">
                This deck doesn't have any flashcards yet. Add some flashcards to start studying.
              </p>
              <Link href={`/create?deckId=${params.id}`}>
                <Button className="shadow-lg shadow-primary/20">Add Flashcards</Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-background/50">
      <Navbar />

      <main className="flex-1">
        <div className="container px-4 py-8 mx-auto md:px-6">
          <div className="flex items-center gap-2 mb-6">
            <Link href="/decks">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="w-4 h-4" />
                Back to Decks
              </Button>
            </Link>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold tracking-tight">{deck.title}</h1>
                <div className="flex gap-1">
                  {deck.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <p className="text-muted-foreground">{deck.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 p-2 rounded-md bg-secondary">
                      <span className="text-sm font-medium">
                        {reviewedCards.length} of {flashcards.length}
                      </span>
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Cards reviewed in this session</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Progress value={progress} className="w-[100px] h-2" />
            </div>
          </div>

          {isReviewComplete ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="relative">
                <div className="absolute -inset-4 rounded-full blur-lg bg-green-500/20"></div>
                <div className="relative p-4 bg-green-100 rounded-full dark:bg-green-900/30">
                  <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <h2 className="mt-6 mb-2 text-3xl font-bold">Review Complete!</h2>
              <p className="mb-8 text-xl text-muted-foreground">
                You've reviewed all {flashcards.length} cards in this deck.
              </p>

              {/* Stats summary */}
              <div className="grid grid-cols-3 gap-4 p-6 mb-8 bg-white rounded-xl shadow-lg dark:bg-gray-950 dark:border dark:border-gray-800 w-full max-w-md">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500">
                    {Object.values(ratings).filter((r) => r === "easy").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Easy</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-500">
                    {Object.values(ratings).filter((r) => r === "medium").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Medium</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-500">
                    {Object.values(ratings).filter((r) => r === "hard").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Hard</div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button onClick={resetReview} className="shadow-lg shadow-primary/20">
                  Review Again
                </Button>
                <Link href="/decks">
                  <Button variant="outline">Back to Decks</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center max-w-2xl mx-auto">
              {currentCard && <Flashcard question={currentCard.question} answer={currentCard.answer} />}

              <div className="flex justify-center gap-3 mt-8 w-full">
                <Button
                  variant="outline"
                  className="flex-1 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-900 dark:hover:bg-red-950 dark:hover:text-red-400 h-12"
                  onClick={() => handleRateCard("hard")}
                >
                  <XCircle className="w-5 h-5 mr-2" />
                  Hard
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-yellow-200 hover:bg-yellow-50 hover:text-yellow-600 dark:border-yellow-900 dark:hover:bg-yellow-950 dark:hover:text-yellow-400 h-12"
                  onClick={() => handleRateCard("medium")}
                >
                  <HelpCircle className="w-5 h-5 mr-2" />
                  Medium
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-green-200 hover:bg-green-50 hover:text-green-600 dark:border-green-900 dark:hover:bg-green-950 dark:hover:text-green-400 h-12"
                  onClick={() => handleRateCard("easy")}
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Easy
                </Button>
              </div>

              <div className="mt-8 text-sm text-muted-foreground">
                <p>
                  Card {currentCardIndex + 1} of {flashcards.length}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Confetti effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute top-0 left-1/4 w-2 h-8 bg-yellow-500 animate-confetti-1"></div>
          <div className="absolute top-0 left-1/3 w-2 h-10 bg-blue-500 animate-confetti-2"></div>
          <div className="absolute top-0 left-1/2 w-2 h-6 bg-red-500 animate-confetti-3"></div>
          <div className="absolute top-0 left-2/3 w-2 h-12 bg-green-500 animate-confetti-4"></div>
          <div className="absolute top-0 left-3/4 w-2 h-8 bg-purple-500 animate-confetti-5"></div>
          <div className="absolute top-0 left-1/5 w-2 h-10 bg-pink-500 animate-confetti-6"></div>
          <div className="absolute top-0 left-4/5 w-2 h-6 bg-indigo-500 animate-confetti-7"></div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 mx-auto md:h-24 md:flex-row md:py-0">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full blur-sm bg-primary/30"></div>
              <Image
                src="/logo.svg"
                alt="Flashify.ai Logo"
                width={32}
                height={32}
                className="relative w-8 h-8"
              />
            </div>
            <span className="text-sm font-semibold">Flashify.ai</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2025 Flashify.ai. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
