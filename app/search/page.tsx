"use client"

import { useState, useMemo } from "react"
import { Search, MapPin, SlidersHorizontal, Map, Grid3X3, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProviderCard } from "@/components/provider/provider-card"
import { ProviderCardSkeleton } from "@/components/ui/skeleton"
import { useFiltersStore } from "@/store/filters.store"
import { mockProviders } from "@/lib/mock-data"
import { ServiceType } from "@/types"
import { cn } from "@/lib/utils"

const SERVICE_TYPES: { value: ServiceType; label: string }[] = [
  { value: "VET", label: "Veterinary" },
  { value: "GROOMING", label: "Grooming" },
  { value: "BOARDING", label: "Boarding" },
  { value: "WALKING", label: "Dog Walking" },
  { value: "TRAINING", label: "Training" },
  { value: "INSURANCE", label: "Insurance" },
]

const SORT_OPTIONS = [
  { value: "rating", label: "Highest Rated" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "distance", label: "Distance" },
] as const

function MapPlaceholder() {
  return (
    <div className="w-full h-full min-h-[400px] rounded-2xl bg-gradient-to-br from-sky-100 to-blue-200 flex flex-col items-center justify-center border border-border/60">
      <Map size={48} className="text-sky-400 mb-3" />
      <p className="font-semibold text-sky-700">Map View</p>
      <p className="text-sm text-sky-600/70 mt-1">Google Maps integration goes here</p>
    </div>
  )
}

export default function SearchPage() {
  const { query, location, serviceType, minPrice, maxPrice, minRating, sortBy,
    setQuery, setLocation, setServiceType, setPriceRange, setMinRating, setSortBy, reset } = useFiltersStore()
  const [showMap, setShowMap] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [loading] = useState(false)

  const filtered = useMemo(() => {
    let providers = [...mockProviders]
    if (serviceType) providers = providers.filter((p) => p.services.some((s) => s.type === serviceType))
    if (query) providers = providers.filter((p) =>
      p.businessName.toLowerCase().includes(query.toLowerCase()) ||
      p.bio.toLowerCase().includes(query.toLowerCase())
    )
    if (minRating > 0) providers = providers.filter((p) => p.rating >= minRating)
    providers = providers.filter((p) => {
      const min = Math.min(...p.services.map((s) => s.price))
      return min >= minPrice && min <= maxPrice
    })
    if (sortBy === "rating") providers.sort((a, b) => b.rating - a.rating)
    if (sortBy === "price_asc") providers.sort((a, b) => Math.min(...a.services.map(s => s.price)) - Math.min(...b.services.map(s => s.price)))
    if (sortBy === "price_desc") providers.sort((a, b) => Math.min(...b.services.map(s => s.price)) - Math.min(...a.services.map(s => s.price)))
    return providers
  }, [query, serviceType, minPrice, maxPrice, minRating, sortBy])

  const hasFilters = serviceType || minRating > 0 || minPrice > 0 || maxPrice < 500

  return (
    <div className="min-h-screen bg-background">
      {/* Search Header */}
      <div className="border-b border-border/60 bg-muted/30 py-6">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col md:flex-row gap-3">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search services…"
              leftIcon={<Search size={16} />}
              className="max-w-xs"
            />
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, state or zip"
              leftIcon={<MapPin size={16} />}
              className="max-w-xs"
            />
            <div className="flex gap-2 ml-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="gap-2"
              >
                <SlidersHorizontal size={14} />
                Filters
                {hasFilters && <span className="h-2 w-2 rounded-full bg-primary" />}
              </Button>
              <Button
                variant={showMap ? "default" : "outline"}
                size="sm"
                onClick={() => setShowMap(!showMap)}
                className="gap-2"
              >
                {showMap ? <Grid3X3 size={14} /> : <Map size={14} />}
                {showMap ? "Grid" : "Map"}
              </Button>
            </div>
          </div>

          {/* Filters Panel */}
          {filtersOpen && (
            <div className="mt-4 p-5 rounded-2xl border border-border/60 bg-card grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in slide-in-from-top-2 duration-200">
              {/* Service type */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Service Type</p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setServiceType('')}
                    className={cn("px-3 py-1 rounded-full text-xs font-semibold border transition-colors",
                      serviceType === '' ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/40")}
                  >
                    All
                  </button>
                  {SERVICE_TYPES.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setServiceType(value)}
                      className={cn("px-3 py-1 rounded-full text-xs font-semibold border transition-colors",
                        serviceType === value ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/40")}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Price Range: ${minPrice} – ${maxPrice}
                </p>
                <input type="range" min={0} max={500} step={5} value={maxPrice}
                  onChange={(e) => setPriceRange(minPrice, Number(e.target.value))}
                  className="w-full accent-primary" />
              </div>

              {/* Rating */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Min Rating: {minRating > 0 ? `${minRating}★` : "Any"}
                </p>
                <div className="flex gap-1.5">
                  {[0, 3, 4, 4.5].map((r) => (
                    <button key={r}
                      onClick={() => setMinRating(r)}
                      className={cn("px-3 py-1 rounded-full text-xs font-semibold border transition-colors",
                        minRating === r ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/40")}
                    >
                      {r === 0 ? "All" : `${r}★`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Sort By</p>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full h-9 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {SORT_OPTIONS.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
                <Button variant="ghost" size="sm" onClick={reset} className="gap-1 text-muted-foreground">
                  <X size={12} /> Clear all filters
                </Button>
              </div>
            </div>
          )}

          {/* Active filter chips */}
          {serviceType && (
            <div className="flex gap-2 mt-3">
              <Badge variant="secondary" className="gap-1">
                {SERVICE_TYPES.find(s => s.value === serviceType)?.label}
                <button onClick={() => setServiceType('')}><X size={10} /></button>
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            <span className="font-bold text-foreground">{filtered.length}</span> providers found
          </p>
        </div>

        {showMap ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => <ProviderCardSkeleton key={i} />)
                : filtered.map((p) => <ProviderCard key={p.id} provider={p} />)}
            </div>
            <div className="sticky top-24"><MapPlaceholder /></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <ProviderCardSkeleton key={i} />)
              : filtered.length === 0
                ? (
                  <div className="col-span-full flex flex-col items-center justify-center py-24 text-muted-foreground">
                    <span className="text-6xl mb-4">🐾</span>
                    <p className="text-xl font-semibold mb-2">No providers found</p>
                    <p className="text-sm">Try adjusting your filters.</p>
                    <Button className="mt-4" onClick={reset}>Clear Filters</Button>
                  </div>
                )
                : filtered.map((p) => <ProviderCard key={p.id} provider={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}
