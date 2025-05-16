"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Clock, BarChart3 } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { getDueFlashcardsForDeck, getFlashcardsForDeck } from "@/app/services/storage-service"

interface DeckCardProps {
  deck: {
    id: string
    title: string
    description: string
    tags: string[]
    updatedAt: string
  }
}

export function DeckCard({ deck }: DeckCardProps) {
  const [dueCards, setDueCards] = useState(0)
  const [totalCards, setTotalCards] = useState(0)
  const [mastery, setMastery] = useState(0)
  const [lastStudied, setLastStudied] = useState<string>("Never")

  useEffect(() => {
    // Get flashcards for this deck
    const flashcards = getFlashcardsForDeck(deck.id)
    const dueFlashcards = getDueFlashcardsForDeck(deck.id)

    setTotalCards(flashcards.length)
    setDueCards(dueFlashcards.length)

    // Calculate mastery
    if (flashcards.length > 0) {
      const easyCards = flashcards.filter((card) => card.difficulty === "easy").length
      const mediumCards = flashcards.filter((card) => card.difficulty === "medium").length

      // Easy cards count as 100% mastery, medium as 50%
      const masteryValue = Math.round(((easyCards * 1.0 + mediumCards * 0.5) / flashcards.length) * 100)
      setMastery(masteryValue)
    }

    // Calculate last studied
    const reviewedCards = flashcards.filter((card) => card.difficulty !== null)
    if (reviewedCards.length > 0) {
      // Find the most recent review date
      const mostRecentReview = new Date(
        Math.max(...reviewedCards.map((card) => new Date(card.nextReviewDate).getTime())),
      )

      // Format relative time
      const now = new Date()
      const diffDays = Math.floor((now.getTime() - mostRecentReview.getTime()) / (1000 * 60 * 60 * 24))

      if (diffDays === 0) {
        setLastStudied("Today")
      } else if (diffDays === 1) {
        setLastStudied("Yesterday")
      } else if (diffDays < 7) {
        setLastStudied(`${diffDays} days ago`)
      } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7)
        setLastStudied(`${weeks} ${weeks === 1 ? "week" : "weeks"} ago`)
      } else {
        const months = Math.floor(diffDays / 30)
        setLastStudied(`${months} ${months === 1 ? "month" : "months"} ago`)
      }
    }
  }, [deck.id])

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg border-0 shadow-md bg-gradient-to-br from-background to-background p-[1px] group">
      <div className="bg-card rounded-[inherit]">
        <CardHeader className="p-4 pb-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold group-hover:text-primary transition-colors">{deck.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">{deck.description}</p>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span className="font-medium">{totalCards}</span>
              <span className="text-muted-foreground">cards</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-1 mb-4">
            {deck.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Last studied:</span>
              </div>
              <span>{lastStudied}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <BarChart3 className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Mastery:</span>
              </div>
              <span>{mastery}%</span>
            </div>
            <Progress value={mastery} className="h-1.5" />
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="flex w-full gap-2">
            <Link href={`/deck/${deck.id}`} className="flex-1">
              <Button
                variant="default"
                className="w-full shadow-md shadow-primary/10 group-hover:shadow-primary/20 transition-all"
              >
                {dueCards > 0 ? `Study (${dueCards} due)` : "Study"}
              </Button>
            </Link>
          </div>
        </CardFooter>
      </div>
    </Card>
  )
}
