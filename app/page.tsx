import type { Metadata } from "next"
import Link from "next/link"
import {
  Search, MapPin, Stethoscope, Scissors, Home, PersonStanding,
  Dumbbell, Shield, ArrowRight, Star, CheckCircle2, ChevronRight,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProviderCard } from "@/components/provider/provider-card"
import { mockProviders } from "@/lib/mock-data"
import { PetPosterShowcase, HowItWorks3D } from "@/components/three"

export const metadata: Metadata = {
  title: "PetoPhilia | The Ultimate Pet Services Marketplace",
  description:
    "Find and book the best local pet services — vets, groomers, boarders, walkers, trainers, and insurance. PetoPhilia connects pet owners with trusted providers.",
}

const categories = [
  { icon: Stethoscope,    label: "Veterinary",  color: "bg-sky-100 text-sky-600",       href: "/search?type=VET",       count: "1,200+ vets" },
  { icon: Scissors,       label: "Grooming",    color: "bg-emerald-100 text-emerald-600", href: "/search?type=GROOMING", count: "800+ groomers" },
  { icon: Home,           label: "Boarding",    color: "bg-amber-100 text-amber-600",    href: "/search?type=BOARDING",  count: "400+ facilities" },
  { icon: PersonStanding, label: "Dog Walking", color: "bg-violet-100 text-violet-600",  href: "/search?type=WALKING",   count: "2,000+ walkers" },
  { icon: Dumbbell,       label: "Training",    color: "bg-rose-100 text-rose-600",      href: "/search?type=TRAINING",  count: "600+ trainers" },
  { icon: Shield,         label: "Insurance",   color: "bg-indigo-100 text-indigo-600",  href: "/search?type=INSURANCE", count: "50+ plans" },
]

const howItWorks = [
  { step: "01", title: "Search & Filter",   desc: "Find services near you by type, price, rating, and more." },
  { step: "02", title: "Choose a Provider", desc: "Read reviews, view availability, and pick the perfect match." },
  { step: "03", title: "Book Instantly",    desc: "Select your date, add pet details, and confirm your booking." },
  { step: "04", title: "Enjoy & Review",    desc: "Get updates during the service and leave a review after." },
]

const stats = [
  { value: "50k+", label: "Happy Pets" },
  { value: "8k+",  label: "Providers" },
  { value: "200+", label: "Cities" },
  { value: "4.9★", label: "Avg Rating" },
]

export default function HomePage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────────
          Split layout: copy on the left, stacked pet images on the right
      ─────────────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0d0018] via-[#1a0035] to-[#050d20]">
        {/* Ambient blobs */}
        <div className="absolute top-0 left-1/4 h-[600px] w-[600px] rounded-full bg-violet-600/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-cyan-500/15 blur-[100px] pointer-events-none" />

        <div className="container mx-auto max-w-7xl px-4 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* ── Left copy ──────────────────────────────────────────────── */}
            <div className="text-white">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold mb-8">
                <Sparkles size={13} className="text-violet-300" />
                <span className="text-white/80">Trusted by 50,000+ pet owners</span>
              </div>

              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.05] tracking-tight mb-6">
                Every pet{" "}
                <br className="hidden lg:block" />
                deserves{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300">
                  the best
                </span>
              </h1>

              <p className="text-lg text-white/60 leading-relaxed mb-10 max-w-md">
                PetoPhilia is one marketplace for every pet service — vets, groomers,
                walkers, trainers, and more. Book in minutes, anywhere.
              </p>

              {/* Search bar */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <div className="flex-1 flex items-center gap-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md px-5 py-3.5">
                  <Search size={17} className="text-white/40 shrink-0" />
                  <input
                    type="text"
                    placeholder="Grooming, walking, vet…"
                    className="flex-1 bg-transparent text-white placeholder:text-white/35 focus:outline-none text-sm font-medium"
                  />
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md px-5 py-3.5">
                  <MapPin size={17} className="text-white/40 shrink-0" />
                  <input
                    type="text"
                    placeholder="Your city"
                    className="w-28 bg-transparent text-white placeholder:text-white/35 focus:outline-none text-sm font-medium"
                  />
                </div>
                <Link href="/search">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-400 hover:to-fuchsia-400 border-0 shadow-xl shadow-violet-600/40 font-bold w-full sm:w-auto h-[52px]"
                  >
                    Search <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-4 text-sm text-white/50">
                {["No booking fees", "Instant confirmation", "Cancel anytime"].map((t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-400" /> {t}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Right: clean 3-card stacked collage ────────────────────── */}
            <div className="relative hidden lg:flex items-center justify-center" style={{ height: 520 }}>

              {/* Back-right card: dog walking */}
              <div
                className="absolute rounded-[24px] overflow-hidden"
                style={{
                  width: 200, height: 280,
                  top: 50, right: 0,
                  transform: "rotate(7deg)",
                  boxShadow: "0 25px 55px rgba(0,0,0,0.55)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  zIndex: 1,
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=560&fit=crop&q=80"
                  alt="Golden retriever"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/75 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="bg-cyan-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">Walking</span>
                </div>
              </div>

              {/* Back-left card: cat grooming */}
              <div
                className="absolute rounded-[24px] overflow-hidden"
                style={{
                  width: 185, height: 250,
                  bottom: 50, left: 0,
                  transform: "rotate(-8deg)",
                  boxShadow: "0 25px 55px rgba(0,0,0,0.55)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  zIndex: 1,
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=370&h=500&fit=crop&q=80"
                  alt="Cat"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pink-900/75 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="bg-pink-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">Grooming</span>
                </div>
              </div>

              {/* Front centre card: vet dog — tallest, highest z-index */}
              <div
                className="absolute rounded-[28px] overflow-hidden"
                style={{
                  width: 255, height: 370,
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%) rotate(-2deg)",
                  boxShadow: "0 40px 80px rgba(124,58,237,0.45), 0 0 0 1px rgba(255,255,255,0.09)",
                  zIndex: 10,
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=510&h=740&fit=crop&q=80"
                  alt="Dog running"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-violet-900/90 via-violet-900/20 to-transparent" />
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/45 backdrop-blur-sm rounded-full px-2.5 py-1.5">
                  <Star size={11} className="text-amber-400 fill-amber-400" />
                  <span className="text-white text-xs font-bold">4.9</span>
                </div>
                <div className="absolute bottom-5 left-5 right-5">
                  <span className="bg-violet-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">Top Service</span>
                  <p className="text-white font-black text-xl mt-2.5 leading-tight">
                    Expert care<br />for every pet
                  </p>
                  <p className="text-white/60 text-xs mt-1.5">From $20 · Book instantly</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────────────────────── */}
      <section className="bg-violet-700 py-10">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-white">
                <p className="text-4xl font-black">{value}</p>
                <p className="text-violet-200/70 text-sm mt-1 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3D Pet Poster Showcase ────────────────────────────────────────────── */}
      <PetPosterShowcase />

      {/* ── Category quick-links ──────────────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-black mb-3">Browse by Category</h2>
            <p className="text-muted-foreground text-lg">Everything your pet needs, all in one place</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(({ icon: Icon, label, color, href, count }) => (
              <Link
                key={label}
                href={href}
                className="group flex flex-col items-center gap-3 p-6 rounded-2xl border border-border/60
                           hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1
                           transition-all duration-200 bg-card text-center"
              >
                <div className={`p-4 rounded-2xl ${color} transition-transform duration-200 group-hover:scale-110`}>
                  <Icon size={24} />
                </div>
                <div>
                  <p className="font-bold text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works (3D Vertical Scroll Reveal) ─────────── */}
      <HowItWorks3D />

      {/* ── Featured Providers ────────────────────────────────────────────────── */}
      <section className="py-20 container mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl font-black mb-2">Featured Providers</h2>
            <p className="text-muted-foreground">Top-rated services near you</p>
          </div>
          <Link href="/search">
            <Button variant="outline" className="gap-1">
              View All <ChevronRight size={14} />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProviders.slice(0, 6).map((p) => <ProviderCard key={p.id} provider={p} />)}
        </div>
      </section>

      {/* ── CTA strip ─────────────────────────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden">
        {/* Dark background with pet images strip */}
        <div className="absolute inset-0 grid grid-cols-4 opacity-20 pointer-events-none">
          {[
            "https://images.unsplash.com/photo-1628009368231-7bb7cfcbddf2?w=400&h=400&fit=crop&q=60",
            "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop&q=60",
            "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=400&fit=crop&q=60",
            "https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=400&h=400&fit=crop&q=60",
          ].map((src, i) => (
            <img key={i} src={src} alt="" className="w-full h-full object-cover" />
          ))}
        </div>
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-900/95 via-purple-900/90 to-indigo-900/95" />

        <div className="relative container mx-auto max-w-4xl px-4 text-center text-white">
          <h2 className="text-4xl lg:text-5xl font-black mb-4 leading-tight">
            Are you a pet service provider?
          </h2>
          <p className="text-white/70 text-lg mb-10 leading-relaxed max-w-2xl mx-auto">
            Join thousands of providers on PetoPhilia. Manage your bookings, grow your
            business, and reach thousands of pet owners — all from one dashboard.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/provider-dashboard">
              <Button
                size="xl"
                className="bg-white text-violet-700 hover:bg-white/90 font-bold shadow-xl w-full sm:w-auto"
              >
                Join as a Provider <ArrowRight size={16} />
              </Button>
            </Link>
            <Button
              size="xl"
              variant="outline"
              className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white w-full sm:w-auto"
            >
              Learn More
            </Button>
          </div>
          <div className="flex flex-wrap justify-center gap-6 mt-10 text-white/50 text-sm">
            {["Free to sign up", "No monthly fees", "Get paid fast", "24/7 support"].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400" /> {item}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
