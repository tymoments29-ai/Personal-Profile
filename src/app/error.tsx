'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCcw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-6 space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center">
        <AlertTriangle className="w-8 h-8 text-red-500" />
      </div>
      
      <div className="space-y-2">
        <h2 className="font-outfit text-2xl font-bold text-white">Something went wrong!</h2>
        <p className="text-[var(--muted-foreground)] max-w-md">
          An unexpected error occurred while loading this page. Please try again or navigate back home.
        </p>
      </div>

      <button
        onClick={() => reset()}
        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--gold)] text-black font-semibold hover:bg-[var(--gold-hover)] transition-colors"
      >
        <RefreshCcw className="w-4 h-4" />
        Try again
      </button>
    </div>
  )
}
