import Link from 'next/link'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-6">
      <h2 className="font-outfit text-6xl font-bold text-white mb-2">404</h2>
      
      <div className="space-y-2">
        <h3 className="font-outfit text-2xl font-bold text-[var(--gold)]">Page Not Found</h3>
        <p className="text-[var(--muted-foreground)] max-w-md">
          The page you are looking for doesn't exist or has been moved.
        </p>
      </div>

      <Link
        href="/"
        className="flex items-center gap-2 px-6 py-2.5 rounded-xl glass text-white font-semibold hover:bg-white/10 transition-colors mt-4"
      >
        <Home className="w-4 h-4" />
        Return Home
      </Link>
    </div>
  )
}
