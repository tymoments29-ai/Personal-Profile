import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findFirst()
    const url = settings?.profilePhotoUrl

    if (!url) {
      return new NextResponse('Not found', { status: 404 })
    }

    // Fetch the image from the blob storage
    const response = await fetch(url)
    if (!response.ok) {
      return new NextResponse('Error fetching image', { status: 500 })
    }

    // Return the image buffer directly with the correct content type
    const buffer = await response.arrayBuffer()
    const contentType = response.headers.get('content-type') || 'image/png'

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200',
      },
    })
  } catch (error) {
    console.error('OG Image Error:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
