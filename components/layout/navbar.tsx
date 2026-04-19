"use client"

import Link from "next/link"
import { useState } from "react"
import { PawPrint, Menu, X, Bell, User, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "Find Services", href: "/search" },
  { label: "For Providers", href: "/provider-dashboard" },
] as const

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-md shadow-primary/30 transition-transform group-hover:scale-105">
            <PawPrint size={18} className="text-primary-foreground" />
          </div>
          <span className="text-xl font-black tracking-tight">
            Peto<span className="text-primary">Philia</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-150"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="icon">
            <Bell size={18} />
          </Button>
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="gap-2">
              <User size={14} />
              Dashboard
            </Button>
          </Link>
          <Button size="sm">Get Started</Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden border-t border-border/60 bg-background overflow-hidden transition-all duration-300",
          mobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="container mx-auto max-w-7xl px-4 py-4 flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 text-sm font-medium rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-2">
            <Link href="/dashboard" className="flex-1">
              <Button variant="outline" size="sm" className="w-full">Dashboard</Button>
            </Link>
            <Button size="sm" className="flex-1">Get Started</Button>
          </div>
        </nav>
      </div>
    </header>
  )
}
