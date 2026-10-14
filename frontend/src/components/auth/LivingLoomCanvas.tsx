import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

interface LivingLoomCanvasProps {
  className?: string
}

/**
 * Creates a soft glowing radial particle texture for golden motes.
 */
function createParticleTexture(): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  gradient.addColorStop(0, 'rgba(255, 245, 205, 1.0)')
  gradient.addColorStop(0.2, 'rgba(243, 229, 171, 0.85)')
  gradient.addColorStop(0.5, 'rgba(212, 175, 55, 0.4)')
  gradient.addColorStop(1, 'rgba(212, 175, 55, 0)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 64, 64)

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

export function LivingLoomCanvas({ className = '' }: LivingLoomCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [webglSupported, setWebglSupported] = useState<boolean>(true)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Quick WebGL availability check
    try {
      const testCanvas = document.createElement('canvas')
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl')
      if (!gl) {
        setWebglSupported(false)
        return
      }
    } catch {
      setWebglSupported(false)
      return
    }

    const isMobile = window.innerWidth < 768
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // 1. Scene setup
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2('#14030B', 0.038)

    // 2. Camera setup
    const width = container.clientWidth || window.innerWidth
    const height = container.clientHeight || window.innerHeight
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 0, 14)

    // 3. Renderer setup
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isMobile,
        alpha: true,
        powerPreference: 'high-performance'
      })
      const maxDpr = isMobile ? 1.5 : 2
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr))
      renderer.setSize(width, height)
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.15
      container.appendChild(renderer.domElement)
    } catch (err) {
      console.warn('WebGL initialization failed, falling back to CSS luxury background:', err)
      setWebglSupported(false)
      return
    }

    // 4. Lighting - Cinematic Silk Atelier Palette
    // Ambient deep royal plum base
    const ambientLight = new THREE.AmbientLight('#260714', 1.8)
    scene.add(ambientLight)

    // Champagne gold key directional light (grazing top folds)
    const keyGoldLight = new THREE.DirectionalLight('#FFE8AB', 2.8)
    keyGoldLight.position.set(-9, 8, 7)
    scene.add(keyGoldLight)

    // Deep crimson / rich plum fill light (sculpting shadows)
    const plumFillLight = new THREE.DirectionalLight('#A31853', 2.0)
    plumFillLight.position.set(8, -6, 5)
    scene.add(plumFillLight)

    // Backlit gold zari rim light (enhancing weave contour)
    const rimGoldLight = new THREE.DirectionalLight('#D4AF37', 2.4)
    rimGoldLight.position.set(2, 9, -5)
    scene.add(rimGoldLight)

    // Subtle moving warm point light for glistening highlights
    const specularPointLight = new THREE.PointLight('#FFF0C7', 2.0, 32, 1.2)
    specularPointLight.position.set(-3, 3, 4)
    scene.add(specularPointLight)

    // 5. Grand Flowing Silk Drape (Primary Mesh)
    // Deep burgundy / rich plum / black cherry with champagne sheen
    const silkCols = 110
    const silkRows = 80
    const silkGeo = new THREE.PlaneGeometry(26, 17, silkCols, silkRows)
    const silkOrigPos = silkGeo.attributes.position.clone()

    const silkMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#3A071E'), // Rich royal mulberry silk
      emissive: new THREE.Color('#140209'),
      roughness: 0.38,
      metalness: 0.16,
      clearcoat: 0.58,
      clearcoatRoughness: 0.22,
      sheen: 1.0,
      sheenColor: new THREE.Color('#EAC665'), // Champagne gold zari luster
      sheenRoughness: 0.35,
      side: THREE.DoubleSide
    })

    const silkMesh = new THREE.Mesh(silkGeo, silkMat)
    silkMesh.position.set(0.5, -0.6, -1.8)
    silkMesh.rotation.x = -Math.PI * 0.26
    silkMesh.rotation.z = Math.PI * 0.07
    scene.add(silkMesh)

    // 6. Banarasi Zari Accent Ribbon (Secondary Weave)
    // Winding golden silk ribbon undulating through the space
    const ribbonCols = 90
    const ribbonRows = 16
    const ribbonGeo = new THREE.PlaneGeometry(22, 2.6, ribbonCols, ribbonRows)
    const ribbonOrigPos = ribbonGeo.attributes.position.clone()

    const ribbonMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#785215'),
      emissive: new THREE.Color('#3B2405'),
      roughness: 0.26,
      metalness: 0.72,
      clearcoat: 0.75,
      clearcoatRoughness: 0.2,
      sheen: 1.0,
      sheenColor: new THREE.Color('#FFF0A8'),
      side: THREE.DoubleSide
    })

    const ribbonMesh = new THREE.Mesh(ribbonGeo, ribbonMat)
    ribbonMesh.position.set(-1.2, 1.5, 0.4)
    ribbonMesh.rotation.x = -Math.PI * 0.2
    ribbonMesh.rotation.y = Math.PI * 0.08
    ribbonMesh.rotation.z = -Math.PI * 0.05
    scene.add(ribbonMesh)

    // 7. Background Gossamer Veil (Deep atmospheric layer)
    const veilGeo = new THREE.PlaneGeometry(32, 20, 40, 30)
    const veilOrigPos = veilGeo.attributes.position.clone()
    const veilMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#16030D'),
      roughness: 0.65,
      metalness: 0.1,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide
    })
    const veilMesh = new THREE.Mesh(veilGeo, veilMat)
    veilMesh.position.set(0, 0, -6.5)
    scene.add(veilMesh)

    // 8. Floating Golden Motes (Atmospheric Loom Embers)
    const particleTexture = createParticleTexture()
    const particleCount = 180
    const particleGeo = new THREE.BufferGeometry()
    const particlePositions = new Float32Array(particleCount * 3)
    const particleVelocities: { x: number; y: number; z: number; phase: number }[] = []

    for (let i = 0; i < particleCount; i++) {
      const px = (Math.random() - 0.5) * 22
      const py = (Math.random() - 0.5) * 16
      const pz = (Math.random() - 0.5) * 12 + 1
      particlePositions[i * 3] = px
      particlePositions[i * 3 + 1] = py
      particlePositions[i * 3 + 2] = pz

      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.003,
        y: 0.004 + Math.random() * 0.008,
        z: (Math.random() - 0.5) * 0.003,
        phase: Math.random() * Math.PI * 2
      })
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))

    const particleMat = new THREE.PointsMaterial({
      size: isMobile ? 0.38 : 0.48,
      map: particleTexture || undefined,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: new THREE.Color('#FFDF88')
    })

    const particlePoints = new THREE.Points(particleGeo, particleMat)
    scene.add(particlePoints)

    // 9. Interactive Pointer & Smooth Parallax Tracking
    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0
    }

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width
      const py = (e.clientY - rect.top) / rect.height
      mouse.targetX = (px - 0.5) * 2
      mouse.targetY = (py - 0.5) * 2
    }

    const handlePointerLeave = () => {
      mouse.targetX = 0
      mouse.targetY = 0
    }

    window.addEventListener('mousemove', handlePointerMove, { passive: true })
    document.addEventListener('mouseleave', handlePointerLeave)

    // 10. Responsive Resizing
    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth || window.innerWidth
      const h = container.clientHeight || window.innerHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    window.addEventListener('resize', handleResize)

    // 11. Animation Loop & Visibility Control
    let animId = 0
    const clock = new THREE.Clock()
    let isPageVisible = true

    const handleVisibilityChange = () => {
      isPageVisible = !document.hidden
      if (isPageVisible) {
        clock.getDelta() // discard elapsed background time
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    const baseSilkRotX = silkMesh.rotation.x
    const baseSilkRotZ = silkMesh.rotation.z

    const renderLoop = () => {
      animId = requestAnimationFrame(renderLoop)

      if (!isPageVisible) return

      clock.getDelta()
      const elapsed = clock.getElapsedTime()
      const speedFactor = prefersReducedMotion ? 0.12 : 1.0

      const t = elapsed * speedFactor

      // A. Smooth Parallax Damping
      mouse.x += (mouse.targetX - mouse.x) * 0.045
      mouse.y += (mouse.targetY - mouse.y) * 0.045

      const parallaxAmount = prefersReducedMotion ? 0.15 : 1.0
      camera.position.x = mouse.x * 1.3 * parallaxAmount
      camera.position.y = -mouse.y * 0.9 * parallaxAmount
      camera.lookAt(0, 0, 0)

      silkMesh.rotation.x = baseSilkRotX + mouse.y * 0.04 * parallaxAmount
      silkMesh.rotation.z = baseSilkRotZ + mouse.x * 0.05 * parallaxAmount

      // Subtle light oscillation
      specularPointLight.position.x = -3 + Math.sin(t * 0.5) * 2.5 + mouse.x * 1.5
      specularPointLight.position.y = 3 + Math.cos(t * 0.4) * 1.8 - mouse.y * 1.2

      // B. Grand Silk Drape Wave Physics
      const silkPos = silkGeo.attributes.position as THREE.BufferAttribute
      const origPos = silkOrigPos as THREE.BufferAttribute

      const vertexCount = origPos.count
      for (let i = 0; i < vertexCount; i++) {
        const x0 = origPos.getX(i)
        const y0 = origPos.getY(i)

        // Compound undulating fabric wave: broad drape + traveling silk ripples
        const wave1 = Math.sin(x0 * 0.22 + t * 0.72 + y0 * 0.14) * Math.cos(y0 * 0.26 + t * 0.54)
        const wave2 = Math.sin((x0 - y0) * 0.32 - t * 0.62) * 0.7
        const wave3 = Math.cos(x0 * 0.45 + y0 * 0.28 + t * 0.88) * 0.4
        const broadFold = Math.sin(x0 * 0.16 - y0 * 0.12) * 1.35
        const shimmerRipple = Math.sin(x0 * 1.1 + t * 1.3) * Math.cos(y0 * 1.0 + t * 1.1) * 0.09

        const zDisp = (wave1 * 2.2 + wave2 + wave3 + broadFold + shimmerRipple)
        const xDisp = x0 + Math.sin(y0 * 0.28 + t * 0.38) * 0.32
        const yDisp = y0 + Math.cos(x0 * 0.24 + t * 0.34) * 0.24

        silkPos.setXYZ(i, xDisp, yDisp, zDisp)
      }
      silkPos.needsUpdate = true
      silkGeo.computeVertexNormals()

      // C. Banarasi Ribbon Wave Physics
      const ribPos = ribbonGeo.attributes.position as THREE.BufferAttribute
      const ribOrig = ribbonOrigPos as THREE.BufferAttribute
      const ribCount = ribOrig.count
      for (let i = 0; i < ribCount; i++) {
        const x0 = ribOrig.getX(i)
        const y0 = ribOrig.getY(i)

        const rz = Math.sin(x0 * 0.36 + t * 1.15) * 1.6 + Math.cos(y0 * 0.6 + t * 0.85) * 0.75
        const rx = x0 + Math.sin(y0 * 0.4 + t * 0.55) * 0.28
        const ry = y0 + Math.cos(x0 * 0.32 + t * 0.48) * 0.35 + Math.sin(t * 0.6) * 0.3

        ribPos.setXYZ(i, rx, ry, rz)
      }
      ribPos.needsUpdate = true
      ribbonGeo.computeVertexNormals()

      // D. Background Veil Gentle Breathing
      const vPos = veilGeo.attributes.position as THREE.BufferAttribute
      const vOrig = veilOrigPos as THREE.BufferAttribute
      const vCount = vOrig.count
      for (let i = 0; i < vCount; i++) {
        const x0 = vOrig.getX(i)
        const y0 = vOrig.getY(i)
        const vz = Math.sin(x0 * 0.15 + t * 0.35) * Math.cos(y0 * 0.18 + t * 0.28) * 1.2
        vPos.setXYZ(i, x0, y0, vz)
      }
      vPos.needsUpdate = true

      // E. Golden Motes / Loom Particles
      const pArr = particleGeo.attributes.position.array as Float32Array
      for (let i = 0; i < particleCount; i++) {
        const vel = particleVelocities[i]
        const idx = i * 3

        pArr[idx + 1] += vel.y * (prefersReducedMotion ? 0.3 : 1.0)
        pArr[idx] += Math.sin(t * 0.8 + vel.phase) * 0.004
        pArr[idx + 2] += Math.cos(t * 0.6 + vel.phase) * 0.003

        // Wrap around vertically
        if (pArr[idx + 1] > 8.5) {
          pArr[idx + 1] = -8.5
          pArr[idx] = (Math.random() - 0.5) * 22
        }
      }
      particleGeo.attributes.position.needsUpdate = true

      renderer.render(scene, camera)
    }

    renderLoop()

    // 12. Cleanup GPU resources and listeners on unmount
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', handlePointerMove)
      document.removeEventListener('mouseleave', handlePointerLeave)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibilityChange)

      // Dispose geometries
      silkGeo.dispose()
      silkOrigPos.dispose()
      ribbonGeo.dispose()
      ribbonOrigPos.dispose()
      veilGeo.dispose()
      veilOrigPos.dispose()
      particleGeo.dispose()

      // Dispose materials & textures
      silkMat.dispose()
      ribbonMat.dispose()
      veilMat.dispose()
      particleMat.dispose()
      if (particleTexture) particleTexture.dispose()

      // Dispose renderer
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
      renderer.dispose()
      renderer.forceContextLoss()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`living-loom-canvas-host ${className}`}
      aria-hidden="true"
    >
      {!webglSupported && (
        <div className="living-loom-fallback-silk" />
      )}
    </div>
  )
}
