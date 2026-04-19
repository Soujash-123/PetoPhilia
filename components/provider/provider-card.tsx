"use client"

import Link from "next/link"
import Image from "next/image"
import { MapPin, Star, Clock, ChevronRight } from "lucide-react"
import { Provider } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RatingStars } from "@/components/ui/rating-stars"
import { cn } from "@/lib/utils"

const serviceTypeColors: Record<string, string> = {
  VET: "info",
  GROOMING: "success",
  BOARDING: "warning",
  WALKING: "secondary",
  TRAINING: "default",
  INSURANCE: "outline",
}

interface ProviderCardProps {
  provider: Provider
  className?: string
}

export function ProviderCard({ provider, className }: ProviderCardProps) {
  const uniqueTypes = [...new Set(provider.services.map((s) => s.type))]
  const minPrice = Math.min(...provider.services.map((s) => s.price))

  return (
    <div
      className={cn(
        "group relative rounded-2xl border border-border/60 bg-card overflow-hidden",
        "shadow-sm hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1",
        "transition-all duration-300 cursor-pointer",
        className
      )}
    >
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        {provider.imageUrl ? (
          <img
            src={provider.imageUrl}
            alt={provider.businessName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/20">
            <span className="text-5xl">🐾</span>
          </div>
        )}
        {/* Rating badge overlay */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1">
          <Star size={12} className="text-amber-400 fill-amber-400" />
          <span className="text-xs font-bold text-white">{provider.rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {uniqueTypes.map((type) => (
            <Badge
              key={type}
              variant={(serviceTypeColors[type] as any) ?? "default"}
              className="text-[10px] uppercase tracking-wide"
            >
              {type}
            </Badge>
          ))}
        </div>

        <h3 className="font-bold text-base leading-tight mb-1 group-hover:text-primary transition-colors">
          {provider.businessName}
        </h3>

        <div className="flex items-center gap-1 text-muted-foreground text-xs mb-2">
          <MapPin size={12} />
          <span>{provider.location.city}, {provider.location.state}</span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
          {provider.bio}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <RatingStars rating={provider.rating} size={14} />
            <p className="text-xs text-muted-foreground mt-0.5">
              {provider.reviewsCount} reviews
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Starting at</p>
            <p className="text-lg font-black text-primary">${minPrice}</p>
          </div>
        </div>

        <Link href={`/provider/${provider.id}`} className="block mt-4">
          <Button className="w-full group/btn" size="sm">
            View Profile
            <ChevronRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
