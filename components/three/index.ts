"use client"

import dynamic from "next/dynamic"

/**
 * Heavy Three.js scenes loaded without SSR to prevent hydration errors.
 */
export const HeroSceneLazy = dynamic(
  () => import("./hero-scene").then((m) => m.HeroScene),
  { ssr: false }
)

export const FloatingOrbsLazy = dynamic(
  () => import("./floating-orbs").then((m) => m.FloatingOrbs),
  { ssr: false }
)

export const DNAHelixLazy = dynamic(
  () => import("./dna-helix").then((m) => m.DNAHelix),
  { ssr: false }
)

/**
 * Client components that use Three.js internally.
 */
export { PetPosterShowcase } from "./pet-poster-showcase"

export const ScrollShowcase3D = dynamic(
  () => import("./scroll-showcase-3d").then((m) => m.ScrollShowcase3D),
  { ssr: false }
)

export const HowItWorks3D = dynamic(
  () => import("./how-it-works-3d").then((m) => m.HowItWorks3D),
  { ssr: false }
)
