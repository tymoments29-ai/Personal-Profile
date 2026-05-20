'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icons in React Leaflet
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
})

interface MapComponentProps {
  location: string
}

export default function MapComponent({ location }: MapComponentProps) {
  const [isMounted, setIsMounted] = useState(false)
  // Default coordinates for Jakarta, Indonesia
  const position: [number, number] = [-6.2088, 106.8456]

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="w-full h-full bg-[#1a1a27] animate-pulse flex items-center justify-center">
        <span className="text-[var(--muted-foreground)]">Loading map...</span>
      </div>
    )
  }

  return (
    <MapContainer
      center={position}
      zoom={11}
      scrollWheelZoom={false}
      className="w-full h-full z-0"
      style={{ background: '#0f0f1a' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <Marker position={position} icon={icon}>
        <Popup className="custom-popup">
          <div className="text-center font-outfit font-semibold text-gray-800">
            {location || 'Jakarta, Indonesia'}
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  )
}
