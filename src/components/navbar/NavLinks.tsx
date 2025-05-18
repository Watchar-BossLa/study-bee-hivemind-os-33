import React from "react"
import { Link } from "react-router-dom"

export function NavLinks() {
  return (
    <nav className="flex items-center gap-6 text-sm">
      <Link to="/" className="transition-colors hover:text-foreground/80 text-foreground/70">
        Home
      </Link>
      <Link to="/dashboard" className="transition-colors hover:text-foreground/80 text-foreground/70">
        Dashboard
      </Link>
      <Link to="/courses" className="transition-colors hover:text-foreground/80 text-foreground/70">
        Courses
      </Link>
      <Link to="/flashcards" className="transition-colors hover:text-foreground/80 text-foreground/70">
        Flashcards
      </Link>
      <Link to="/qualifications" className="transition-colors hover:text-foreground/80 text-foreground/70">
        Qualifications
      </Link>
      <Link to="/arena" className="transition-colors hover:text-foreground/80 text-foreground/70">
        Arena
      </Link>
      <Link to="/tutor" className="transition-colors hover:text-foreground/80 text-foreground/70">
        AI Tutor
      </Link>
    </nav>
  );
}
