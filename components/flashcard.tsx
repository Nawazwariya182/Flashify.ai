"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface FlashcardProps {
  question: string
  answer: string
  compact?: boolean
}

export function Flashcard({ question, answer, compact = false }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  const toggleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  return (
    <div className={`relative w-full ${compact ? "h-full" : "h-[350px] max-w-xl mx-auto"}`}>
      <div className="w-full h-full perspective" style={{ perspective: "1000px" }} onClick={toggleFlip}>
        <motion.div
          className="relative w-full h-full"
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 300, damping: 30 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front of card (Question) */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 border rounded-xl shadow-lg backface-hidden ${
              compact ? "p-4" : "p-6"
            }`}
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-primary/10 rounded-t-xl"></div>
            <div className="flex-1 flex items-center justify-center">
              <p className={`font-medium ${compact ? "text-sm" : "text-xl"}`}>{question}</p>
            </div>
            <Button
              variant="ghost"
              size={compact ? "sm" : "default"}
              className="mt-4 group"
              onClick={(e) => {
                e.stopPropagation()
                toggleFlip()
              }}
            >
              Flip Card
              <svg
                className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:rotate-180"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 3L21 7L17 11" />
                <path d="M21 7H9" />
                <path d="M7 21L3 17L7 13" />
                <path d="M3 17H15" />
              </svg>
            </Button>
          </div>

          {/* Back of card (Answer) */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 border rounded-xl shadow-lg backface-hidden ${
              compact ? "p-4" : "p-6"
            }`}
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-primary/10 rounded-t-xl"></div>
            <div className="flex-1 flex items-center justify-center overflow-auto">
              <p className={`${compact ? "text-sm" : "text-base"}`}>{answer}</p>
            </div>
            <Button
              variant="ghost"
              size={compact ? "sm" : "default"}
              className="mt-4 group"
              onClick={(e) => {
                e.stopPropagation()
                toggleFlip()
              }}
            >
              Flip Card
              <svg
                className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:rotate-180"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 3L21 7L17 11" />
                <path d="M21 7H9" />
                <path d="M7 21L3 17L7 13" />
                <path d="M3 17H15" />
              </svg>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
