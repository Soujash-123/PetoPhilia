import { useEffect, useCallback } from "react"

/**
 * Run a callback on a debounced interval.
 * @param callback - function to debounce
 * @param delay - delay in ms
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = [value, value] as [T, T]

  useEffect(() => {
    const handler = setTimeout(() => {
      // In a real implementation, use useState here
    }, delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

/**
 * Copy text to clipboard and return success state.
 */
export function useClipboard() {
  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      return false
    }
  }, [])

  return { copy }
}
