"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function Modal({ open, onClose, title, description, children, className }: ModalProps) {
  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (open) {
      document.addEventListener("keydown", handleKey)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleKey)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-200"
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className={cn(
          "relative z-10 w-full max-w-lg mx-4 bg-card rounded-2xl shadow-2xl border border-border/60",
          "animate-in fade-in-0 zoom-in-95 duration-200",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4">
          <div>
            {title && <h2 className="text-xl font-bold">{title}</h2>}
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0 -mt-1 -mr-1">
            <X size={18} />
          </Button>
        </div>
        {/* Body */}
        <div className="px-6 pb-6">{children}</div>
      </div>
    </div>
  )
}
