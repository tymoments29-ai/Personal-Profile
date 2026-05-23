import { redirect } from 'next/navigation'

// Root page: hard redirect to /en/about as fallback
// (next-intl middleware normally handles this, this is a safety net)
export default function RootPage() {
  redirect('/en/about')
}
