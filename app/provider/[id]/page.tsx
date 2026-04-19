import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import {
  MapPin, Star, Phone, Globe, Clock, CheckCircle2,
  ChevronRight, Shield, Users, Award, Calendar
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RatingStars } from "@/components/ui/rating-stars"
import { mockProviders, mockReviews } from "@/lib/mock-data"

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const provider = mockProviders.find((p) => p.id === params.id)
  if (!provider) return { title: "Provider Not Found | PetoPhilia" }
  return {
    title: `${provider.businessName} | PetoPhilia`,
    description: provider.bio,
  }
}

export function generateStaticParams() {
  return mockProviders.map((p) => ({ id: p.id }))
}

function AvailabilityCalendar() {
  const today = new Date()
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    return d
  })

  return (
    <div>
      <p className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
        Next 14 days
      </p>
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((day, i) => {
          const isAvailable = i % 3 !== 0
          return (
            <button
              key={i}
              disabled={!isAvailable}
              className={`flex flex-col items-center py-2 px-1 rounded-xl text-xs font-semibold transition-all duration-150 ${
                isAvailable
                  ? "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground cursor-pointer"
                  : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
              }`}
            >
              <span className="text-[10px] opacity-70">
                {day.toLocaleDateString("en-US", { weekday: "short" })}
              </span>
              <span className="text-sm">{day.getDate()}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function ProviderProfilePage({ params }: Props) {
  const provider = mockProviders.find((p) => p.id === params.id)
  if (!provider) notFound()

  const reviews = mockReviews.filter((r) => r.providerId === params.id)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <div className="relative h-64 lg:h-80 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 overflow-hidden">
        {provider.imageUrl && (
          <img
            src={provider.imageUrl}
            alt={provider.businessName}
            className="w-full h-full object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="container mx-auto max-w-7xl px-4">
        {/* Provider Header Card */}
        <div className="relative -mt-20 mb-8">
          <Card className="shadow-2xl">
            <CardContent className="p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Avatar */}
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/40 border-4 border-background shadow-xl text-4xl">
                  🐾
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h1 className="text-2xl lg:text-3xl font-black">{provider.businessName}</h1>
                      <div className="flex items-center gap-2 mt-1 text-muted-foreground text-sm">
                        <MapPin size={14} />
                        <span>{provider.location.address}, {provider.location.city}, {provider.location.state}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <RatingStars rating={provider.rating} showValue />
                        <span className="text-sm text-muted-foreground">({provider.reviewsCount} reviews)</span>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="success" className="gap-1">
                          <CheckCircle2 size={10} /> Verified
                        </Badge>
                        <Badge variant="info" className="gap-1">
                          <Shield size={10} /> Insured
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground leading-relaxed mt-4 max-w-2xl">{provider.bio}</p>

                  <div className="flex flex-wrap gap-6 mt-5 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                        <Award size={14} />
                      </div>
                      <div>
                        <p className="font-bold">{provider.rating.toFixed(1)}</p>
                        <p className="text-muted-foreground text-xs">Avg. Rating</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                        <Users size={14} />
                      </div>
                      <div>
                        <p className="font-bold">{provider.reviewsCount}</p>
                        <p className="text-muted-foreground text-xs">Reviews</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
                        <Clock size={14} />
                      </div>
                      <div>
                        <p className="font-bold">&lt; 1hr</p>
                        <p className="text-muted-foreground text-xs">Avg. Response</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle>Services Offered</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {provider.services.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-border/60 hover:border-primary/30 hover:bg-primary/5 transition-colors group"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{service.title}</p>
                        <Badge variant="secondary" className="text-[10px]">{service.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{service.description}</p>
                      {service.durationMinutes > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          <Clock size={10} className="inline mr-1" />
                          {service.durationMinutes >= 60
                            ? `${service.durationMinutes / 60}h`
                            : `${service.durationMinutes}min`}
                        </p>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-xl font-black text-primary">
                        ${service.price}
                        {service.durationMinutes === 1440 && <span className="text-xs font-normal text-muted-foreground">/night</span>}
                        {service.durationMinutes === 0 && <span className="text-xs font-normal text-muted-foreground">/mo</span>}
                      </p>
                      <Link href={`/booking/${provider.id}?service=${service.id}`}>
                        <Button size="sm" className="mt-2 gap-1 group-hover:bg-primary">
                          Book <ChevronRight size={12} />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Reviews</CardTitle>
                  <div className="flex items-center gap-2">
                    <RatingStars rating={provider.rating} />
                    <span className="font-bold">{provider.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground text-sm">({provider.reviewsCount})</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-6">No reviews yet.</p>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="border-b border-border/60 last:border-none pb-4 last:pb-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                            {review.userId.charAt(1).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold">Verified Customer</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </p>
                          </div>
                        </div>
                        <RatingStars rating={review.rating} size={13} />
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Book Now card */}
            <Card className="border-primary/30 shadow-lg shadow-primary/10">
              <CardContent className="p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Starting from</p>
                <p className="text-4xl font-black text-primary mb-4">
                  ${Math.min(...provider.services.map((s) => s.price))}
                </p>
                <Link href={`/booking/${provider.id}`} className="block">
                  <Button size="lg" className="w-full">
                    <Calendar size={16} />
                    Book Now
                  </Button>
                </Link>
                <p className="text-xs text-muted-foreground text-center mt-3">
                  Free cancellation up to 24h before
                </p>
              </CardContent>
            </Card>

            {/* Availability */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <AvailabilityCalendar />
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl bg-gradient-to-br from-sky-100 to-blue-200 h-32 flex items-center justify-center mb-3">
                  <MapPin size={24} className="text-sky-500" />
                </div>
                <p className="text-sm font-medium">{provider.location.address}</p>
                <p className="text-sm text-muted-foreground">{provider.location.city}, {provider.location.state} {provider.location.zip}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
