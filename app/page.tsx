import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Brain, BarChart3, Layers, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-background/50">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto md:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full blur-md bg-primary/50"></div>
              <Image
                src="/logo.svg"
                alt="Flashify.ai Logo"
                width={32}
                height={32}
                className="relative w-8 h-8"
              />
            </div>
            <span className="text-xl font-bold">Flashify.ai</span>
          </Link>
          <nav className="hidden space-x-6 md:flex">
            <Link href="/decks" className="text-sm font-medium transition-colors hover:text-primary">
              Decks
            </Link>
            <Link href="/create" className="text-sm font-medium transition-colors hover:text-primary">
              Create
            </Link>
            <Link href="/stats" className="text-sm font-medium transition-colors hover:text-primary">
              Stats
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/decks">
              <Button className="shadow-lg shadow-primary/20">Start Learning</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section with Parallax Effect */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-70"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-70"></div>
        </div>
        <div className="container relative px-4 py-20 mx-auto md:py-32 md:px-6">
          <div className="grid gap-12 md:grid-cols-2">
            <div className="flex flex-col justify-center space-y-6">
              <div className="inline-block px-3 py-1 text-sm font-medium text-primary bg-primary/10 rounded-full">
                Powered by Gemini AI
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Master Any Subject with <span className="text-primary">Smart Flashcards</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Flashify.ai combines spaced repetition science with AI to help you learn faster and remember longer.
                Create flashcards manually or let AI generate them from any topic or text.
              </p>
              <div className="flex flex-col gap-3 min-[400px]:flex-row">
                <Link href="/create">
                  <Button size="lg" className="w-full min-[400px]:w-auto shadow-lg shadow-primary/20">
                    Create Flashcards <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/decks">
                  <Button size="lg" variant="outline" className="w-full min-[400px]:w-auto">
                    Browse Decks
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-md perspective" style={{ perspective: "1000px" }}>
                {/* Glassmorphism card effect */}
                <div className="relative p-1 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 shadow-xl">
                  <div className="backdrop-blur-md bg-white/80 dark:bg-gray-950/80 rounded-lg overflow-hidden p-6 border border-white/20 dark:border-gray-800/30">
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-lg font-semibold">Biology Basics</div>
                      <div className="px-2 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full">
                        Example
                      </div>
                    </div>
                    <div className="relative h-48 p-6 mb-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg flex items-center justify-center shadow-inner">
                      <div className="text-center">
                        <div className="mb-3 text-lg font-medium">What is photosynthesis?</div>
                        <Button variant="ghost" size="sm" className="group">
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
                    </div>
                    <div className="flex justify-between gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-900 dark:hover:bg-red-950 dark:hover:text-red-400"
                      >
                        Hard
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-yellow-200 hover:bg-yellow-50 hover:text-yellow-600 dark:border-yellow-900 dark:hover:bg-yellow-950 dark:hover:text-yellow-400"
                      >
                        Medium
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-green-200 hover:bg-green-50 hover:text-green-600 dark:border-green-900 dark:hover:bg-green-950 dark:hover:text-green-400"
                      >
                        Easy
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Bento Grid */}
      <section className="container px-4 py-20 mx-auto md:py-32 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Supercharge Your <span className="text-primary">Learning</span>
          </h2>
          <p className="mx-auto mt-4 text-xl text-muted-foreground max-w-[700px]">
            Everything you need to learn effectively and efficiently
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:grid-rows-2">
          <div className="p-8 bg-white rounded-xl shadow-lg dark:bg-gray-950 dark:border dark:border-gray-800 md:row-span-2 flex flex-col justify-between">
            <div>
              <div className="p-3 mb-6 bg-primary/10 w-fit rounded-lg">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">AI-Powered Generation</h3>
              <p className="mt-4 text-muted-foreground">
                Generate flashcards instantly from topics, articles, or notes using Gemini AI. Our advanced AI
                understands context and creates perfect question-answer pairs.
              </p>
            </div>
            <div className="mt-6">
              <Link href="/create">
                <Button variant="outline" className="group">
                  Try AI Generation
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="p-8 bg-white rounded-xl shadow-lg dark:bg-gray-950 dark:border dark:border-gray-800">
            <div className="p-3 mb-6 bg-primary/10 w-fit rounded-lg">
              <Image
                src="/logo.svg"
                alt="Flashify.ai Logo"
                width={32}
                height={32}
                className="relative w-8 h-8"
              />
            </div>
            <h3 className="text-2xl font-bold">Spaced Repetition</h3>
            <p className="mt-4 text-muted-foreground">
              Review cards at optimal intervals based on your performance to maximize retention and minimize forgetting.
            </p>
          </div>

          <div className="p-8 bg-white rounded-xl shadow-lg dark:bg-gray-950 dark:border dark:border-gray-800">
            <div className="p-3 mb-6 bg-primary/10 w-fit rounded-lg">
              <BarChart3 className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">Learning Analytics</h3>
            <p className="mt-4 text-muted-foreground">
              Track your progress with detailed statistics and visualizations to optimize your study habits.
            </p>
          </div>

          <div className="p-8 bg-white rounded-xl shadow-lg dark:bg-gray-950 dark:border dark:border-gray-800 md:col-span-2">
            <div className="p-3 mb-6 bg-primary/10 w-fit rounded-lg">
              <Layers className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">Organized Decks</h3>
            <p className="mt-4 text-muted-foreground">
              Create and organize flashcards into decks with tags and descriptions. Keep your learning materials
              structured and easily accessible.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-b from-background/50 to-background md:py-32">
        <div className="container px-4 mx-auto md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              How <span className="text-primary">Flashify.ai</span> Works
            </h2>
            <p className="mx-auto mt-4 text-xl text-muted-foreground max-w-[700px]">
              A simple process to supercharge your learning journey
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-16 h-16 mb-6 text-2xl font-bold text-white bg-primary rounded-full">
                1
              </div>
              <h3 className="mb-3 text-xl font-bold">Create or Generate</h3>
              <p className="text-muted-foreground">
                Create flashcards manually or use our AI to generate them from topics or text.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-16 h-16 mb-6 text-2xl font-bold text-white bg-primary rounded-full">
                2
              </div>
              <h3 className="mb-3 text-xl font-bold">Study and Rate</h3>
              <p className="text-muted-foreground">
                Review your flashcards and rate them based on difficulty to optimize your learning.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-16 h-16 mb-6 text-2xl font-bold text-white bg-primary rounded-full">
                3
              </div>
              <h3 className="mb-3 text-xl font-bold">Track Progress</h3>
              <p className="text-muted-foreground">
                Monitor your learning progress with detailed analytics and visualizations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container px-4 py-20 mx-auto md:py-32 md:px-6">
        <div className="relative p-1 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/5 to-secondary/20">
          <div className="p-8 backdrop-blur-md bg-white/80 dark:bg-gray-950/80 rounded-xl border border-white/20 dark:border-gray-800/30 md:p-12">
            <div className="grid gap-6 md:grid-cols-2 md:gap-12">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Ready to transform your learning experience?
                </h2>
                <p className="mt-4 text-xl text-muted-foreground">
                  Start creating your own flashcards with AI assistance and improve your knowledge retention.
                </p>
              </div>
              <div className="flex flex-col items-start justify-center gap-4">
                <Link href="/create">
                  <Button size="lg" className="shadow-lg shadow-primary/20">
                    Get Started Now
                  </Button>
                </Link>
                <p className="text-sm text-muted-foreground">
                  No account required. Start creating flashcards in minutes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

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
