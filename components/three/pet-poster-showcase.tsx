"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowRight, MapPin, ChevronLeft, ChevronRight } from "lucide-react"

// ─── Verified Unsplash images ─────────────────────────────────────────────────

const posters = [
  {
    id: 1,
    category: "Veterinary",
    tagline: "Compassionate Care",
    description: "Board-certified vets with 15+ years experience. Same-day appointments available.",
    price: "From $85",
    rating: 4.9,
    city: "Austin, TX",
    href: "/search?type=VET",
    image: "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=700&h=900&fit=crop&q=80",
    accent: "#7c3aed",
    glow: "rgba(124,58,237,0.5)",
    badge: "🩺 Most Booked",
  },
  {
    id: 2,
    category: "Dog Walking",
    tagline: "Adventure Awaits",
    description: "GPS-tracked walks with real-time photo updates. Solo & group options available.",
    price: "From $20",
    rating: 4.8,
    city: "New York, NY",
    href: "/search?type=WALKING",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=700&h=900&fit=crop&q=80",
    accent: "#0891b2",
    glow: "rgba(8,145,178,0.5)",
    badge: "🏆 Top Rated",
  },
  {
    id: 3,
    category: "Grooming",
    tagline: "Looking Fabulous",
    description: "Breed-specific cuts, spa treatments & de-shedding therapy by certified groomers.",
    price: "From $40",
    rating: 4.7,
    city: "Los Angeles, CA",
    href: "/search?type=GROOMING",
    image: "https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?w=700&h=900&fit=crop&q=80",
    accent: "#be185d",
    glow: "rgba(190,24,93,0.5)",
    badge: "✨ Premium",
  },
  {
    id: 4,
    category: "Training",
    tagline: "Build Bonds",
    description: "Positive-reinforcement trainers. Puppy classes, obedience & behaviour modification.",
    price: "From $120",
    rating: 4.9,
    city: "Chicago, IL",
    href: "/search?type=TRAINING",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=700&h=900&fit=crop&q=80",
    accent: "#b45309",
    glow: "rgba(180,83,9,0.5)",
    badge: "🎖️ Certified",
  },
  {
    id: 5,
    category: "Boarding",
    tagline: "Home Away From Home",
    description: "Luxury suites with 24/7 supervision, webcam access & daily enrichment activities.",
    price: "From $45",
    rating: 4.8,
    city: "San Francisco, CA",
    href: "/search?type=BOARDING",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=700&h=900&fit=crop&q=80",
    accent: "#15803d",
    glow: "rgba(21,128,61,0.5)",
    badge: "🏠 5-Star",
  },
]

// ─── Individual poster card ───────────────────────────────────────────────────

function PosterCard({
  poster,
  position, // -1 = left offscreen, 0 = centre, 1 = right offscreen
  mouseX,
  mouseY,
}: {
  poster: typeof posters[0]
  position: -2 | -1 | 0 | 1 | 2
  mouseX: number
  mouseY: number
}) {
  const [hovered, setHovered] = useState(false)

  const isCenter = position === 0
  const isSide = Math.abs(position) === 1
  const isHidden = Math.abs(position) === 2

  // 3-D tilt follows mouse only on center card
  const tiltX = isCenter && hovered ? mouseY * 8 : isCenter ? mouseY * 3 : 0
  const tiltY = isCenter && hovered ? -mouseX * 10 : isCenter ? -mouseX * 4 : position * -12

  const scale = isCenter ? (hovered ? 1.04 : 1.0) : isSide ? 0.82 : 0.65
  const translateX = position * 310
  const translateZ = isCenter ? 0 : isSide ? -120 : -260
  const opacity = isHidden ? 0 : isSide ? 0.55 : 1

  return (
    <div
      className="absolute top-0"
      style={{
        width: 300,
        height: 500,
        left: "50%",
        marginLeft: -150,
        transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${scale})`,
        transition: hovered
          ? "transform 0.15s ease, opacity 0.4s ease, box-shadow 0.3s ease"
          : "transform 0.55s cubic-bezier(0.23,1,0.32,1), opacity 0.4s ease, box-shadow 0.3s ease",
        opacity,
        zIndex: isCenter ? 10 : isSide ? 5 : 1,
        pointerEvents: isCenter || isSide ? "auto" : "none",
        boxShadow: isCenter
          ? `0 40px 80px ${poster.glow}, 0 0 0 1px ${poster.accent}55`
          : "0 20px 40px rgba(0,0,0,0.4)",
        borderRadius: 28,
        overflow: "hidden",
        cursor: isCenter ? "pointer" : "default",
      }}
      onMouseEnter={() => isCenter && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <img
        src={poster.image}
        alt={poster.category}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          transform: hovered ? "scale(1.07)" : "scale(1)",
          transition: "transform 0.7s cubic-bezier(0.23,1,0.32,1)",
        }}
      />

      {/* Top scrim — keeps pet image legible without full overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 40%)",
        }}
      />

      {/* Top row */}
      <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
        <span
          className="text-[11px] font-bold px-3 py-1.5 rounded-full"
          style={{ background: "rgba(0,0,0,0.5)", color: "#fff", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)" }}
        >
          {poster.badge}
        </span>
        <span
          className="text-[11px] font-bold px-3 py-1.5 rounded-full"
          style={{ background: "rgba(0,0,0,0.5)", color: "#fbbf24", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)" }}
        >
          ★ {poster.rating}
        </span>
      </div>

      {/* Bottom content — positioned from bottom, fixed height section */}
      <div
        className="absolute left-0 right-0 bottom-0"
        style={{
          padding: "20px 22px 22px",
          /* tall enough for the full expanded state */
          background: `linear-gradient(to top, ${poster.accent} 0%, ${poster.accent}cc 60%, transparent 100%)`,
        }}
      >
        {/* Category + always-visible info */}
        <span
          className="text-[9px] font-black uppercase tracking-[0.18em] px-2.5 py-1 rounded-full inline-block mb-2"
          style={{ background: poster.accent, color: "#fff", border: "1px solid rgba(255,255,255,0.25)" }}
        >
          {poster.category}
        </span>

        <h3 className="text-white font-black text-xl leading-snug mb-1">{poster.tagline}</h3>

        <p className="text-white/60 text-[11px] flex items-center gap-1 mb-3">
          <MapPin size={9} /> {poster.city}
        </p>

        {/* Hover-revealed description */}
        <div
          style={{
            maxHeight: hovered ? 80 : 0,
            opacity: hovered ? 1 : 0,
            overflow: "hidden",
            transition: "max-height 0.45s cubic-bezier(0.23,1,0.32,1), opacity 0.3s ease",
          }}
        >
          <p className="text-white/80 text-[11px] leading-relaxed mb-3">{poster.description}</p>
        </div>

        {/* Price + Book Now row — always visible */}
        <div className="flex items-center justify-between mt-1">
          <span className="text-white font-black text-lg">{poster.price}</span>
          <Link href={poster.href} onClick={(e) => e.stopPropagation()}>
            <button
              className="flex items-center gap-1.5 text-[11px] font-bold px-4 py-1.5 rounded-full hover:opacity-90 active:scale-95 transition-all"
              style={{ background: "#fff", color: poster.accent }}
            >
              Book Now <ArrowRight size={11} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── Main showcase ────────────────────────────────────────────────────────────

export function PetPosterShowcase() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setIsVisible(true) },
      { threshold: 0.2 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  // Mouse tilt (relative to section centre)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMouseX((e.clientX - rect.left) / rect.width - 0.5)   // -0.5 … 0.5
    setMouseY((e.clientY - rect.top) / rect.height - 0.5)
  }
  const handleMouseLeave = () => { setMouseX(0); setMouseY(0) }

  const prev = () => setActiveIndex((i) => (i - 1 + posters.length) % posters.length)
  const next = () => setActiveIndex((i) => (i + 1) % posters.length)

  return (
    <section
      ref={sectionRef}
      className="relative py-28 overflow-hidden select-none"
      style={{ background: "linear-gradient(160deg,#0c0118 0%,#0b0b1e 55%,#04101e 100%)" }}
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(124,58,237,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,0.07) 1px,transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_60%,rgba(124,58,237,0.1),transparent)] pointer-events-none" />

      {/* Header */}
      <div
        className="relative text-center mb-16 px-4"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        <span className="text-xs font-black uppercase tracking-[0.28em] text-violet-400 mb-3 block">
          Explore Services
        </span>
        <h2 className="text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
          Your pet's perfect{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
            companion service
          </span>
        </h2>
        <p className="text-white/45 text-base">
          Hover to reveal · Navigate to explore all services
        </p>
      </div>

      {/* 3-D stage */}
      <div
        className="relative mx-auto"
        style={{
          height: 540,
          maxWidth: 1000,
          perspective: "1200px",
          perspectiveOrigin: "50% 45%",
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.9s ease 0.2s",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {posters.map((poster, i) => {
          // position relative to active: -2,-1,0,1,2
          let rel = i - activeIndex
          if (rel > 2) rel -= posters.length
          if (rel < -2) rel += posters.length
          return (
            <PosterCard
              key={poster.id}
              poster={poster}
              position={rel as -2 | -1 | 0 | 1 | 2}
              mouseX={mouseX}
              mouseY={mouseY}
            />
          )
        })}
      </div>

      {/* Prev / Next */}
      <div className="flex items-center justify-center gap-6 mt-10">
        <button
          onClick={prev}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white backdrop-blur-sm hover:bg-white/15 hover:border-white/30 transition-all duration-200"
          aria-label="Previous"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Dot indicators */}
        <div className="flex gap-2">
          {posters.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === activeIndex ? 24 : 8,
                height: 8,
                background: i === activeIndex ? "#7c3aed" : "rgba(255,255,255,0.2)",
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white backdrop-blur-sm hover:bg-white/15 hover:border-white/30 transition-all duration-200"
          aria-label="Next"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  )
}
