"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

/**
 * FloatingOrbs – Six large translucent spheres that drift through 3D space
 * and react to mouse proximity with repulsion. Used in the category section.
 */
export function FloatingOrbs() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const W = mount.clientWidth
    const H = mount.clientHeight

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H)
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 200)
    camera.position.z = 20

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.4))
    const dirLight = new THREE.DirectionalLight(0x8b5cf6, 2)
    dirLight.position.set(5, 10, 5)
    scene.add(dirLight)

    // ── Orb data ──────────────────────────────────────────────────────────────
    const orbConfig = [
      { color: 0x7c3aed, emissive: 0x4c1d95, size: 2.8, pos: [-6, 2, 0]  },
      { color: 0x06b6d4, emissive: 0x0e7490, size: 2.0, pos: [4, -1, -2]  },
      { color: 0xf59e0b, emissive: 0xb45309, size: 1.5, pos: [0, 3, -4]   },
      { color: 0xec4899, emissive: 0x9d174d, size: 1.8, pos: [-3, -3, 1]  },
      { color: 0x10b981, emissive: 0x065f46, size: 2.2, pos: [7, 1, -1]   },
      { color: 0xa78bfa, emissive: 0x6d28d9, size: 1.2, pos: [-8, 0, -2]  },
    ]

    interface OrbState {
      mesh: THREE.Mesh
      velocity: THREE.Vector3
      basePos: THREE.Vector3
    }

    const orbs: OrbState[] = []

    orbConfig.forEach(({ color, emissive, size, pos }) => {
      const geo = new THREE.SphereGeometry(size, 64, 64)
      const mat = new THREE.MeshPhongMaterial({
        color,
        emissive,
        emissiveIntensity: 0.5,
        shininess: 180,
        transparent: true,
        opacity: 0.55,
        wireframe: false,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(...(pos as [number, number, number]))
      scene.add(mesh)

      // Inner glow sphere
      const glowGeo = new THREE.SphereGeometry(size * 1.15, 32, 32)
      const glowMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.08,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      const glow = new THREE.Mesh(glowGeo, glowMat)
      mesh.add(glow)

      orbs.push({
        mesh,
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          0
        ),
        basePos: new THREE.Vector3(...(pos as [number, number, number])),
      })
    })

    // ── Mouse repulsion ────────────────────────────────────────────────────────
    const mouse3D = new THREE.Vector3()
    const raycaster = new THREE.Raycaster()
    const mouseNDC = new THREE.Vector2()

    const onMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect()
      mouseNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouseNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(mouseNDC, camera)
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
      raycaster.ray.intersectPlane(plane, mouse3D)
    }
    mount.addEventListener("mousemove", onMouseMove)

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener("resize", onResize)

    let frameId: number
    const clock = new THREE.Clock()

    const animate = () => {
      frameId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      orbs.forEach(({ mesh, velocity, basePos }, i) => {
        // Gentle Perlin-like bobbing
        const bx = basePos.x + Math.sin(t * 0.3 + i * 1.3) * 1.5
        const by = basePos.y + Math.cos(t * 0.25 + i * 0.9) * 1.2

        // Pull toward base position
        mesh.position.x += (bx - mesh.position.x) * 0.01
        mesh.position.y += (by - mesh.position.y) * 0.01

        // Mouse repulsion
        const dx = mesh.position.x - mouse3D.x
        const dy = mesh.position.y - mouse3D.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 5) {
          const force = (5 - dist) / 5
          mesh.position.x += (dx / dist) * force * 0.15
          mesh.position.y += (dy / dist) * force * 0.15
        }

        // Slow rotation
        mesh.rotation.x = t * (0.08 + i * 0.01)
        mesh.rotation.y = t * (0.12 + i * 0.015)

        // Dynamic emissive pulse
        const mat = mesh.material as THREE.MeshPhongMaterial
        mat.emissiveIntensity = 0.4 + Math.sin(t * 1.2 + i) * 0.25
      })

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(frameId)
      mount.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("resize", onResize)
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }} />
}
