"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

/**
 * HeroScene – A massive particle vortex with 8 000 particles that swirl
 * around a central glowing torus knot. Mouse movement tilts the camera.
 * Used as the full-bleed background of the landing page hero section.
 */
export function HeroScene() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.shadowMap.enabled = true
    mount.appendChild(renderer.domElement)

    // ── Scene & Camera ────────────────────────────────────────────────────────
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 100)
    camera.position.set(0, 0, 18)

    // ── Lighting ──────────────────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0x6d28d9, 0.3)
    scene.add(ambientLight)

    const pointLight1 = new THREE.PointLight(0x8b5cf6, 3, 40)
    pointLight1.position.set(5, 5, 5)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0x06b6d4, 3, 40)
    pointLight2.position.set(-5, -5, 2)
    scene.add(pointLight2)

    const pointLight3 = new THREE.PointLight(0xf59e0b, 2, 30)
    pointLight3.position.set(0, 8, -5)
    scene.add(pointLight3)

    // ── Main torus knot (centrepiece) ─────────────────────────────────────────
    const torusKnotGeo = new THREE.TorusKnotGeometry(3.5, 0.9, 200, 24, 2, 3)
    const torusKnotMat = new THREE.MeshPhongMaterial({
      color: 0x7c3aed,
      emissive: 0x4c1d95,
      emissiveIntensity: 0.4,
      shininess: 120,
      transparent: true,
      opacity: 0.85,
      wireframe: false,
    })
    const torusKnot = new THREE.Mesh(torusKnotGeo, torusKnotMat)
    scene.add(torusKnot)

    // Wireframe overlay on top of the torus knot
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xa78bfa,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    })
    const wireKnot = new THREE.Mesh(torusKnotGeo, wireMat)
    scene.add(wireKnot)

    // ── Orbiting icosahedra ───────────────────────────────────────────────────
    const orbiters: THREE.Mesh[] = []
    const orbiterData = [
      { radius: 7, speed: 0.4, size: 0.5, color: 0x06b6d4, phase: 0 },
      { radius: 9, speed: 0.25, size: 0.8, color: 0xf59e0b, phase: Math.PI / 2 },
      { radius: 6, speed: 0.6, size: 0.4, color: 0xec4899, phase: Math.PI },
      { radius: 10, speed: 0.18, size: 1.0, color: 0x10b981, phase: Math.PI * 1.5 },
      { radius: 8, speed: 0.35, size: 0.6, color: 0xf97316, phase: Math.PI / 3 },
    ]

    orbiterData.forEach(({ size, color }) => {
      const geo = new THREE.IcosahedronGeometry(size, 0)
      const mat = new THREE.MeshPhongMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.5,
        shininess: 200,
        transparent: true,
        opacity: 0.9,
      })
      const mesh = new THREE.Mesh(geo, mat)
      scene.add(mesh)
      orbiters.push(mesh)
    })

    // ── Particle vortex (8 000 particles) ────────────────────────────────────
    const PARTICLE_COUNT = 8000
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const colors = new Float32Array(PARTICLE_COUNT * 3)
    const speeds = new Float32Array(PARTICLE_COUNT)
    const radii = new Float32Array(PARTICLE_COUNT)
    const heightPhases = new Float32Array(PARTICLE_COUNT)

    const palette = [
      new THREE.Color(0x7c3aed),
      new THREE.Color(0x06b6d4),
      new THREE.Color(0xf59e0b),
      new THREE.Color(0xec4899),
      new THREE.Color(0x10b981),
      new THREE.Color(0xa78bfa),
    ]

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2
      const r = 4 + Math.random() * 14
      const y = (Math.random() - 0.5) * 20

      positions[i * 3]     = Math.cos(angle) * r
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = Math.sin(angle) * r

      radii[i] = r
      speeds[i] = 0.05 + Math.random() * 0.3
      heightPhases[i] = Math.random() * Math.PI * 2

      const col = palette[Math.floor(Math.random() * palette.length)]
      colors[i * 3]     = col.r
      colors[i * 3 + 1] = col.g
      colors[i * 3 + 2] = col.b
    }

    const particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3))

    const particleMat = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // ── Angles array for particle rotation ────────────────────────────────────
    const angles = new Float32Array(PARTICLE_COUNT)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      angles[i] = Math.atan2(positions[i * 3 + 2], positions[i * 3])
    }

    // ── Mouse reactive camera tilt ────────────────────────────────────────────
    const mouse = { x: 0, y: 0 }
    const targetRot = { x: 0, y: 0 }

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener("mousemove", onMouseMove)

    // ── Resize ────────────────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener("resize", onResize)

    // ── Animation loop ────────────────────────────────────────────────────────
    let frameId: number
    const clock = new THREE.Clock()

    const animate = () => {
      frameId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Torus knot rotation
      torusKnot.rotation.x = t * 0.18
      torusKnot.rotation.y = t * 0.22
      wireKnot.rotation.x = t * 0.18
      wireKnot.rotation.y = t * 0.22

      // Pulsing emissive intensity
      ;(torusKnotMat as THREE.MeshPhongMaterial).emissiveIntensity = 0.35 + Math.sin(t * 1.5) * 0.2

      // Orbiting objects
      orbiterData.forEach(({ radius, speed, phase }, idx) => {
        const angle = t * speed + phase
        orbiters[idx].position.set(
          Math.cos(angle) * radius,
          Math.sin(angle * 0.7) * 2,
          Math.sin(angle) * radius
        )
        orbiters[idx].rotation.x = t * 1.2
        orbiters[idx].rotation.z = t * 0.8
      })

      // Particle vortex rotation
      const posArr = particleGeo.attributes.position.array as Float32Array
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        angles[i] += speeds[i] * 0.005
        const r = radii[i]
        posArr[i * 3]     = Math.cos(angles[i]) * r
        posArr[i * 3 + 2] = Math.sin(angles[i]) * r
        // subtle vertical drift
        posArr[i * 3 + 1] += Math.sin(t * speeds[i] + heightPhases[i]) * 0.002
      }
      particleGeo.attributes.position.needsUpdate = true

      // Smooth camera tilt following mouse
      targetRot.x += (mouse.y * 0.4 - targetRot.x) * 0.05
      targetRot.y += (mouse.x * 0.4 - targetRot.y) * 0.05
      camera.rotation.x = targetRot.x
      camera.rotation.y = targetRot.y

      // Gentle camera Z oscillation
      camera.position.z = 18 + Math.sin(t * 0.3) * 1.5

      // Animate point lights
      pointLight1.position.x = Math.sin(t * 0.5) * 8
      pointLight1.position.y = Math.cos(t * 0.4) * 6
      pointLight2.position.x = Math.cos(t * 0.35) * 8
      pointLight2.position.z = Math.sin(t * 0.45) * 8

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("resize", onResize)
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: "none" }}
    />
  )
}
