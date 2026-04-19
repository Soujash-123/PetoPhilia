"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

/**
 * DNAHelix – A double-helix of 300 paired glowing spheres that rotates
 * and scrolls infinitely. Used as an ambient background in the CTA section.
 */
export function DNAHelix() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(55, mount.clientWidth / mount.clientHeight, 0.1, 200)
    camera.position.set(0, 0, 22)

    scene.add(new THREE.AmbientLight(0x7c3aed, 0.5))
    const pLight = new THREE.PointLight(0x06b6d4, 4, 60)
    pLight.position.set(0, 0, 10)
    scene.add(pLight)

    // ── Double helix ──────────────────────────────────────────────────────────
    const STEPS = 150
    const RADIUS = 4
    const HEIGHT = 30
    const PITCH = (Math.PI * 2 * 6) / STEPS // 6 full turns

    const strandA: THREE.Mesh[] = []
    const strandB: THREE.Mesh[] = []
    const connectors: THREE.Line[] = []

    const matA = new THREE.MeshPhongMaterial({ color: 0x7c3aed, emissive: 0x4c1d95, emissiveIntensity: 0.8, shininess: 200 })
    const matB = new THREE.MeshPhongMaterial({ color: 0x06b6d4, emissive: 0x0e7490, emissiveIntensity: 0.8, shininess: 200 })
    const connMat = new THREE.LineBasicMaterial({ color: 0xa78bfa, transparent: true, opacity: 0.4 })

    for (let i = 0; i < STEPS; i++) {
      const t = i / STEPS
      const angle = PITCH * i
      const y = (t - 0.5) * HEIGHT

      // Strand A
      const xA = Math.cos(angle) * RADIUS
      const zA = Math.sin(angle) * RADIUS
      const sphereA = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 10), matA.clone())
      sphereA.position.set(xA, y, zA)
      scene.add(sphereA)
      strandA.push(sphereA)

      // Strand B (offset by π)
      const xB = Math.cos(angle + Math.PI) * RADIUS
      const zB = Math.sin(angle + Math.PI) * RADIUS
      const sphereB = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 10), matB.clone())
      sphereB.position.set(xB, y, zB)
      scene.add(sphereB)
      strandB.push(sphereB)

      // Connector rung every ~4 steps
      if (i % 4 === 0) {
        const pts = [
          new THREE.Vector3(xA, y, zA),
          new THREE.Vector3(xB, y, zB),
        ]
        const connGeo = new THREE.BufferGeometry().setFromPoints(pts)
        const conn = new THREE.Line(connGeo, connMat.clone())
        scene.add(conn)
        connectors.push(conn)
      }
    }

    // ── Outer particle shell ───────────────────────────────────────────────────
    const shellCount = 3000
    const shellPos = new Float32Array(shellCount * 3)
    const shellColors = new Float32Array(shellCount * 3)
    const col1 = new THREE.Color(0x7c3aed)
    const col2 = new THREE.Color(0x06b6d4)

    for (let i = 0; i < shellCount; i++) {
      shellPos[i * 3]     = (Math.random() - 0.5) * 24
      shellPos[i * 3 + 1] = (Math.random() - 0.5) * 40
      shellPos[i * 3 + 2] = (Math.random() - 0.5) * 24
      const col = Math.random() > 0.5 ? col1 : col2
      shellColors[i * 3]     = col.r
      shellColors[i * 3 + 1] = col.g
      shellColors[i * 3 + 2] = col.b
    }

    const shellGeo = new THREE.BufferGeometry()
    shellGeo.setAttribute("position", new THREE.BufferAttribute(shellPos, 3))
    shellGeo.setAttribute("color", new THREE.BufferAttribute(shellColors, 3))
    const shellMat = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    scene.add(new THREE.Points(shellGeo, shellMat))

    // ── Mouse tilt ────────────────────────────────────────────────────────────
    const mouse = { x: 0, y: 0 }
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener("mousemove", onMouseMove)

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener("resize", onResize)

    let frameId: number
    const clock = new THREE.Clock()
    let camRotY = 0
    let camRotX = 0

    const animate = () => {
      frameId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Rotate the whole helix group
      const scrollSpeed = 0.15
      strandA.forEach((mesh, i) => {
        const base = (i / STEPS - 0.5) * HEIGHT
        const newY = ((base + t * scrollSpeed * HEIGHT + HEIGHT / 2) % HEIGHT) - HEIGHT / 2
        const angle = PITCH * i + t * 0.4
        mesh.position.y = newY
        mesh.position.x = Math.cos(angle) * RADIUS
        mesh.position.z = Math.sin(angle) * RADIUS

        const mat = mesh.material as THREE.MeshPhongMaterial
        mat.emissiveIntensity = 0.5 + Math.sin(t * 2 + i * 0.1) * 0.4
      })

      strandB.forEach((mesh, i) => {
        const base = (i / STEPS - 0.5) * HEIGHT
        const newY = ((base + t * scrollSpeed * HEIGHT + HEIGHT / 2) % HEIGHT) - HEIGHT / 2
        const angle = PITCH * i + Math.PI + t * 0.4
        mesh.position.y = newY
        mesh.position.x = Math.cos(angle) * RADIUS
        mesh.position.z = Math.sin(angle) * RADIUS

        const mat = mesh.material as THREE.MeshPhongMaterial
        mat.emissiveIntensity = 0.5 + Math.cos(t * 2 + i * 0.1) * 0.4
      })

      connectors.forEach((conn, idx) => {
        const i = idx * 4
        const base = (i / STEPS - 0.5) * HEIGHT
        const newY = ((base + t * scrollSpeed * HEIGHT + HEIGHT / 2) % HEIGHT) - HEIGHT / 2
        const angle = PITCH * i + t * 0.4
        const pts = [
          new THREE.Vector3(Math.cos(angle) * RADIUS, newY, Math.sin(angle) * RADIUS),
          new THREE.Vector3(Math.cos(angle + Math.PI) * RADIUS, newY, Math.sin(angle + Math.PI) * RADIUS),
        ]
        conn.geometry.setFromPoints(pts)

        const mat = conn.material as THREE.LineBasicMaterial
        mat.opacity = 0.2 + Math.sin(t + idx) * 0.2
      })

      // Camera smooth mouse follow
      camRotY += (mouse.x * 0.3 - camRotY) * 0.04
      camRotX += (-mouse.y * 0.2 - camRotX) * 0.04
      camera.rotation.y = camRotY
      camera.rotation.x = camRotX

      // Pulsing point light
      pLight.intensity = 3 + Math.sin(t * 2) * 1.5

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

  return <div ref={mountRef} className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }} />
}
