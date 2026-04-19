"use client"

import { useState } from "react"
import Link from "next/link"
import {
  LayoutDashboard, Calendar, Clock, Heart, PawPrint, Settings,
  Plus, Pencil, Trash2, ChevronRight, LogOut, User, Star
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Modal } from "@/components/ui/modal"
import { BookingCard } from "@/components/booking/booking-card"
import { ProviderCard } from "@/components/provider/provider-card"
import { mockBookings, mockPets, mockProviders } from "@/lib/mock-data"
import { Pet } from "@/types"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

// ─── Pet form schema ──────────────────────────────────────────────────────────

const petSchema = z.object({
  name: z.string().min(1, "Name is required"),
  species: z.string().min(1, "Species is required"),
  breed: z.string().optional(),
  age: z.coerce.number().min(0).max(30).optional(),
  weight: z.coerce.number().min(0).optional(),
  notes: z.string().max(500).optional(),
})
type PetForm = z.infer<typeof petSchema>

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "upcoming", label: "Upcoming Bookings", icon: Calendar },
  { id: "history", label: "Past Bookings", icon: Clock },
  { id: "saved", label: "Saved Providers", icon: Heart },
  { id: "pets", label: "My Pets", icon: PawPrint },
  { id: "settings", label: "Settings", icon: Settings },
] as const

type NavId = typeof navItems[number]["id"]

// ─── Mock saved providers ─────────────────────────────────────────────────────
const savedProviders = mockProviders.slice(0, 3)

// ─── Component ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<NavId>("overview")
  const [pets, setPets] = useState<Pet[]>(mockPets)
  const [petModalOpen, setPetModalOpen] = useState(false)
  const [editingPet, setEditingPet] = useState<Pet | null>(null)

  const upcoming = mockBookings.filter((b) => b.status === "CONFIRMED" || b.status === "PENDING")
  const past = mockBookings.filter((b) => b.status === "COMPLETED" || b.status === "CANCELLED")

  const { register, handleSubmit, reset: resetForm, formState: { errors } } = useForm<PetForm>({
    resolver: zodResolver(petSchema),
  })

  const openAddPet = () => {
    setEditingPet(null)
    resetForm({})
    setPetModalOpen(true)
  }

  const openEditPet = (pet: Pet) => {
    setEditingPet(pet)
    resetForm({ name: pet.name, species: pet.species, breed: pet.breed, age: pet.age, weight: pet.weight, notes: pet.notes })
    setPetModalOpen(true)
  }

  const onPetSubmit = (data: PetForm) => {
    if (editingPet) {
      setPets((prev) => prev.map((p) => p.id === editingPet.id ? { ...p, ...data } : p))
    } else {
      const newPet: Pet = { id: `pet-${Date.now()}`, userId: "u1", ...data }
      setPets((prev) => [...prev, newPet])
    }
    setPetModalOpen(false)
  }

  const deletePet = (id: string) => setPets((prev) => prev.filter((p) => p.id !== id))

  const speciesEmoji: Record<string, string> = {
    Dog: "🐶", Cat: "🐱", Bird: "🐦", Rabbit: "🐰",
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Sidebar ─────────────────────────────────────────── */}
          <aside className="w-full lg:w-64 shrink-0">
            {/* User card */}
            <Card className="mb-4">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="font-bold">Alex Johnson</p>
                    <p className="text-xs text-muted-foreground">alex@example.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Nav */}
            <Card>
              <CardContent className="p-2">
                <nav className="flex flex-col gap-0.5">
                  {navItems.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left",
                        activeTab === id
                          ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <Icon size={16} />
                      {label}
                    </button>
                  ))}
                  <div className="border-t border-border/60 mt-1 pt-1">
                    <button className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors w-full">
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                </nav>
              </CardContent>
            </Card>
          </aside>

          {/* ── Main ────────────────────────────────────────────── */}
          <main className="flex-1 min-w-0">

            {/* Overview */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-black">Welcome back, Alex 👋</h1>
                  <p className="text-muted-foreground mt-1">Here's a quick look at your activity.</p>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "Upcoming", value: upcoming.length, icon: Calendar, color: "bg-sky-100 text-sky-600" },
                    { label: "Completed", value: past.filter(b => b.status === "COMPLETED").length, icon: Star, color: "bg-emerald-100 text-emerald-600" },
                    { label: "My Pets", value: pets.length, icon: PawPrint, color: "bg-violet-100 text-violet-600" },
                    { label: "Saved", value: savedProviders.length, icon: Heart, color: "bg-rose-100 text-rose-600" },
                  ].map(({ label, value, icon: Icon, color }) => (
                    <Card key={label} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-5">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${color} mb-3`}>
                          <Icon size={16} />
                        </div>
                        <p className="text-3xl font-black">{value}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Upcoming preview */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Upcoming Bookings</CardTitle>
                      <button onClick={() => setActiveTab("upcoming")} className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">
                        View all <ChevronRight size={12} />
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {upcoming.length === 0
                      ? <p className="text-muted-foreground text-sm py-4 text-center">No upcoming bookings.</p>
                      : upcoming.slice(0, 2).map((b) => {
                          const provider = mockProviders.find(p => p.id === b.providerId)
                          const service = provider?.services.find(s => s.id === b.serviceId)
                          return (
                            <BookingCard
                              key={b.id}
                              booking={b}
                              providerName={provider?.businessName}
                              serviceName={service?.title}
                            />
                          )
                        })}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Upcoming Bookings */}
            {activeTab === "upcoming" && (
              <div className="space-y-4">
                <h1 className="text-2xl font-black">Upcoming Bookings</h1>
                {upcoming.length === 0
                  ? (
                    <div className="text-center py-16 text-muted-foreground">
                      <Calendar size={48} className="mx-auto mb-3 opacity-30" />
                      <p className="font-semibold">No upcoming bookings</p>
                      <Link href="/search"><Button className="mt-4">Find Services</Button></Link>
                    </div>
                  )
                  : upcoming.map((b) => {
                      const provider = mockProviders.find(p => p.id === b.providerId)
                      const service = provider?.services.find(s => s.id === b.serviceId)
                      return (
                        <BookingCard
                          key={b.id}
                          booking={b}
                          providerName={provider?.businessName}
                          serviceName={service?.title}
                        />
                      )
                    })}
              </div>
            )}

            {/* Past Bookings */}
            {activeTab === "history" && (
              <div className="space-y-4">
                <h1 className="text-2xl font-black">Past Bookings</h1>
                {past.length === 0
                  ? (
                    <div className="text-center py-16 text-muted-foreground">
                      <Clock size={48} className="mx-auto mb-3 opacity-30" />
                      <p className="font-semibold">No past bookings yet</p>
                    </div>
                  )
                  : past.map((b) => {
                      const provider = mockProviders.find(p => p.id === b.providerId)
                      const service = provider?.services.find(s => s.id === b.serviceId)
                      return (
                        <BookingCard
                          key={b.id}
                          booking={b}
                          providerName={provider?.businessName}
                          serviceName={service?.title}
                        />
                      )
                    })}
              </div>
            )}

            {/* Saved Providers */}
            {activeTab === "saved" && (
              <div className="space-y-4">
                <h1 className="text-2xl font-black">Saved Providers</h1>
                {savedProviders.length === 0
                  ? (
                    <div className="text-center py-16 text-muted-foreground">
                      <Heart size={48} className="mx-auto mb-3 opacity-30" />
                      <p className="font-semibold">No saved providers yet</p>
                      <Link href="/search"><Button className="mt-4">Browse Providers</Button></Link>
                    </div>
                  )
                  : (
                    <div className="grid sm:grid-cols-2 gap-6">
                      {savedProviders.map((p) => <ProviderCard key={p.id} provider={p} />)}
                    </div>
                  )}
              </div>
            )}

            {/* My Pets */}
            {activeTab === "pets" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-black">My Pets</h1>
                  <Button size="sm" onClick={openAddPet} className="gap-1">
                    <Plus size={14} /> Add Pet
                  </Button>
                </div>

                {pets.length === 0
                  ? (
                    <div className="text-center py-16 text-muted-foreground">
                      <PawPrint size={48} className="mx-auto mb-3 opacity-30" />
                      <p className="font-semibold">No pets added yet</p>
                      <Button className="mt-4" onClick={openAddPet}>Add Your First Pet</Button>
                    </div>
                  )
                  : (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {pets.map((pet) => (
                        <Card key={pet.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-5">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-2xl">
                                  {speciesEmoji[pet.species] ?? "🐾"}
                                </div>
                                <div>
                                  <p className="font-bold text-lg">{pet.name}</p>
                                  <p className="text-sm text-muted-foreground">{pet.species}{pet.breed ? ` · ${pet.breed}` : ""}</p>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="icon" onClick={() => openEditPet(pet)}>
                                  <Pencil size={14} />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => deletePet(pet.id)}>
                                  <Trash2 size={14} />
                                </Button>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-3">
                              {pet.age !== undefined && (
                                <Badge variant="secondary">{pet.age} yr{pet.age !== 1 ? "s" : ""}</Badge>
                              )}
                              {pet.weight !== undefined && (
                                <Badge variant="secondary">{pet.weight} lbs</Badge>
                              )}
                              {pet.notes && (
                                <Badge variant="outline" className="truncate max-w-40">{pet.notes}</Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                {/* Pet Modal */}
                <Modal
                  open={petModalOpen}
                  onClose={() => setPetModalOpen(false)}
                  title={editingPet ? "Edit Pet" : "Add a New Pet"}
                >
                  <form onSubmit={handleSubmit(onPetSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Name *</label>
                        <Input {...register("name")} placeholder="Buddy" />
                        {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Species *</label>
                        <select {...register("species")} className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                          <option value="">Select…</option>
                          <option>Dog</option><option>Cat</option><option>Bird</option><option>Rabbit</option><option>Other</option>
                        </select>
                        {errors.species && <p className="text-xs text-destructive mt-1">{errors.species.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Breed</label>
                        <Input {...register("breed")} placeholder="Golden Retriever" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Age (years)</label>
                        <Input {...register("age")} type="number" min={0} placeholder="3" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Weight (lbs)</label>
                        <Input {...register("weight")} type="number" min={0} placeholder="68" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Notes</label>
                      <textarea {...register("notes")} rows={2} placeholder="Allergies, behaviour, etc." className="flex w-full rounded-xl border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                    </div>
                    <div className="flex gap-3 pt-1">
                      <Button type="button" variant="outline" className="flex-1" onClick={() => setPetModalOpen(false)}>Cancel</Button>
                      <Button type="submit" className="flex-1">{editingPet ? "Save Changes" : "Add Pet"}</Button>
                    </div>
                  </form>
                </Modal>
              </div>
            )}

            {/* Settings */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <h1 className="text-2xl font-black">Account Settings</h1>
                <Card>
                  <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5">First Name</label>
                        <Input defaultValue="Alex" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Last Name</label>
                        <Input defaultValue="Johnson" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Email</label>
                        <Input defaultValue="alex@example.com" type="email" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Phone</label>
                        <Input defaultValue="+1 (555) 000-0000" type="tel" />
                      </div>
                    </div>
                    <Button>Save Changes</Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>Change Password</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Current Password</label>
                      <Input type="password" placeholder="••••••••" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5">New Password</label>
                        <Input type="password" placeholder="••••••••" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Confirm Password</label>
                        <Input type="password" placeholder="••••••••" />
                      </div>
                    </div>
                    <Button variant="outline">Update Password</Button>
                  </CardContent>
                </Card>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  )
}
