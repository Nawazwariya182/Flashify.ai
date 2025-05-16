"use client"

import { Button } from "@/components/ui/button"

import { useEffect, useState } from "react"
import { Calendar, BarChart3, TrendingUp, Award, Brain, Clock, CheckCircle, XCircle, HelpCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { StatsChart } from "@/components/stats-chart"
import { CalendarHeatmap } from "@/components/calendar-heatmap"
import { Navbar } from "@/components/navbar"
import { getStats, getDecks, getFlashcards, type StatsType } from "@/app/services/storage-service"
import Image from "next/image"

export default function StatsPage() {
  const [stats, setStats] = useState<StatsType | null>(null)
  const [decks, setDecks] = useState<any[]>([])
  const [flashcards, setFlashcards] = useState<any[]>([])
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("week")

  useEffect(() => {
    // Load stats, decks, and flashcards
    const loadedStats = getStats()
    const loadedDecks = getDecks()
    const loadedFlashcards = getFlashcards()

    setStats(loadedStats)
    setDecks(loadedDecks)
    setFlashcards(loadedFlashcards)
  }, [])

  // Calculate deck performance
  const deckPerformance = decks
    .map((deck) => {
      const deckFlashcards = flashcards.filter((card) => card.deckId === deck.id)
      const totalCards = deckFlashcards.length

      if (totalCards === 0) return { ...deck, mastery: 0 }

      // Calculate mastery based on difficulty ratings
      const easyCards = deckFlashcards.filter((card) => card.difficulty === "easy").length
      const mediumCards = deckFlashcards.filter((card) => card.difficulty === "medium").length

      // Easy cards count as 100% mastery, medium as 50%
      const mastery = Math.round(((easyCards * 1.0 + mediumCards * 0.5) / totalCards) * 100)

      return {
        ...deck,
        cardCount: totalCards,
        mastery,
      }
    })
    .filter((deck) => deck.cardCount > 0)
    .sort((a, b) => b.mastery - a.mastery)

  // Calculate overall stats
  const totalCards = flashcards.length
  const reviewedCards = flashcards.filter((card) => card.difficulty !== null).length
  const easyCards = flashcards.filter((card) => card.difficulty === "easy").length
  const mediumCards = flashcards.filter((card) => card.difficulty === "medium").length
  const hardCards = flashcards.filter((card) => card.difficulty === "hard").length

  // Calculate percentages
  const easyPercentage = totalCards > 0 ? Math.round((easyCards / totalCards) * 100) : 0
  const mediumPercentage = totalCards > 0 ? Math.round((mediumCards / totalCards) * 100) : 0
  const hardPercentage = totalCards > 0 ? Math.round((hardCards / totalCards) * 100) : 0

  // Determine mastery level
  const getMasteryLevel = () => {
    if (totalCards === 0) return "Beginner"

    const overallMastery = Math.round(((easyCards * 1.0 + mediumCards * 0.5) / totalCards) * 100)

    if (overallMastery >= 80) return "Master"
    if (overallMastery >= 60) return "Advanced"
    if (overallMastery >= 40) return "Intermediate"
    return "Beginner"
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-background/50">
      <Navbar />

      <main className="flex-1">
        <div className="container px-4 py-8 mx-auto md:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Learning Analytics</h1>
              <p className="text-muted-foreground">Track your progress and learning habits</p>
            </div>
            <Tabs defaultValue={timeRange} onValueChange={(value) => setTimeRange(value as "week" | "month" | "year")}>
              <TabsList>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="year">Year</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Empty state */}
          {totalCards === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="p-4 mb-4 bg-primary/10 rounded-full">
                <BarChart3 className="w-10 h-10 text-primary" />
              </div>
              <h2 className="mb-2 text-xl font-semibold">No stats yet</h2>
              <p className="mb-6 text-muted-foreground text-center max-w-md">
                Start creating and studying flashcards to see your learning analytics.
              </p>
              <a href="/create">
                <Button className="shadow-lg shadow-primary/20">Create Your First Deck</Button>
              </a>
            </div>
          )}

          {totalCards > 0 && (
            <>
              {/* Stats Cards - Bento Grid Layout */}
              <div className="grid gap-6 mb-8 md:grid-cols-4">
                <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-background to-background p-[1px]">
                  <div className="bg-card rounded-[inherit] p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
                        <div className="flex items-baseline mt-1">
                          <h3 className="text-3xl font-bold">{stats?.streak || 0}</h3>
                          <span className="ml-1 text-lg">days</span>
                        </div>
                      </div>
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-background to-background p-[1px]">
                  <div className="bg-card rounded-[inherit] p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Cards Reviewed</p>
                        <div className="flex items-baseline mt-1">
                          <h3 className="text-3xl font-bold">{stats?.cardsReviewed || 0}</h3>
                          <span className="ml-1 text-lg">cards</span>
                        </div>
                      </div>
                      <div className="p-2 bg-primary/10 rounded-full">
                        <BarChart3 className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-background to-background p-[1px]">
                  <div className="bg-card rounded-[inherit] p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Retention Rate</p>
                        <div className="flex items-baseline mt-1">
                          <h3 className="text-3xl font-bold">{easyPercentage}%</h3>
                        </div>
                      </div>
                      <div className="p-2 bg-primary/10 rounded-full">
                        <TrendingUp className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-background to-background p-[1px]">
                  <div className="bg-card rounded-[inherit] p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Mastery Level</p>
                        <div className="flex items-baseline mt-1">
                          <h3 className="text-3xl font-bold">{getMasteryLevel()}</h3>
                        </div>
                      </div>
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Award className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span>
                          Based on {decks.length} {decks.length === 1 ? "deck" : "decks"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Charts Section */}
              <div className="grid gap-6 mb-8 md:grid-cols-7">
                <Card className="md:col-span-4 overflow-hidden border-0 shadow-xl bg-gradient-to-br from-background to-background p-[1px]">
                  <div className="bg-card rounded-[inherit] p-6">
                    <CardHeader className="p-0 pb-6">
                      <CardTitle>Study Activity</CardTitle>
                      <CardDescription>Your daily learning progress over time</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <StatsChart timeRange={timeRange} />
                    </CardContent>
                  </div>
                </Card>

                <Card className="md:col-span-3 overflow-hidden border-0 shadow-xl bg-gradient-to-br from-background to-background p-[1px]">
                  <div className="bg-card rounded-[inherit] p-6">
                    <CardHeader className="p-0 pb-6">
                      <CardTitle>Study Calendar</CardTitle>
                      <CardDescription>Your learning consistency</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <CalendarHeatmap timeRange={timeRange} />
                    </CardContent>
                  </div>
                </Card>
              </div>

              {/* Performance Metrics */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-background to-background p-[1px]">
                  <div className="bg-card rounded-[inherit] p-6">
                    <CardHeader className="p-0 pb-6">
                      <CardTitle>Deck Performance</CardTitle>
                      <CardDescription>Your mastery level across different decks</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      {deckPerformance.length === 0 ? (
                        <div className="py-8 text-center text-muted-foreground">
                          No deck performance data available yet
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {deckPerformance.slice(0, 4).map((deck) => (
                            <div key={deck.id} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{deck.title}</span>
                                  <span className="text-sm text-muted-foreground">{deck.cardCount} cards</span>
                                </div>
                                <span className="text-sm font-medium">{deck.mastery}%</span>
                              </div>
                              <Progress value={deck.mastery} className="h-2" />
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </div>
                </Card>

                <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-background to-background p-[1px]">
                  <div className="bg-card rounded-[inherit] p-6">
                    <CardHeader className="p-0 pb-6">
                      <CardTitle>Learning Breakdown</CardTitle>
                      <CardDescription>Your response patterns across all decks</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col items-center justify-center p-4 bg-background rounded-lg">
                          <div className="p-2 mb-2 bg-green-100 rounded-full dark:bg-green-900/30">
                            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="text-2xl font-bold">{easyPercentage}%</div>
                          <div className="text-sm text-muted-foreground">Easy</div>
                        </div>
                        <div className="flex flex-col items-center justify-center p-4 bg-background rounded-lg">
                          <div className="p-2 mb-2 bg-yellow-100 rounded-full dark:bg-yellow-900/30">
                            <HelpCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                          </div>
                          <div className="text-2xl font-bold">{mediumPercentage}%</div>
                          <div className="text-sm text-muted-foreground">Medium</div>
                        </div>
                        <div className="flex flex-col items-center justify-center p-4 bg-background rounded-lg">
                          <div className="p-2 mb-2 bg-red-100 rounded-full dark:bg-red-900/30">
                            <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                          </div>
                          <div className="text-2xl font-bold">{hardPercentage}%</div>
                          <div className="text-sm text-muted-foreground">Hard</div>
                        </div>
                      </div>

                      <div className="mt-6 space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">Total flashcards</span>
                            </div>
                            <span className="font-medium">{totalCards} cards</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <BarChart3 className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">Total decks</span>
                            </div>
                            <span className="font-medium">{decks.length} decks</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">Cards created</span>
                            </div>
                            <span className="font-medium">{stats?.cardsCreated || 0} cards</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12">
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
