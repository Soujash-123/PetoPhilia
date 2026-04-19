"use client"

import { useState } from "react"
import {
  LayoutDashboard, Calendar, Users, DollarSign, Settings,
  Plus, Pencil, Trash2, ChevronRight, TrendingUp, Clock,
  CheckCircle2, XCircle, BarChart2, Star, Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Modal } from "@/components/ui/modal"
import { RatingStars } from "@/components/ui/rating-stars"
import { mockProviders, mockBookings, mockReviews } from "@/lib/mock-data"
import { Service, Booking, BookingStatus } from "@/types"
import { cn } from "@/lib/utils"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

// ─── Service form schema ──────────────────────────────────────────────────────

const serviceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(1, "Price must be at least $1"),
  durationMinutes: z.coerce.number().min(0),
  type: z.enum(["VET", "GROOMING", "BOARDING", "WALKING", "TRAINING", "INSURANCE"]),
})
type ServiceForm = z.infer<typeof serviceSchema>

// ─── Mock earnings data ───────────────────────────────────────────────────────

const monthlyEarnings = [
  { month: "Oct", amount: 3200 },
  { month: "Nov", amount: 4100 },
  { month: "Dec", amount: 5800 },
  { month: "Jan", amount: 4400 },
  { month: "Feb", amount: 6200 },
  { month: "Mar", amount: 7100 },
]

const MAX_AMOUNT = Math.max(...monthlyEarnings.map((d) => d.amount))

// ─── Sidebar nav ──────────────────────────────────────────────────────────────

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "bookings", label: "Bookings", icon: Calendar },
  { id: "services", label: "Services", icon: Settings },
  { id: "earnings", label: "Earnings", icon: DollarSign },
  { id: "profile", label: "Edit Profile", icon: Users },
] as const
type NavId = typeof navItems[number]["id"]

// ─── Status helpers ───────────────────────────────────────────────────────────

const statusBadge: Record<BookingStatus, { label: string; variant: string; icon: React.ElementType }> = {
  CONFIRMED: { label: "Confirmed", variant: "success", icon: CheckCircle2 },
  PENDING:   { label: "Pending",   variant: "warning", icon: Loader2 },
  COMPLETED: { label: "Completed", variant: "info",    icon: CheckCircle2 },
  CANCELLED: { label: "Cancelled", variant: "destructive", icon: XCircle },
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProviderDashboardPage() {
  const provider = mockProviders[0] // Simulate logged-in provider
  const [activeTab, setActiveTab] = useState<NavId>("overview")
  const [services, setServices] = useState<Service[]>(provider.services)
  const [serviceModalOpen, setServiceModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [bookings, setBookings] = useState<Booking[]>(mockBookings)

  const totalEarnings = monthlyEarnings.reduce((sum, d) => sum + d.amount, 0)
  const thisMonthEarnings = monthlyEarnings[monthlyEarnings.length - 1].amount
  const confirmedBookings = bookings.filter((b) => b.status === "CONFIRMED" || b.status === "PENDING")

  const { register, handleSubmit, reset: resetForm, formState: { errors } } = useForm<ServiceForm>({
    resolver: zodResolver(serviceSchema),
  })

  const openAddService = () => {
    setEditingService(null)
    resetForm({ type: "VET", durationMinutes: 60 })
    setServiceModalOpen(true)
  }

  const openEditService = (s: Service) => {
    setEditingService(s)
    resetForm({
      title: s.title,
      description: s.description,
      price: s.price,
      durationMinutes: s.durationMinutes,
      type: s.type as any,
    })
    setServiceModalOpen(true)
  }

  const onServiceSubmit = (data: ServiceForm) => {
    if (editingService) {
      setServices((prev) => prev.map((s) => s.id === editingService.id ? { ...s, ...data } : s))
    } else {
      const newService: Service = {
        id: `s-${Date.now()}`,
        providerId: provider.id,
        ...data,
      }
      setServices((prev) => [...prev, newService])
    }
    setServiceModalOpen(false)
  }

  const deleteService = (id: string) => setServices((prev) => prev.filter((s) => s.id !== id))

  const updateBookingStatus = (id: string, status: BookingStatus) => {
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status } : b))
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Sidebar ─────────────────────────────────────────── */}
          <aside className="w-full lg:w-64 shrink-0">
            <Card className="mb-4">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-2xl">
                    🐾
                  </div>
                  <div>
                    <p className="font-bold text-sm">{provider.businessName}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star size={11} className="text-amber-400 fill-amber-400" />
                      <span className="text-xs text-muted-foreground">{provider.rating} ({provider.reviewsCount})</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

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
                  <h1 className="text-2xl font-black">Provider Dashboard</h1>
                  <p className="text-muted-foreground mt-1">Welcome back, here's your business snapshot.</p>
                </div>

                {/* KPI cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "This Month", value: `$${thisMonthEarnings.toLocaleString()}`, icon: DollarSign, color: "bg-emerald-100 text-emerald-600", trend: "+14%" },
                    { label: "Active Bookings", value: confirmedBookings.length, icon: Calendar, color: "bg-sky-100 text-sky-600", trend: "+3" },
                    { label: "Services", value: services.length, icon: Settings, color: "bg-violet-100 text-violet-600", trend: null },
                    { label: "Avg. Rating", value: `${provider.rating}★`, icon: Star, color: "bg-amber-100 text-amber-600", trend: null },
                  ].map(({ label, value, icon: Icon, color, trend }) => (
                    <Card key={label} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${color}`}>
                            <Icon size={16} />
                          </div>
                          {trend && <Badge variant="success" className="text-[10px]">{trend}</Badge>}
                        </div>
                        <p className="text-2xl font-black">{value}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Mini chart preview */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Revenue Overview</CardTitle>
                      <button onClick={() => setActiveTab("earnings")} className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">
                        Full report <ChevronRight size={12} />
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-end gap-3 h-32">
                      {monthlyEarnings.map(({ month, amount }) => (
                        <div key={month} className="flex-1 flex flex-col items-center gap-1">
                          <div
                            className="w-full rounded-t-lg bg-primary/80 hover:bg-primary transition-colors"
                            style={{ height: `${(amount / MAX_AMOUNT) * 100}%` }}
                          />
                          <span className="text-[10px] text-muted-foreground">{month}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent bookings */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Recent Bookings</CardTitle>
                      <button onClick={() => setActiveTab("bookings")} className="text-sm text-primary font-semibold hover:underline flex items-center gap-1">
                        All bookings <ChevronRight size={12} />
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {bookings.slice(0, 3).map((b) => {
                        const service = services.find(s => s.id === b.serviceId)
                        const cfg = statusBadge[b.status]
                        const StatusIcon = cfg.icon
                        return (
                          <div key={b.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                            <div>
                              <p className="text-sm font-semibold">{service?.title ?? "Service"}</p>
                              <p className="text-xs text-muted-foreground">{new Date(b.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {b.startTime}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-sm">${b.totalPrice}</span>
                              <Badge variant={cfg.variant as any} className="text-[10px] gap-1">
                                <StatusIcon size={9} /> {cfg.label}
                              </Badge>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Bookings Management */}
            {activeTab === "bookings" && (
              <div className="space-y-4">
                <h1 className="text-2xl font-black">Booking Management</h1>

                {/* Filter tabs */}
                <div className="flex gap-2 flex-wrap">
                  {(["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"] as const).map((status) => (
                    <Badge key={status} variant="outline" className="cursor-pointer hover:bg-primary/10 px-3 py-1 text-xs font-semibold">
                      {status === "ALL" ? "All" : statusBadge[status as BookingStatus]?.label ?? status}
                    </Badge>
                  ))}
                </div>

                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border/60">
                            <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Booking</th>
                            <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Date</th>
                            <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Amount</th>
                            <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                            <th className="text-right px-5 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookings.map((b) => {
                            const service = services.find(s => s.id === b.serviceId)
                            const cfg = statusBadge[b.status]
                            const StatusIcon = cfg.icon
                            return (
                              <tr key={b.id} className="border-b border-border/60 last:border-none hover:bg-muted/30 transition-colors">
                                <td className="px-5 py-4">
                                  <p className="font-semibold">{service?.title ?? "Service"}</p>
                                  <p className="text-xs text-muted-foreground">{b.startTime} – {b.endTime}</p>
                                </td>
                                <td className="px-5 py-4 text-muted-foreground">
                                  {new Date(b.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                </td>
                                <td className="px-5 py-4 font-bold">${b.totalPrice}</td>
                                <td className="px-5 py-4">
                                  <Badge variant={cfg.variant as any} className="gap-1 text-[10px]">
                                    <StatusIcon size={9} /> {cfg.label}
                                  </Badge>
                                </td>
                                <td className="px-5 py-4 text-right">
                                  <div className="flex justify-end gap-1">
                                    {b.status === "PENDING" && (
                                      <Button size="sm" variant="outline" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 text-xs"
                                        onClick={() => updateBookingStatus(b.id, "CONFIRMED")}>
                                        Accept
                                      </Button>
                                    )}
                                    {(b.status === "PENDING" || b.status === "CONFIRMED") && (
                                      <Button size="sm" variant="outline" className="text-destructive border-destructive/20 hover:bg-destructive/5 text-xs"
                                        onClick={() => updateBookingStatus(b.id, "CANCELLED")}>
                                        Decline
                                      </Button>
                                    )}
                                    {b.status === "CONFIRMED" && (
                                      <Button size="sm" variant="outline" className="text-sky-600 border-sky-200 hover:bg-sky-50 text-xs"
                                        onClick={() => updateBookingStatus(b.id, "COMPLETED")}>
                                        Complete
                                      </Button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Services */}
            {activeTab === "services" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-black">Service Management</h1>
                  <Button size="sm" onClick={openAddService} className="gap-1">
                    <Plus size={14} /> Add Service
                  </Button>
                </div>

                <div className="space-y-3">
                  {services.map((service) => (
                    <Card key={service.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-bold">{service.title}</p>
                              <Badge variant="secondary" className="text-[10px]">{service.type}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{service.description}</p>
                            {service.durationMinutes > 0 && (
                              <p className="text-xs text-muted-foreground mt-1">
                                <Clock size={10} className="inline mr-1" />
                                {service.durationMinutes >= 60 ? `${service.durationMinutes / 60}h` : `${service.durationMinutes}min`}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <p className="text-xl font-black text-primary">${service.price}</p>
                            <Button variant="ghost" size="icon" onClick={() => openEditService(service)}>
                              <Pencil size={14} />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => deleteService(service.id)}>
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Service Modal */}
                <Modal
                  open={serviceModalOpen}
                  onClose={() => setServiceModalOpen(false)}
                  title={editingService ? "Edit Service" : "Add New Service"}
                >
                  <form onSubmit={handleSubmit(onServiceSubmit)} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Title *</label>
                      <Input {...register("title")} placeholder="e.g. Full Grooming" />
                      {errors.title && <p className="text-xs text-destructive mt-1">{errors.title.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Type *</label>
                      <select {...register("type")} className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                        <option value="VET">Veterinary</option>
                        <option value="GROOMING">Grooming</option>
                        <option value="BOARDING">Boarding</option>
                        <option value="WALKING">Dog Walking</option>
                        <option value="TRAINING">Training</option>
                        <option value="INSURANCE">Insurance</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Description *</label>
                      <textarea {...register("description")} rows={2} placeholder="Describe this service…" className="flex w-full rounded-xl border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                      {errors.description && <p className="text-xs text-destructive mt-1">{errors.description.message}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Price ($) *</label>
                        <Input {...register("price")} type="number" min={1} placeholder="65" />
                        {errors.price && <p className="text-xs text-destructive mt-1">{errors.price.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Duration (min)</label>
                        <Input {...register("durationMinutes")} type="number" min={0} placeholder="60" />
                      </div>
                    </div>
                    <div className="flex gap-3 pt-1">
                      <Button type="button" variant="outline" className="flex-1" onClick={() => setServiceModalOpen(false)}>Cancel</Button>
                      <Button type="submit" className="flex-1">{editingService ? "Save Changes" : "Add Service"}</Button>
                    </div>
                  </form>
                </Modal>
              </div>
            )}

            {/* Earnings */}
            {activeTab === "earnings" && (
              <div className="space-y-6">
                <h1 className="text-2xl font-black">Earnings Analytics</h1>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: "Total (6 months)", value: `$${totalEarnings.toLocaleString()}`, icon: DollarSign, color: "bg-emerald-100 text-emerald-600" },
                    { label: "This Month", value: `$${thisMonthEarnings.toLocaleString()}`, icon: TrendingUp, color: "bg-violet-100 text-violet-600" },
                    { label: "Avg. per Month", value: `$${Math.round(totalEarnings / monthlyEarnings.length).toLocaleString()}`, icon: BarChart2, color: "bg-sky-100 text-sky-600" },
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

                {/* Bar chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart2 size={18} /> Monthly Revenue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-end gap-4 h-48 mb-2">
                      {monthlyEarnings.map(({ month, amount }) => (
                        <div key={month} className="flex-1 flex flex-col items-center gap-2">
                          <span className="text-xs font-bold text-primary">${(amount / 1000).toFixed(1)}k</span>
                          <div
                            className="w-full rounded-t-xl bg-gradient-to-t from-primary to-violet-400 transition-all duration-300 hover:opacity-80"
                            style={{ height: `${(amount / MAX_AMOUNT) * 100}%` }}
                          />
                          <span className="text-xs text-muted-foreground">{month}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-4 border-t border-border/60 grid grid-cols-3 gap-4 text-center text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">Best Month</p>
                        <p className="font-bold">Mar · $7,100</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Growth</p>
                        <p className="font-bold text-emerald-500">+121% YoY</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Avg. Booking</p>
                        <p className="font-bold">$68</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Profile Edit */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <h1 className="text-2xl font-black">Edit Business Profile</h1>
                <Card>
                  <CardHeader><CardTitle>Business Information</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Business Name</label>
                      <Input defaultValue={provider.businessName} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Bio / Description</label>
                      <textarea rows={4} defaultValue={provider.bio} className="flex w-full rounded-xl border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Street Address</label>
                        <Input defaultValue={provider.location.address} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">City</label>
                        <Input defaultValue={provider.location.city} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">State</label>
                        <Input defaultValue={provider.location.state} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">ZIP Code</label>
                        <Input defaultValue={provider.location.zip} />
                      </div>
                    </div>
                    <Button>Save Profile</Button>
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
