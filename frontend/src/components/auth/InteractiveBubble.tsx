import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react'

interface InteractiveBubbleProps {
  children: React.ReactNode
  mode: 'login' | 'register' | 'forgot-password'
  className?: string
}

interface Point {
  x: number
  y: number
}

export function InteractiveBubble({ children, mode, className = '' }: InteractiveBubbleProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 480, height: 560 })
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5, active: false })
  const animFrameRef = useRef<number | null>(null)
  const pathRef = useRef<SVGPathElement | null>(null)
  const glowPathRef = useRef<SVGPathElement | null>(null)
  
  // Squash & stretch physics for state transitions
  const squashRef = useRef({ sx: 1, sy: 1, vx: 0, vy: 0 })
  const lastModeRef = useRef(mode)

  // Measure container dimensions
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setDimensions({
          width: Math.max(320, Math.round(rect.width)),
          height: Math.max(400, Math.round(rect.height)),
        })
      }
    }

    updateSize()
    const ro = new ResizeObserver(updateSize)
    if (containerRef.current) ro.observe(containerRef.current)
    window.addEventListener('resize', updateSize)

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', updateSize)
    }
  }, [])

  // Trigger squash & stretch when mode changes
  useEffect(() => {
    if (lastModeRef.current !== mode) {
      lastModeRef.current = mode
      // Initial elastic impulse on mode morph
      squashRef.current.sx = 1.05
      squashRef.current.sy = 0.94
      squashRef.current.vx = -0.04
      squashRef.current.vy = 0.05
    }
  }, [mode])

  // Mouse interaction handlers
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    mouseRef.current.targetX = Math.max(0, Math.min(1, x))
    mouseRef.current.targetY = Math.max(0, Math.min(1, y))
    mouseRef.current.active = true
  }, [])

  const handlePointerLeave = useCallback(() => {
    mouseRef.current.targetX = 0.5
    mouseRef.current.targetY = 0.5
    mouseRef.current.active = false
  }, [])

  // Generate smooth closed cubic Bezier path from control points
  const buildSmoothPath = useCallback((points: Point[]): string => {
    const len = points.length
    if (len < 3) return ''

    let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`

    for (let i = 0; i < len; i++) {
      const p0 = points[(i - 1 + len) % len]
      const p1 = points[i]
      const p2 = points[(i + 1) % len]
      const p3 = points[(i + 2) % len]

      // Catmull-Rom to Cubic Bezier conversion
      const cp1x = p1.x + (p2.x - p0.x) / 6
      const cp1y = p1.y + (p2.y - p0.y) / 6
      const cp2x = p2.x - (p3.x - p1.x) / 6
      const cp2y = p2.y - (p3.y - p1.y) / 6

      d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
    }

    return d + ' Z'
  }, [])

  // Dynamic perimeter animation loop
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const padding = 28 // padding to ensure the bubble does not clip
    const numPoints = 12

    const startTime = performance.now()

    const animate = (now: number) => {
      const elapsed = (now - startTime) * 0.001
      const w = dimensions.width
      const h = dimensions.height
      const cx = w / 2
      const cy = h / 2

      // Smooth mouse easing
      const m = mouseRef.current
      m.x += (m.targetX - m.x) * 0.08
      m.y += (m.targetY - m.y) * 0.08

      // Spring physics for squash & stretch
      const sq = squashRef.current
      const k = 0.12 // spring stiffness
      const d = 0.82 // damping
      const fx = -k * (sq.sx - 1)
      const fy = -k * (sq.sy - 1)
      sq.vx = (sq.vx + fx) * d
      sq.vy = (sq.vy + fy) * d
      sq.sx += sq.vx
      sq.sy += sq.vy

      // Base radius calculation
      const rx = (w / 2 - padding) * sq.sx
      const ry = (h / 2 - padding) * sq.sy

      // Calculate 12 perimeter points with organic harmonic waves
      const points: Point[] = []
      const waveAmp = prefersReducedMotion ? 0 : 5.5

      for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2
        // Superellipse-like distribution for a comfortable rounded rectangular container
        const cosA = Math.cos(angle)
        const sinA = Math.sin(angle)

        // Rounded box parametric curve
        const absCos = Math.abs(cosA)
        const absSin = Math.abs(sinA)

        // Superellipse power (n ~ 3.2 gives rounded soft squircle)
        const n = 3.2
        const rad = 1 / Math.pow(Math.pow(absCos, n) + Math.pow(absSin, n), 1 / n)
        
        let baseX = cx + cosA * rad * rx
        let baseY = cy + sinA * rad * ry

        if (!prefersReducedMotion) {
          // Harmonic wave lobes (inspired by Jesper Landberg's u_wave, u_orbit, u_breath)
          const harmonic1 = Math.sin(elapsed * 1.8 + angle * 2) * waveAmp
          const harmonic2 = Math.cos(elapsed * 2.4 - angle * 3) * (waveAmp * 0.6)
          const breath = Math.sin(elapsed * 1.2) * 2.5 // u_breath

          // Normal direction vector
          const nx = cosA
          const ny = sinA
          const totalWave = harmonic1 + harmonic2 + breath

          baseX += nx * totalWave
          baseY += ny * totalWave

          // Mouse magnetic bulge (inspired by Jesper Landberg's u_trail / ballShield)
          if (m.active) {
            const mxPx = m.x * w
            const myPx = m.y * h
            const dx = mxPx - baseX
            const dy = myPx - baseY
            const dist = Math.hypot(dx, dy)
            const maxDist = 200
            if (dist < maxDist) {
              const factor = (1 - dist / maxDist) * 9.5
              baseX += (dx / dist) * factor
              baseY += (dy / dist) * factor
            }
          }
        }

        points.push({ x: baseX, y: baseY })
      }

      const pathData = buildSmoothPath(points)
      if (pathRef.current) {
        pathRef.current.setAttribute('d', pathData)
      }
      if (glowPathRef.current) {
        glowPathRef.current.setAttribute('d', pathData)
      }

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [dimensions, buildSmoothPath])

  // Sparkle floating particles inside the bubble
  const sparkles = useMemo(() => {
    return Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      x: 15 + ((i * 37) % 70),
      y: 20 + ((i * 53) % 65),
      size: 2 + (i % 3) * 1.5,
      delay: i * 0.7,
      duration: 3 + (i % 4),
    }))
  }, [])

  return (
    <div
      ref={containerRef}
      className={`interactive-bubble-wrapper ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {/* SVG Fluid Organic Bubble Portal (Background & Rim) */}
      <svg
        className="interactive-bubble-svg"
        width={dimensions.width}
        height={dimensions.height}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        aria-hidden="true"
      >
        <defs>
          {/* Luminous Gold & Silk Iridescent Rim Gradient */}
          <linearGradient id="bubble-rim-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--gold, #D4AF37)" stopOpacity="0.85" />
            <stop offset="30%" stopColor="var(--brand-light, #F3E5AB)" stopOpacity="0.65" />
            <stop offset="70%" stopColor="var(--gold-deep, #9A7B23)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--gold, #D4AF37)" stopOpacity="0.9" />
          </linearGradient>

          {/* Frosted Silk Glass Fill Gradient */}
          <linearGradient id="bubble-fill-gradient" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="var(--bubble-fill-top, rgba(27, 24, 21, 0.75))" />
            <stop offset="50%" stopColor="var(--bubble-fill-mid, rgba(20, 18, 16, 0.85))" />
            <stop offset="100%" stopColor="var(--bubble-fill-bot, rgba(14, 12, 10, 0.92))" />
          </linearGradient>

          {/* Specular Ambient Glow Filter */}
          <filter id="bubble-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Internal Specular Crest Light */}
          <radialGradient id="bubble-crest" cx="40%" cy="15%" r="65%">
            <stop offset="0%" stopColor="rgba(255, 248, 220, 0.22)" />
            <stop offset="50%" stopColor="rgba(212, 175, 55, 0.06)" />
            <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
          </radialGradient>
        </defs>

        {/* Ambient Outer Halo Path */}
        <path
          ref={glowPathRef}
          fill="none"
          stroke="var(--gold, #D4AF37)"
          strokeWidth="6"
          strokeOpacity="0.2"
          filter="url(#bubble-glow)"
        />

        {/* Primary Liquid Bubble Body */}
        <path
          ref={pathRef}
          className="bubble-fluid-body"
          fill="url(#bubble-fill-gradient)"
          stroke="url(#bubble-rim-gold)"
          strokeWidth="1.8"
        />

        {/* Specular Light Crest Overlay */}
        <ellipse
          cx={dimensions.width * 0.45}
          cy={dimensions.height * 0.16}
          rx={dimensions.width * 0.38}
          ry={dimensions.height * 0.12}
          fill="url(#bubble-crest)"
          opacity="0.75"
        />
      </svg>

      {/* Floating Micro Gold Silk Particles */}
      <div className="bubble-sparkles-layer" aria-hidden="true">
        {sparkles.map(sp => (
          <span
            key={sp.id}
            className="bubble-sparkle"
            style={{
              left: `${sp.x}%`,
              top: `${sp.y}%`,
              width: `${sp.size}px`,
              height: `${sp.size}px`,
              animationDelay: `${sp.delay}s`,
              animationDuration: `${sp.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Form Content Safely Positioned Inside the Bubble */}
      <div className="bubble-content-container">
        {children}
      </div>
    </div>
  )
}
