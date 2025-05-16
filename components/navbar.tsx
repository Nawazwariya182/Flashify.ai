import Link from "next/link"
import { Brain } from "lucide-react"
import Image from "next/image"

export function Navbar() {
  return (
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
      </div>
    </header>
  )
}
