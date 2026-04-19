"use client"

import * as React from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingStarsProps {
  rating: number
  max?: number
  size?: number
  className?: string
  showValue?: boolean
}

export function RatingStars({ rating, max = 5, size = 16, className, showValue = false }: RatingStarsProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.floor(rating)
        const partial = !filled && i < rating

        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star
              size={size}
              className="text-muted-foreground/30"
              fill="transparent"
            />
            {(filled || partial) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: partial ? `${(rating % 1) * 100}%` : "100%" }}
              >
                <Star size={size} className="text-amber-400 fill-amber-400" />
              </span>
            )}
          </span>
        )
      })}
      {showValue && (
        <span className="text-sm font-semibold text-foreground ml-1">{rating.toFixed(1)}</span>
      )}
    </div>
  )
}
