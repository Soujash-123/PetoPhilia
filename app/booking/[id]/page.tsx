"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { notFound } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Calendar, Clock, CheckCircle2, ChevronRight, CreditCard,
  PawPrint, AlertCircle, User, ArrowLeft
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockProviders } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const petDetailsSchema = z.object({
  petName: z.string().min(1, "Pet name is required"),
  species: z.string().min(1, "Species is required"),
  breed: z.string().optional(),
  age: z.coerce.number().min(0).max(30).optional(),
  notes: z.string().max(500).optional(),
})

type PetDetailsForm = z.infer<typeof petDetailsSchema>

const AVAILABLE_TIMES = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"]

const steps = ["Service", "Date & Time", "Pet Details", "Payment", "Confirm"]

interface Props {
  params: { id: string }
}

export default function BookingPage({ params }: Props) {
  const searchParams = useSearchParams()
  const provider = mockProviders.find((p) => p.id === params.id)
  if (!provider) notFound()

  const preselectedServiceId = searchParams.get("service")
  const [step, setStep] = useState(0)
  const [selectedService, setSelectedService] = useState(
    preselectedServiceId
      ? provider.services.find((s) => s.id === preselectedServiceId) ?? provider.services[0]
      : provider.services[0]
  )
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [confirmed, setConfirmed] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<PetDetailsForm>({
    resolver: zodResolver(petDetailsSchema),
  })

  const totalDays = selectedService.durationMinutes === 1440 ? 1 : 1
  const total = selectedService.price * totalDays

  // Generate next 14 days
  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i + 1)
    return d.toISOString().split("T")[0]
  }).filter((_, i) => i % 3 !== 0)

  const canProceed =
    (step === 0 && selectedService) ||
    (step === 1 && selectedDate && selectedTime) ||
    step === 2 ||
    step === 3

  const onPetSubmit = () => setStep(3)
  const handlePayment = () => setStep(4)
  const handleConfirm = () => setConfirmed(true)

  if (confirmed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 mx-auto mb-6">
            <CheckCircle2 size={40} className="text-emerald-500" />
          </div>
          <h1 className="text-3xl font-black mb-2">Booking Confirmed!</h1>
          <p className="text-muted-foreground mb-6">
            Your appointment with <strong>{provider.businessName}</strong> for{" "}
            <strong>{selectedService.title}</strong> on{" "}
            <strong>{new Date(selectedDate).toLocaleDateString("en-US", { month: "long", day: "numeric" })}</strong> at{" "}
            <strong>{selectedTime}</strong> has been confirmed.
          </p>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 mb-6 text-sm text-emerald-800">
            A confirmation email has been sent to your inbox.
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard" className="flex-1">
              <Button className="w-full">Go to Dashboard</Button>
            </Link>
            <Link href="/search" className="flex-1">
              <Button variant="outline" className="w-full">Browse More</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto max-w-6xl px-4 py-10">
        {/* Back */}
        <Link href={`/provider/${provider.id}`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft size={14} /> Back to provider
        </Link>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => i < step && setStep(i)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all",
                  i === step ? "bg-primary text-primary-foreground shadow-md shadow-primary/30" :
                  i < step ? "bg-emerald-100 text-emerald-700 cursor-pointer hover:bg-emerald-200" :
                  "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                {i < step ? <CheckCircle2 size={14} /> : <span>{i + 1}</span>}
                {s}
              </button>
              {i < steps.length - 1 && (
                <ChevronRight size={14} className="text-muted-foreground shrink-0" />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 0 – Service Selection */}
            {step === 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Select a Service</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {provider.services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => setSelectedService(service)}
                      className={cn(
                        "w-full flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all duration-150",
                        selectedService.id === service.id
                          ? "border-primary bg-primary/5 shadow-sm shadow-primary/10"
                          : "border-border hover:border-primary/40"
                      )}
                    >
                      <div>
                        <p className="font-semibold">{service.title}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">{service.description}</p>
                        {service.durationMinutes > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            <Clock size={10} className="inline mr-1" />
                            {service.durationMinutes >= 60 ? `${service.durationMinutes / 60}h` : `${service.durationMinutes}min`}
                          </p>
                        )}
                      </div>
                      <div className="ml-4 text-right shrink-0">
                        <p className="text-xl font-black text-primary">${service.price}</p>
                        {selectedService.id === service.id && (
                          <CheckCircle2 size={16} className="text-primary ml-auto mt-1" />
                        )}
                      </div>
                    </button>
                  ))}
                  <Button className="w-full mt-2" onClick={() => setStep(1)}>
                    Continue <ChevronRight size={14} />
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 1 – Date & Time */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Select Date & Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Available Dates</p>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-6">
                    {availableDates.map((date) => (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={cn(
                          "flex flex-col items-center py-2.5 rounded-xl border-2 text-xs font-semibold transition-all",
                          selectedDate === date
                            ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/30"
                            : "border-border hover:border-primary/40"
                        )}
                      >
                        <span className="opacity-70">{new Date(date).toLocaleDateString("en-US", { weekday: "short" })}</span>
                        <span className="text-base font-black mt-0.5">{new Date(date).getDate()}</span>
                        <span className="opacity-70">{new Date(date).toLocaleDateString("en-US", { month: "short" })}</span>
                      </button>
                    ))}
                  </div>

                  {selectedDate && (
                    <>
                      <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Available Times</p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {AVAILABLE_TIMES.map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={cn(
                              "px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all",
                              selectedTime === time
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border hover:border-primary/40"
                            )}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </>
                  )}

                  <Button
                    className="w-full"
                    disabled={!selectedDate || !selectedTime}
                    onClick={() => setStep(2)}
                  >
                    Continue <ChevronRight size={14} />
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 2 – Pet Details */}
            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Pet Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onPetSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Pet Name *</label>
                        <Input {...register("petName")} placeholder="e.g. Buddy" leftIcon={<PawPrint size={14} />} />
                        {errors.petName && <p className="text-xs text-destructive mt-1">{errors.petName.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Species *</label>
                        <select {...register("species")} className="flex h-10 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                          <option value="">Select species</option>
                          <option>Dog</option>
                          <option>Cat</option>
                          <option>Bird</option>
                          <option>Rabbit</option>
                          <option>Other</option>
                        </select>
                        {errors.species && <p className="text-xs text-destructive mt-1">{errors.species.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Breed</label>
                        <Input {...register("breed")} placeholder="e.g. Golden Retriever" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Age (years)</label>
                        <Input {...register("age")} type="number" min={0} placeholder="e.g. 3" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Special Notes</label>
                      <textarea
                        {...register("notes")}
                        rows={3}
                        placeholder="Allergies, behaviour, special needs…"
                        className="flex w-full rounded-xl border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Continue <ChevronRight size={14} />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Step 3 – Payment */}
            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard size={18} /> Payment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 flex gap-2">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    This is a demo. No real payment will be processed.
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Card Number</label>
                    <Input placeholder="4242 4242 4242 4242" leftIcon={<CreditCard size={14} />} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Expiry</label>
                      <Input placeholder="MM / YY" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">CVC</label>
                      <Input placeholder="•••" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Name on Card</label>
                    <Input placeholder="John Smith" leftIcon={<User size={14} />} />
                  </div>
                  <Button className="w-full" size="lg" onClick={handlePayment}>
                    Pay ${total.toFixed(2)} <ChevronRight size={14} />
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 4 – Confirm */}
            {step === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-500" /> Confirm Booking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-2xl border border-border/60 bg-muted/30 p-5 space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Provider</span>
                      <span className="font-semibold">{provider.businessName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Service</span>
                      <span className="font-semibold">{selectedService.title}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Date</span>
                      <span className="font-semibold">{new Date(selectedDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Time</span>
                      <span className="font-semibold">{selectedTime}</span>
                    </div>
                    <div className="border-t border-border/60 pt-3 flex justify-between">
                      <span className="font-bold">Total</span>
                      <span className="text-xl font-black text-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>
                  <Button className="w-full" size="lg" onClick={handleConfirm}>
                    <CheckCircle2 size={16} /> Confirm Booking
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar Summary */}
          <div className="space-y-4">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-base">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Provider</span>
                  <span className="font-semibold truncate max-w-32">{provider.businessName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service</span>
                  <span className="font-semibold">{selectedService.title}</span>
                </div>
                {selectedDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-semibold">
                      {new Date(selectedDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                )}
                {selectedTime && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time</span>
                    <span className="font-semibold">{selectedTime}</span>
                  </div>
                )}
                <div className="border-t border-border pt-3 flex justify-between items-center">
                  <span className="font-bold">Total</span>
                  <span className="text-2xl font-black text-primary">${total.toFixed(2)}</span>
                </div>
                <Badge variant="success" className="w-full justify-center">
                  <CheckCircle2 size={10} className="mr-1" /> Free cancellation up to 24h before
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
