"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { ArrowRight, MapPin, Star } from "lucide-react"
import Link from "next/link"

const posters = [
  {
    id: 1,
    category: "Veterinary",
    tagline: "Expert Medical Care",
    description: "Full-service medical center for your furry friends.",
    price: "From $85",
    rating: 4.9,
    city: "Austin, TX",
    href: "/search?type=VET",
    image: "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800&q=80",
    accent: "#8b5cf6",
  },
  {
    id: 2,
    category: "Dog Walking",
    tagline: "Healthy Exercises",
    description: "Daily walks tailored to your dog's energy levels.",
    price: "From $25",
    rating: 4.8,
    city: "New York, NY",
    href: "/search?type=WALKING",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&q=80",
    accent: "#06b6d4",
  },
  {
    id: 3,
    category: "Grooming",
    tagline: "Style & Comfort",
    description: "Professional styling and hygiene for every breed.",
    price: "From $45",
    rating: 4.7,
    city: "Los Angeles, CA",
    href: "/search?type=GROOMING",
    image: "https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?w=800&q=80",
    accent: "#ec4899",
  },
  {
    id: 4,
    category: "Training",
    tagline: "Obedience Wins",
    description: "Certified trainers focusing on positive reinforcement.",
    price: "From $120",
    rating: 4.9,
    city: "Chicago, IL",
    href: "/search?type=TRAINING",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80",
    accent: "#f59e0b",
  },
  {
    id: 5,
    category: "Boarding",
    tagline: "Luxury Stay",
    description: "Safe, clean, and fun environment for long stays.",
    price: "From $50",
    rating: 4.8,
    city: "Seattle, WA",
    href: "/search?type=BOARDING",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80",
    accent: "#10b981",
  },
]

export function ScrollShowcase3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (!canvasRef.current) return

    const container = canvasRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.z = 12

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)
    
    const pointLight = new THREE.PointLight(0x8b5cf6, 2, 20)
    pointLight.position.set(5, 5, 5)
    scene.add(pointLight)

    // Objects
    const loader = new THREE.TextureLoader()
    const cardGeometry = new THREE.PlaneGeometry(5, 7, 32, 32)
    
    const cards: THREE.Mesh[] = []
    
    posters.forEach((poster, i) => {
      const texture = loader.load(poster.image)
      const material = new THREE.MeshPhongMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        shininess: 100,
      })
      
      const card = new THREE.Mesh(cardGeometry, material)
      // Arrange cards vertically with some depth
      card.position.y = -i * 10
      card.position.z = -i * 2
      scene.add(card)
      cards.push(card)
    })

    // Animation state
    const scrollState = {
      target: 0,
      current: 0,
    }

    const handleScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const triggerTop = 0
      const contentHeight = containerRef.current.scrollHeight - window.innerHeight
      const scrollY = -rect.top
      const progress = Math.max(0, Math.min(1, scrollY / contentHeight))
      scrollState.target = progress * (posters.length - 1)
      
      const newActiveIndex = Math.round(scrollState.target)
      if (newActiveIndex !== activeIndex) {
        setActiveIndex(newActiveIndex)
      }
    }

    window.addEventListener("scroll", handleScroll)

    const animate = () => {
      requestAnimationFrame(animate)

      // Smooth interpolation
      scrollState.current += (scrollState.target - scrollState.current) * 0.1

      cards.forEach((card, i) => {
        const offset = i - scrollState.current
        
        // Vertical movement
        card.position.y = -offset * 8
        
        // Depth movement - bring active card forward
        card.position.z = -Math.abs(offset) * 3
        
        // Rotation - cards further away tilt more
        card.rotation.x = offset * 0.2
        card.rotation.y = offset * 0.1
        
        // Opacity
        const dist = Math.abs(offset)
        const opacity = Math.max(0, 1 - dist * 0.5)
        ;(card.material as THREE.MeshPhongMaterial).opacity = opacity
      })

      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [activeIndex])

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: `${posters.length * 100}vh` }}>
      {/* 3D Canvas Background (Sticky) */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-[#050010]">
        <div ref={canvasRef} className="absolute inset-0 w-full h-full" />
        
        {/* Overlay Content linked to activeIndex */}
        <div className="relative z-10 container mx-auto px-4 flex flex-col items-center lg:items-start pointer-events-none">
          <div className="max-w-md bg-black/40 backdrop-blur-xl p-8 rounded-[32px] border border-white/10 shadow-2xl transition-all duration-500 transform translate-y-0 opacity-100 pointer-events-auto">
            <span 
              className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white mb-4 block w-fit"
              style={{ background: posters[activeIndex].accent }}
            >
              {posters[activeIndex].category}
            </span>
            <h2 className="text-4xl font-black text-white mb-2">{posters[activeIndex].tagline}</h2>
            <div className="flex items-center gap-2 mb-4 text-white/60 text-sm">
              <MapPin size={14} /> {posters[activeIndex].city}
              <span className="mx-2">|</span>
              <Star size={14} className="text-amber-400 fill-amber-400" /> {posters[activeIndex].rating}
            </div>
            <p className="text-white/70 mb-6 leading-relaxed">
              {posters[activeIndex].description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-white">{posters[activeIndex].price}</span>
              <Link href={posters[activeIndex].href}>
                <button className="bg-white text-black px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform">
                  Book Service <ArrowRight size={16} />
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 animate-pulse">
           <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Scroll to Explore</span>
           <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </div>
    </div>
  )
}
