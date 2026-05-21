'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'

class Particle {
  x: number
  y: number
  baseX: number
  baseY: number
  size: number
  colorTemplate: string

  constructor(x: number, y: number, colorTemplate: string) {
    this.x = x
    this.y = y
    this.baseX = x
    this.baseY = y
    this.size = 1.2 // Very small, elegant dots
    this.colorTemplate = colorTemplate
  }

  draw(ctx: CanvasRenderingContext2D, mouse: { x: number; y: number; radius: number }) {
    let dx = mouse.x - this.x
    let dy = mouse.y - this.y
    let distance = Math.sqrt(dx * dx + dy * dy)
    
    // Opacity: Invisible/Faint by default, lights up near the cursor
    let opacity = 0.03
    if (distance < mouse.radius) {
      // Closer to center = brighter (up to 0.8)
      opacity = 0.03 + (1 - (distance / mouse.radius)) * 0.6
    }

    ctx.fillStyle = this.colorTemplate.replace('OPACITY', opacity.toFixed(3))
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.closePath()
    ctx.fill()
  }

  update(mouse: { x: number; y: number; radius: number }, ctx: CanvasRenderingContext2D) {
    let dx = mouse.x - this.x
    let dy = mouse.y - this.y
    let distance = Math.sqrt(dx * dx + dy * dy)
    
    // Repel from cursor slightly
    if (distance < mouse.radius) {
      let forceDirectionX = dx / distance
      let forceDirectionY = dy / distance
      let maxDistance = mouse.radius
      let force = (maxDistance - distance) / maxDistance
      
      // Push distance multiplier
      let directionX = forceDirectionX * force * 4
      let directionY = forceDirectionY * force * 4
      
      this.x -= directionX
      this.y -= directionY
    } else {
      // Spring back to original position
      if (this.x !== this.baseX) {
        let dx = this.x - this.baseX
        this.x -= dx / 15
      }
      if (this.y !== this.baseY) {
        let dy = this.y - this.baseY
        this.y -= dy / 15
      }
    }

    this.draw(ctx, mouse)
  }
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { resolvedTheme } = useTheme()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if mobile to disable animations and save battery/CPU
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (isMobile) return // Don't run animation on mobile

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let particlesArray: Particle[] = []
    let animationFrameId: number

    const resize = () => {
      if (window.innerWidth < 768) return // handled by isMobile state
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      init()
    }

    // Huge radius for a smooth glow area
    const mouse = { x: -1000, y: -1000, radius: 200 }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.x
      mouse.y = e.y
    }
    
    const handleMouseLeave = () => {
      mouse.x = -1000
      mouse.y = -1000
    }

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    const init = () => {
      particlesArray = []
      
      // Royal Blue template (Dark mode uses lighter blue, Light mode uses deep blue)
      const colorTemplate = resolvedTheme === 'dark' 
        ? 'rgba(96, 165, 250, OPACITY)' // #60a5fa
        : 'rgba(37, 99, 235, OPACITY)'  // #2563eb
      
      const spacing = 35 // Distance between dots
      const cols = Math.floor(canvas.width / spacing)
      const rows = Math.floor(canvas.height / spacing)

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          // Add organic randomness to the grid so it's not rigidly uniform
          let x = (i * spacing) + (spacing / 2) + (Math.random() * 15 - 7.5)
          let y = (j * spacing) + (spacing / 2) + (Math.random() * 15 - 7.5)
          particlesArray.push(new Particle(x, y, colorTemplate))
        }
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update(mouse, ctx)
      }
      animationFrameId = requestAnimationFrame(animate)
    }

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    init()
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(animationFrameId)
    }
  }, [resolvedTheme, isMobile])

  if (isMobile) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  )
}
