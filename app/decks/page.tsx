"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Search, Brain, Clock, Tag, Trash2, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DeckCard } from "@/components/deck-card"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { getDecks, deleteDeck} from "@/app/services/storage-service"
import {type DeckType } from "@/app/actions/gemini-actions"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Image from "next/image"
import { fromJSON } from "postcss"

export default function DecksPage() {
  const [decks, setDecks] = useState<DeckType[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"recent" | "alphabetical">("recent")
  const [deckToDelete, setDeckToDelete] = useState<string | null>(null)

  useEffect(() => {
    // Load decks from localStorage
    const loadedDecks = getDecks()
    setDecks(loadedDecks)
  }, [])

  // Get all unique tags from decks
  const allTags = Array.from(new Set(decks.flatMap((deck) => deck.tags)))

  // Filter decks based on search term and selected tag
  const filteredDecks = decks.filter((deck) => {
    const matchesSearch =
      searchTerm === "" ||
      deck.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deck.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTag = selectedTag === null || deck.tags.includes(selectedTag)

    return matchesSearch && matchesTag
  })

  // Sort decks
  const sortedDecks = [...filteredDecks].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    } else {
      return a.title.localeCompare(b.title)
    }
  })

  const handleDeleteDeck = (id: string) => {
    deleteDeck(id)
    setDecks(decks.filter((deck) => deck.id !== id))
    setDeckToDelete(null)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-background/50">
      <Navbar />

      <main className="flex-1">
        <div className="container px-4 py-8 mx-auto md:px-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Your Decks</h1>
              <p className="text-muted-foreground">Manage and study your flashcard decks</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search decks..."
                  className="pl-8 w-full sm:w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Link href="/create">
                <Button className="shadow-md shadow-primary/10">
                  <Plus className="w-4 h-4 mr-2" /> New Deck
                </Button>
              </Link>
            </div>
          </div>

          {/* Filters and View Options */}
          {decks.length > 0 && (
            <div className="flex flex-col gap-4 mt-8 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={selectedTag === null ? "default" : "outline"}
                  className="px-3 py-1 cursor-pointer"
                  onClick={() => setSelectedTag(null)}
                >
                  All
                </Badge>
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTag === tag ? "default" : "outline"}
                    className="px-3 py-1 cursor-pointer"
                    onClick={() => setSelectedTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <Button
                    variant={sortBy === "recent" ? "default" : "ghost"}
                    size="sm"
                    className="text-xs"
                    onClick={() => setSortBy("recent")}
                  >
                    <Clock className="w-3.5 h-3.5 mr-1" /> Recently Updated
                  </Button>
                  <Button
                    variant={sortBy === "alphabetical" ? "default" : "ghost"}
                    size="sm"
                    className="text-xs"
                    onClick={() => setSortBy("alphabetical")}
                  >
                    <Tag className="w-3.5 h-3.5 mr-1" /> Alphabetical
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Empty state */}
          {decks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="p-4 mb-4 bg-primary/10 rounded-full">
                <Layers className="w-10 h-10 text-primary" />
              </div>
              <h2 className="mb-2 text-xl font-semibold">No decks yet</h2>
              <p className="mb-6 text-muted-foreground text-center max-w-md">
                Create your first flashcard deck to start learning with spaced repetition.
              </p>
              <Link href="/create">
                <Button className="shadow-lg shadow-primary/20">
                  <Plus className="w-4 h-4 mr-2" /> Create Your First Deck
                </Button>
              </Link>
            </div>
          )}

          {/* Deck Grid */}
          {sortedDecks.length > 0 && (
            <div className="grid gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-3">
              {sortedDecks.map((deck) => (
                <div key={deck.id} className="relative group">
                  <DeckCard deck={deck} />
                  <AlertDialog open={deckToDelete === deck.id} onOpenChange={(open) => !open && setDeckToDelete(null)}>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setDeckToDelete(deck.id)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Deck</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{deck.title}"? This action cannot be undone and all
                          flashcards in this deck will be permanently deleted.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteDeck(deck.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          )}

          {/* No results */}
          {decks.length > 0 && sortedDecks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="p-4 mb-4 bg-primary/10 rounded-full">
                <Search className="w-10 h-10 text-primary" />
              </div>
              <h2 className="mb-2 text-xl font-semibold">No matching decks</h2>
              <p className="mb-6 text-muted-foreground text-center max-w-md">
                No decks match your current search or filter criteria. Try adjusting your search.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedTag(null)
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t">
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
