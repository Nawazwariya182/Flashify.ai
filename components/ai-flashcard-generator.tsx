"use client"

import { useState } from "react"
import { Sparkles, Loader2, FileText, BookOpen } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  generateFlashcardsFromTopic,
  generateFlashcardsFromText,
  type FlashcardType,
} from "@/app/actions/gemini-actions"
import { toast } from "@/components/ui/use-toast"

interface AIFlashcardGeneratorProps {
  onAddFlashcards: (flashcards: FlashcardType[]) => void
}

export function AIFlashcardGenerator({ onAddFlashcards }: AIFlashcardGeneratorProps) {
  const [generationType, setGenerationType] = useState<"topic" | "text">("topic")
  const [topicInput, setTopicInput] = useState("")
  const [textInput, setTextInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedFlashcards, setGeneratedFlashcards] = useState<FlashcardType[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    const input = generationType === "topic" ? topicInput : textInput

    if (!input.trim()) {
      toast({
        title: "Input required",
        description: `Please enter a ${generationType} to generate flashcards.`,
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    setGeneratedFlashcards([])
    setError(null)

    try {
      let flashcards: FlashcardType[]

      if (generationType === "topic") {
        flashcards = await generateFlashcardsFromTopic(input.trim())
      } else {
        flashcards = await generateFlashcardsFromText(input.trim())
      }

      setGeneratedFlashcards(flashcards)

      toast({
        title: "Flashcards generated",
        description: `Successfully generated ${flashcards.length} flashcards.`,
      })
    } catch (error) {
      console.error("Error generating flashcards:", error)
      setError("Failed to generate flashcards. Please try again.")

      toast({
        title: "Generation failed",
        description: "There was an error generating flashcards. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAddToCollection = () => {
    if (generatedFlashcards.length > 0) {
      onAddFlashcards(generatedFlashcards)
      setGeneratedFlashcards([])
      setTopicInput("")
      setTextInput("")

      toast({
        title: "Flashcards added",
        description: `Added ${generatedFlashcards.length} flashcards to your collection.`,
      })
    }
  }

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-background to-background p-[1px]">
      <div className="bg-card rounded-[inherit] p-6">
        <CardHeader className="p-0 pb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <CardTitle>AI Flashcard Generator</CardTitle>
          </div>
          <CardDescription>Let Gemini AI create flashcards from a topic or text</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={generationType} onValueChange={(value) => setGenerationType(value as "topic" | "text")}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="topic" className="data-[state=active]:shadow-md">
                <BookOpen className="w-4 h-4 mr-2" />
                From Topic
              </TabsTrigger>
              <TabsTrigger value="text" className="data-[state=active]:shadow-md">
                <FileText className="w-4 h-4 mr-2" />
                From Text
              </TabsTrigger>
            </TabsList>
            <TabsContent value="topic" className="mt-0 space-y-4">
              <div className="space-y-2">
                <label htmlFor="topic" className="text-sm font-medium">
                  Enter a Topic
                </label>
                <Input
                  id="topic"
                  placeholder="e.g., Photosynthesis, Machine Learning, World War II"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  The AI will generate comprehensive flashcards about this topic
                </p>
              </div>
            </TabsContent>
            <TabsContent value="text" className="mt-0 space-y-4">
              <div className="space-y-2">
                <label htmlFor="text" className="text-sm font-medium">
                  Paste Text or Article
                </label>
                <Textarea
                  id="text"
                  placeholder="Paste an article, notes, or any text you want to convert to flashcards..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  rows={6}
                />
                <p className="text-xs text-muted-foreground">
                  The AI will extract key concepts and create flashcards from this text
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || (generationType === "topic" ? !topicInput.trim() : !textInput.trim())}
            className="w-full mt-4 shadow-md shadow-primary/10"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Flashcards
              </>
            )}
          </Button>

          {error && <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm">{error}</div>}
        </CardContent>

        {generatedFlashcards.length > 0 && (
          <CardFooter className="flex-col p-0 mt-8">
            <div className="w-full border-t pt-6">
              <h3 className="mb-4 text-lg font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Generated Flashcards
              </h3>
              <div className="grid gap-4 mb-6">
                {generatedFlashcards.map((card) => (
                  <div key={card.id} className="p-4 border rounded-lg bg-background/50">
                    <div className="mb-2 font-medium">Q: {card.question}</div>
                    <div className="text-sm text-muted-foreground">A: {card.answer}</div>
                  </div>
                ))}
              </div>
              <Button onClick={handleAddToCollection} className="w-full shadow-md shadow-primary/10">
                Add to Collection
              </Button>
            </div>
          </CardFooter>
        )}
      </div>
    </Card>
  )
}
