"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Plus, X, Save, Sparkles, Brain, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Flashcard } from "@/components/flashcard"
import { AIFlashcardGenerator } from "@/components/ai-flashcard-generator"
import { Navbar } from "@/components/navbar"
import {
  saveDeck,
  saveFlashcards,
  getDeckById,
} from "@/app/services/storage-service"
import {
  type DeckType,
  type FlashcardType,
} from "@/app/actions/gemini-actions"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import Image from "next/image"

export default function CreatePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const deckIdParam = searchParams.get("deckId")

  const [deckTitle, setDeckTitle] = useState("")
  const [deckDescription, setDeckDescription] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [flashcards, setFlashcards] = useState<FlashcardType[]>([
    {
      id: crypto.randomUUID(),
      question: "",
      answer: "",
      deckId: "",
      nextReviewDate: new Date().toISOString(),
      difficulty: null,
    },
  ])
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Check if we're editing an existing deck
    if (deckIdParam) {
      const deck = getDeckById(deckIdParam)
      if (deck) {
        setIsEditing(true)
        setDeckTitle(deck.title)
        setDeckDescription(deck.description)
        setTags(deck.tags)

        // Load flashcards for this deck
        const deckFlashcards = JSON.parse(localStorage.getItem("Flashify.ai_flashcards") || "[]").filter(
          (card: FlashcardType) => card.deckId === deckIdParam,
        )

        if (deckFlashcards.length > 0) {
          setFlashcards(deckFlashcards)
        }
      }
    }
  }, [deckIdParam])

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()])
      }
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleAddFlashcard = () => {
    setFlashcards([
      ...flashcards,
      {
        id: crypto.randomUUID(),
        question: "",
        answer: "",
        deckId: "",
        nextReviewDate: new Date().toISOString(),
        difficulty: null,
      },
    ])
  }

  const handleRemoveFlashcard = (index: number) => {
    const newFlashcards = [...flashcards]
    newFlashcards.splice(index, 1)
    setFlashcards(newFlashcards)
  }

  const handleFlashcardChange = (index: number, field: "question" | "answer", value: string) => {
    const newFlashcards = [...flashcards]
    newFlashcards[index][field] = value
    setFlashcards(newFlashcards)
  }

  const handleAddAIGeneratedFlashcards = (generatedFlashcards: FlashcardType[]) => {
    setFlashcards([...flashcards, ...generatedFlashcards])
  }

  const handleSaveDeck = () => {
    if (!deckTitle.trim()) {
      toast({
        title: "Missing title",
        description: "Please enter a title for your deck.",
        variant: "destructive",
      })
      return
    }

    const validFlashcards = flashcards.filter((card) => card.question.trim() && card.answer.trim())

    if (validFlashcards.length === 0) {
      toast({
        title: "No flashcards",
        description: "Please add at least one flashcard with both question and answer.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      // Create or update deck
      const deckId = deckIdParam || crypto.randomUUID()
      const deck: DeckType = {
        id: deckId,
        title: deckTitle,
        description: deckDescription,
        tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      saveDeck(deck)

      // Save flashcards with the deck ID
      const flashcardsWithDeckId = validFlashcards.map((card) => ({
        ...card,
        deckId,
      }))

      saveFlashcards(flashcardsWithDeckId)

      toast({
        title: isEditing ? "Deck updated" : "Deck created",
        description: `Your deck "${deckTitle}" has been ${isEditing ? "updated" : "created"} with ${validFlashcards.length} flashcards.`,
        action: (
          <ToastAction altText="View Deck" onClick={() => router.push(`/deck/${deckId}`)}>
            Study Now
          </ToastAction>
        ),
      })

      // Redirect to decks page
      router.push("/decks")
    } catch (error) {
      console.error("Error saving deck:", error)
      toast({
        title: "Error",
        description: "There was an error saving your deck. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-background/50">
      <Navbar />

      <main className="flex-1">
        <div className="container px-4 py-8 mx-auto md:px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{isEditing ? "Edit Deck" : "Create New Deck"}</h1>
              <p className="text-muted-foreground">
                {isEditing
                  ? "Update your flashcard deck"
                  : "Create a new flashcard deck manually or with AI assistance"}
              </p>
            </div>
            <Button className="shadow-lg shadow-primary/20" onClick={handleSaveDeck} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isEditing ? "Update Deck" : "Save Deck"}
                </>
              )}
            </Button>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="md:col-span-1 overflow-hidden border-0 shadow-xl bg-gradient-to-br from-background to-background p-[1px]">
              <div className="bg-card rounded-[inherit] p-6">
                <CardHeader className="p-0 pb-6">
                  <CardTitle>Deck Details</CardTitle>
                  <CardDescription>Basic information about your flashcard deck</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-0">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">
                      Title
                    </label>
                    <Input
                      id="title"
                      placeholder="Enter deck title"
                      value={deckTitle}
                      onChange={(e) => setDeckTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">
                      Description
                    </label>
                    <Textarea
                      id="description"
                      placeholder="Enter deck description"
                      value={deckDescription}
                      onChange={(e) => setDeckDescription(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="tags" className="text-sm font-medium">
                      Tags
                    </label>
                    <Input
                      id="tags"
                      placeholder="Add tags (press Enter)"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 rounded-full hover:bg-secondary/80"
                          >
                            <X className="w-3 h-3" />
                            <span className="sr-only">Remove {tag}</span>
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>

            <div className="md:col-span-2">
              <Tabs defaultValue="manual" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="manual" className="data-[state=active]:shadow-md">
                    Manual Creation
                  </TabsTrigger>
                  <TabsTrigger value="ai" className="data-[state=active]:shadow-md">
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI Generation
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="manual" className="mt-0">
                  <Card className="border-0 shadow-xl bg-gradient-to-br from-background to-background p-[1px]">
                    <div className="bg-card rounded-[inherit] p-6">
                      <CardHeader className="p-0 pb-6">
                        <CardTitle>Create Flashcards</CardTitle>
                        <CardDescription>Add questions and answers for your flashcards</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6 p-0">
                        {flashcards.map((flashcard, index) => (
                          <div key={flashcard.id} className="p-4 border rounded-lg relative bg-background/50">
                            <button
                              type="button"
                              onClick={() => handleRemoveFlashcard(index)}
                              className="absolute top-2 right-2 p-1 rounded-full hover:bg-secondary"
                              disabled={flashcards.length === 1}
                            >
                              <X className="w-4 h-4" />
                              <span className="sr-only">Remove flashcard</span>
                            </button>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <label htmlFor={`question-${index}`} className="text-sm font-medium">
                                  Question
                                </label>
                                <Textarea
                                  id={`question-${index}`}
                                  placeholder="Enter question"
                                  value={flashcard.question}
                                  onChange={(e) => handleFlashcardChange(index, "question", e.target.value)}
                                  rows={2}
                                />
                              </div>
                              <div className="space-y-2">
                                <label htmlFor={`answer-${index}`} className="text-sm font-medium">
                                  Answer
                                </label>
                                <Textarea
                                  id={`answer-${index}`}
                                  placeholder="Enter answer"
                                  value={flashcard.answer}
                                  onChange={(e) => handleFlashcardChange(index, "answer", e.target.value)}
                                  rows={3}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                      <CardFooter className="pt-6 px-0 pb-0">
                        <Button variant="outline" onClick={handleAddFlashcard} className="w-full group">
                          <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-200" />
                          Add Flashcard
                        </Button>
                      </CardFooter>
                    </div>
                  </Card>
                </TabsContent>
                <TabsContent value="ai" className="mt-0">
                  <AIFlashcardGenerator onAddFlashcards={handleAddAIGeneratedFlashcards} />
                </TabsContent>
              </Tabs>

              {flashcards.length > 0 && flashcards.some((card) => card.question && card.answer) && (
                <div className="mt-8">
                  <h3 className="mb-4 text-xl font-medium">Preview</h3>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {flashcards
                      .filter((card) => card.question && card.answer)
                      .slice(0, 3)
                      .map((card) => (
                        <div key={card.id} className="h-[200px]">
                          <Flashcard question={card.question} answer={card.answer} compact />
                        </div>
                      ))}
                  </div>
                  {flashcards.filter((card) => card.question && card.answer).length > 3 && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      +{flashcards.filter((card) => card.question && card.answer).length - 3} more flashcards
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
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
