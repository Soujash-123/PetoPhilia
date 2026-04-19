"use client"

import { useState, useCallback } from "react"

interface UseDisclosureReturn {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

/**
 * Simple open/close/toggle disclosure hook — for modals, drawers, dropdowns.
 */
export function useDisclosure(initial = false): UseDisclosureReturn {
  const [isOpen, setIsOpen] = useState(initial)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((v) => !v), [])

  return { isOpen, open, close, toggle }
}
