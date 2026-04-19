"use client"

import { useState, useEffect, useRef } from "react"
import { Provider } from "@/types"
import { mockProviders } from "@/lib/mock-data"

interface UseProvidersOptions {
  serviceType?: string
  query?: string
}

/**
 * Simulates an async fetch of providers with loading/error states.
 * Swap the mock with a real API call when the backend is ready.
 */
export function useProviders(options: UseProvidersOptions = {}) {
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true
    setLoading(true)
    setError(null)

    const timeout = setTimeout(() => {
      if (!isMounted.current) return
      try {
        let data = [...mockProviders]
        if (options.serviceType) {
          data = data.filter((p) => p.services.some((s) => s.type === options.serviceType))
        }
        if (options.query) {
          const q = options.query.toLowerCase()
          data = data.filter(
            (p) => p.businessName.toLowerCase().includes(q) || p.bio.toLowerCase().includes(q)
          )
        }
        setProviders(data)
      } catch (err) {
        setError("Failed to load providers. Please try again.")
      } finally {
        setLoading(false)
      }
    }, 400) // simulate network latency

    return () => {
      isMounted.current = false
      clearTimeout(timeout)
    }
  }, [options.serviceType, options.query])

  return { providers, loading, error }
}
