import { Moon, Sun } from "lucide-react"
import React from 'react'

const Nav = ({ toggleTheme , theme }) => {
  return (
    <div>
      <nav className="fixed top-0 left-0 w-full bg-background/80 backdrop-blur-md z-50 border-b border-muted shadow-sm transition-all duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <span className="text-2xl font-extrabold text-[var(--special)]" onClick={() => window.location.href = '/'}> Meta </span>
          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-muted text-foreground hover:bg-muted-foreground hover:text-background transition-colors shadow-sm"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </nav>
    </div>
  )
}

export default Nav