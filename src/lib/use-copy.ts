import { useState } from 'react'

/** Copy-to-clipboard with a short-lived "copied" flag, keyed by the copied value. */
export function useCopy() {
  const [copied, setCopied] = useState<string | null>(null)

  const copy = (value: string) => {
    navigator.clipboard?.writeText(value)
    setCopied(value)
    window.setTimeout(() => setCopied((c) => (c === value ? null : c)), 1400)
  }

  return { copied, copy }
}
