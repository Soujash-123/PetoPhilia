"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"

const steps = [
  { step: "01", title: "Search & Filter",   desc: "Find services near you by type, price, rating, and more." },
  { step: "02", title: "Choose a Provider", desc: "Read reviews, view availability, and pick the perfect match." },
  { step: "03", title: "Book Instantly",    desc: "Select your date, add pet details, and confirm your booking." },
  { step: "04", title: "Enjoy & Review",    desc: "Get updates during the service and leave a review after." },
]

export function HowItWorks3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const [activeStep, setActiveStep] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return
    const container = canvasRef.current
    
    // Scene setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    // We update size on resize and instantly
    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000)
    camera.position.z = 15
    camera.position.y = 0

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)
    
    const pointLight = new THREE.PointLight(0xa78bfa, 3, 50)
    pointLight.position.set(2, 5, 5)
    scene.add(pointLight)
    
    // Create geometric objects for each step
    const stepObjects: THREE.Mesh[] = []
    const geometries = [
      new THREE.IcosahedronGeometry(1.5, 0), // Fetching / searching (many facets)
      new THREE.OctahedronGeometry(1.5, 0),  // Choosing (diamond like precision)
      new THREE.BoxGeometry(2, 2, 2),        // Booking (solid confirmation)
      new THREE.TorusGeometry(1, 0.5, 16, 32)// Enjoy (continuous loop/happiness)
    ]
    
    const colors = [0x8b5cf6, 0x0ea5e9, 0xf59e0b, 0x10b981]

    geometries.forEach((geo, i) => {
      // Wireframe overlay for a cool technical look
      const material = new THREE.MeshPhongMaterial({
        color: colors[i],
        emissive: colors[i],
        emissiveIntensity: 0.2,
        shininess: 100,
        flatShading: true,
        transparent: true,
        opacity: 0.8
      })
      
      const mesh = new THREE.Mesh(geo, material)
      
      // Wireframe core
      const wireMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.3 })
      const wireMesh = new THREE.Mesh(geo, wireMat)
      wireMesh.scale.set(1.02, 1.02, 1.02)
      mesh.add(wireMesh)
      
      // Position them vertically spaced
      mesh.position.y = -i * 10
      mesh.position.x = i % 2 === 0 ? -4 : 4 // Alternate left/right
      
      scene.add(mesh)
      stepObjects.push(mesh)
    })

    // Connect them with a line/path
    const pathPoints = stepObjects.map(obj => obj.position)
    const curve = new THREE.CatmullRomCurve3(pathPoints)
    const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.05, 8, false)
    const tubeMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.15 })
    const pathMesh = new THREE.Mesh(tubeGeo, tubeMat)
    scene.add(pathMesh)
    
    // Moving glowing orb along the path
    const orbGeo = new THREE.SphereGeometry(0.3, 16, 16)
    const orbMat = new THREE.MeshBasicMaterial({ color: 0xffffff })
    const orb = new THREE.Mesh(orbGeo, orbMat)
    const glowMat = new THREE.MeshBasicMaterial({ color: 0xa78bfa, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending })
    const glowOrb = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 16), glowMat)
    orb.add(glowOrb)
    scene.add(orb)

    // Scroll handling
    let currentScrollY = 0
    let targetScrollY = 0

    const handleScroll = () => {
      if (!containerRef.current) return
      
      const rect = containerRef.current.getBoundingClientRect()
      // We want progress from 0 to 1 as the container scrolls through the viewport
      const windowH = window.innerHeight
      const triggerTop = rect.top
      const containerH = rect.height
      
      // Start when top hits middle of screen, end when bottom hits middle
      const maxScroll = containerH - windowH
      let progress = -triggerTop / maxScroll
      progress = Math.max(0, Math.min(1, progress))
      
      targetScrollY = progress * (steps.length - 1)
      setScrollProgress(progress)
      
      const active = Math.min(steps.length - 1, Math.floor(progress * steps.length))
      setActiveStep(active)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Init

    // Animation Loop
    let frameId: number
    const clock = new THREE.Clock()

    const animate = () => {
      frameId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Smooth camera interpolation
      currentScrollY += (targetScrollY - currentScrollY) * 0.05
      
      camera.position.y = -currentScrollY * 10
      
      // Move orb along path
      const orbProgress = currentScrollY / (steps.length - 1)
      if (orbProgress >= 0 && orbProgress <= 1) {
        const pt = curve.getPoint(orbProgress)
        orb.position.copy(pt)
        pointLight.position.copy(pt)
        pointLight.position.z += 2
      }

      // Rotate objects
      stepObjects.forEach((obj, i) => {
        const distance = Math.abs(currentScrollY - i)
        
        // Spin faster when active
        const spinSpeed = distance < 0.5 ? 2.0 : 0.5
        obj.rotation.x += 0.01 * spinSpeed
        obj.rotation.y += 0.015 * spinSpeed
        
        // Scale and opacity up when active
        const scale = 1 + Math.max(0, 1 - distance * 1.5) * 0.5
        obj.scale.set(scale, scale, scale)
        
        const mat = obj.material as THREE.MeshPhongMaterial
        mat.opacity = 0.2 + Math.max(0, 1 - distance * 1.5) * 0.8
        mat.emissiveIntensity = Math.max(0, 1 - distance * 1.5) * 0.6
      })

      renderer.render(scene, camera)
    }
    
    animate()

    const handleResize = () => {
      if (!canvasRef.current) return
      const w = canvasRef.current.clientWidth
      const h = canvasRef.current.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(frameId)
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <section 
      ref={containerRef} 
      className="relative w-full bg-[#030008]" 
      style={{ height: `${steps.length * 100}vh` }} // Gives us long scroll space
    >
      <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden">
        
        {/* The 3D Canvas running as the dynamic background/object viewer */}
        <div ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />
        
        {/* Progress Bar (2D overlay) */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 h-1/2 w-1 bg-white/10 rounded-full z-10 hidden md:block">
           <div 
             className="w-full bg-violet-500 rounded-full transition-all duration-300"
             style={{ height: `${Math.max(5, scrollProgress * 100)}%` }}
           />
        </div>

        {/* Text Overlays linked to scroll */}
        <div className="container mx-auto px-4 relative z-10 w-full">
           {steps.map((item, i) => {
             const isActive = activeStep === i
             const isPassed = activeStep > i
             // Align opposite to the 3D shape (shape is right->left->right->left)
             const alignLeft = i % 2 !== 0

             return (
               <div 
                 key={item.step}
                 className={`absolute top-1/2 -translate-y-1/2 transition-all duration-700 ease-out flex flex-col w-full max-w-md
                   ${alignLeft ? 'left-4 md:left-24' : 'right-4 md:right-24'}
                 `}
                 style={{
                   opacity: isActive ? 1 : 0,
                   transform: isActive ? 'translateY(-50%)' : (isPassed ? 'translateY(-150%)' : 'translateY(50%)'),
                   pointerEvents: isActive ? 'auto' : 'none'
                 }}
               >
                 <div className={`flex flex-col ${alignLeft ? 'items-start text-left' : 'items-end text-right'}`}>
                   <span className="text-[120px] font-black text-transparent leading-none select-none opacity-20"
                         style={{ WebkitTextStroke: '2px rgba(255,255,255,0.8)' }}>
                     {item.step}
                   </span>
                   <div className={`bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl -mt-12 shadow-2xl relative`}>
                     <div className="absolute -top-3 -left-3 h-12 w-12 rounded-full bg-violet-600 blur-xl opacity-60" />
                     <h3 className="text-3xl font-black text-white mb-3">{item.title}</h3>
                     <p className="text-white/60 text-lg leading-relaxed">{item.desc}</p>
                   </div>
                 </div>
               </div>
             )
           })}
        </div>

        {/* Intro/Outro titles */}
        <div 
          className="absolute top-16 left-1/2 -translate-x-1/2 text-center transition-opacity duration-500 w-full px-4"
          style={{ opacity: scrollProgress < 0.1 ? 1 : 0 }}
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-2">How PetoPhilia Works</h2>
          <p className="text-white/50 text-lg">Scroll down to discover the process</p>
        </div>
        
      </div>
    </section>
  )
}
