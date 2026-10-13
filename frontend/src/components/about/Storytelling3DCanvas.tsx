import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

interface Storytelling3DCanvasProps {
  scrollProgress: number // 0.0 to 1.0
  isReducedMotion?: boolean
}

export function Storytelling3DCanvas({ scrollProgress, isReducedMotion = false }: Storytelling3DCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [webglSupported, setWebglSupported] = useState<boolean>(true)
  const animFrameRef = useRef<number>(0)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)

  // Scene object groups
  const rootGroupRef = useRef<THREE.Group | null>(null)
  const cocoonGroupRef = useRef<THREE.Group | null>(null)
  const threadsGroupRef = useRef<THREE.Group | null>(null)
  const weaveGroupRef = useRef<THREE.Group | null>(null)
  const connectionGroupRef = useRef<THREE.Group | null>(null)
  const dustPointsRef = useRef<THREE.Points | null>(null)
  const lightGroupRef = useRef<THREE.Group | null>(null)

  // Interactive mouse tracking
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 })
  const progressLerpRef = useRef<number>(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // 1. Check WebGL availability
    const testCanvas = document.createElement('canvas')
    const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl')
    if (!gl) {
      setWebglSupported(false)
      return
    }

    // 2. Setup Three.js Scene, Camera, Renderer
    const width = container.clientWidth || window.innerWidth
    const height = container.clientHeight || window.innerHeight

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x0a0908, 0.038)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 0, 14)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.25
    rendererRef.current = renderer

    container.appendChild(renderer.domElement)

    // 3. Lighting setup (Atmospheric Amber, Golden, and Midnight Blue highlights)
    const lightGroup = new THREE.Group()
    const ambientLight = new THREE.AmbientLight(0x2a2218, 1.2)
    lightGroup.add(ambientLight)

    const mainGoldLight = new THREE.PointLight(0xd4af37, 3.5, 30, 1.2)
    mainGoldLight.position.set(4, 5, 6)
    lightGroup.add(mainGoldLight)

    const warmAmberLight = new THREE.PointLight(0xf59e0b, 2.5, 25, 1.5)
    warmAmberLight.position.set(-5, -3, 4)
    lightGroup.add(warmAmberLight)

    const coolRimLight = new THREE.DirectionalLight(0x50c7d1, 0.8)
    coolRimLight.position.set(0, 8, -6)
    lightGroup.add(coolRimLight)

    scene.add(lightGroup)
    lightGroupRef.current = lightGroup

    // 4. Root Master Group
    const rootGroup = new THREE.Group()
    scene.add(rootGroup)
    rootGroupRef.current = rootGroup

    // =========================================================================
    // SCENE 1: Sacred Golden Cocoon / Helical Warp Nucleus
    // =========================================================================
    const cocoonGroup = new THREE.Group()
    rootGroup.add(cocoonGroup)
    cocoonGroupRef.current = cocoonGroup

    // Create multiple intertwined golden filament rings/helices
    const threadMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.25,
      metalness: 0.85,
      emissive: 0x4a3a10,
      emissiveIntensity: 0.35,
    })

    const strandCount = 18
    for (let i = 0; i < strandCount; i++) {
      const curvePoints: THREE.Vector3[] = []
      const radius = 2.4 + Math.sin(i) * 0.4
      const turns = 2.5 + (i % 3) * 0.5
      const heightSpan = 5.0

      for (let j = 0; j <= 60; j++) {
        const t = j / 60
        const angle = t * Math.PI * 2 * turns + (i * (Math.PI * 2 / strandCount))
        const x = Math.cos(angle) * (radius * (1 - Math.abs(t - 0.5) * 0.8))
        const y = (t - 0.5) * heightSpan
        const z = Math.sin(angle) * (radius * (1 - Math.abs(t - 0.5) * 0.8))
        curvePoints.push(new THREE.Vector3(x, y, z))
      }

      const curve = new THREE.CatmullRomCurve3(curvePoints)
      const tubeGeo = new THREE.TubeGeometry(curve, 48, 0.024, 6, false)
      const mesh = new THREE.Mesh(tubeGeo, threadMaterial)
      cocoonGroup.add(mesh)
    }

    // Central glowing raw silk core
    const coreGeo = new THREE.IcosahedronGeometry(0.9, 3)
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      roughness: 0.1,
      metalness: 0.9,
      emissive: 0xd4af37,
      emissiveIntensity: 0.7,
      wireframe: true
    })
    const coreMesh = new THREE.Mesh(coreGeo, coreMat)
    cocoonGroup.add(coreMesh)

    // =========================================================================
    // SCENE 2: Longitudinal Yarn / Warp Thread Highway Traversing Space
    // =========================================================================
    const threadsGroup = new THREE.Group()
    rootGroup.add(threadsGroup)
    threadsGroupRef.current = threadsGroup

    const warpStrandsCount = 32
    const warpLines: THREE.Line[] = []
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xf3e5ab,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    })

    for (let i = 0; i < warpStrandsCount; i++) {
      const points: THREE.Vector3[] = []
      const angle = (i / warpStrandsCount) * Math.PI * 2
      const spreadR = 2.8 + Math.sin(i * 3) * 0.6

      for (let zStep = -15; zStep <= 15; zStep += 1.5) {
        // Subtle organic sine wave wave simulating loom shuttle vibrations
        const wave = Math.sin(zStep * 0.4 + i) * 0.25
        const px = Math.cos(angle) * spreadR + wave
        const py = Math.sin(angle) * spreadR * 0.6 + Math.cos(zStep * 0.3) * 0.2
        points.push(new THREE.Vector3(px, py, zStep))
      }

      const geo = new THREE.BufferGeometry().setFromPoints(points)
      const line = new THREE.Line(geo, lineMat)
      threadsGroup.add(line)
      warpLines.push(line)
    }

    // =========================================================================
    // SCENE 3: Interwoven Fabric Lattice Mesh (Warp & Weft Loom Grid)
    // =========================================================================
    const weaveGroup = new THREE.Group()
    rootGroup.add(weaveGroup)
    weaveGroupRef.current = weaveGroup

    const gridRows = 24
    const gridCols = 24
    const weaveMeshMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.35,
      metalness: 0.7,
      bumpScale: 0.05,
      side: THREE.DoubleSide
    })

    const weavePlaneGeo = new THREE.PlaneGeometry(8, 8, gridCols, gridRows)
    const weaveMesh = new THREE.Mesh(weavePlaneGeo, weaveMeshMat)
    weaveMesh.rotation.x = -Math.PI * 0.25
    weaveGroup.add(weaveMesh)

    // =========================================================================
    // SCENE 5: Triadic Nodal Convergence (Artisan, Consumer, Supplier Nodes)
    // =========================================================================
    const connectionGroup = new THREE.Group()
    rootGroup.add(connectionGroup)
    connectionGroupRef.current = connectionGroup

    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.8,
      metalness: 0.9,
      roughness: 0.1
    })

    // 3 Triad nodes (Artisan: Left, Customer: Right, Raw Materials: Top)
    const triadPositions = [
      new THREE.Vector3(-3.2, -1.2, 0), // Artisan
      new THREE.Vector3(3.2, -1.2, 0),  // Customer
      new THREE.Vector3(0, 3.0, 0)      // Raw Material Weaver
    ]

    triadPositions.forEach(pos => {
      const nodeMesh = new THREE.Mesh(new THREE.SphereGeometry(0.38, 24, 24), nodeMat)
      nodeMesh.position.copy(pos)
      connectionGroup.add(nodeMesh)

      // Surrounding pulse orbit ring
      const ringGeo = new THREE.RingGeometry(0.55, 0.62, 32)
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xd4af37,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5
      })
      const ringMesh = new THREE.Mesh(ringGeo, ringMat)
      ringMesh.position.copy(pos)
      connectionGroup.add(ringMesh)
    })

    // Connective Golden Spline Arcs
    for (let i = 0; i < triadPositions.length; i++) {
      const p1 = triadPositions[i]
      const p2 = triadPositions[(i + 1) % triadPositions.length]
      const mid = new THREE.Vector3()
        .addVectors(p1, p2)
        .multiplyScalar(0.5)
        .add(new THREE.Vector3(0, 0, 1.5))

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2)
      const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.04, 6, false)
      const arcMesh = new THREE.Mesh(tubeGeo, threadMaterial)
      connectionGroup.add(arcMesh)
    }

    // =========================================================================
    // Floating Atmospheric Zari Fiber Dust Particles
    // =========================================================================
    const dustCount = 350
    const dustGeo = new THREE.BufferGeometry()
    const dustPositions = new Float32Array(dustCount * 3)
    const dustScales = new Float32Array(dustCount)

    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 22
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 20
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 25
      dustScales[i] = Math.random() * 0.8 + 0.2
    }

    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3))

    const dustMat = new THREE.PointsMaterial({
      color: 0xfef08a,
      size: 0.07,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    })

    const dustPoints = new THREE.Points(dustGeo, dustMat)
    scene.add(dustPoints)
    dustPointsRef.current = dustPoints

    // 5. Pointer Tracking for Gentle Parallax
    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = -(e.clientY / window.innerHeight) * 2 + 1
      mouseRef.current.targetX = nx * 0.8
      mouseRef.current.targetY = ny * 0.6
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    // 6. Resize Handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return
      const w = container.clientWidth || window.innerWidth
      const h = container.clientHeight || window.innerHeight
      cameraRef.current.aspect = w / h
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(w, h)
    }

    window.addEventListener('resize', handleResize)

    // 7. Render Animation Loop
    const clock = new THREE.Clock()

    const animate = () => {
      const time = clock.getElapsedTime()

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05

      // Target scroll progress lerp for fluid spring responsiveness
      const currentProgress = progressLerpRef.current

      // Particle subtle drifting
      if (dustPointsRef.current) {
        dustPointsRef.current.rotation.y = time * 0.02
        dustPointsRef.current.rotation.x = Math.sin(time * 0.015) * 0.05
      }

      // Root group subtle mouse parallax tilt
      if (rootGroupRef.current && !isReducedMotion) {
        rootGroupRef.current.rotation.y = mouseRef.current.x * 0.2
        rootGroupRef.current.rotation.x = -mouseRef.current.y * 0.15
      }

      // =======================================================================
      // Dynamic Scene State Choreography Based on Scroll Progress (0.0 to 1.0)
      // =======================================================================
      // Scene 1: The Beginning (0.0 - 0.20)
      // Scene 2: The Thread (0.20 - 0.40)
      // Scene 3: The Weaving (0.40 - 0.60)
      // Scene 4: The Artisans (0.60 - 0.78)
      // Scene 5: The Connection (0.78 - 0.92)
      // Scene 6: The Future / Finale (0.92 - 1.00)

      if (cocoonGroupRef.current) {
        // Cocoon is prominent at start, unfolds and disperses as scroll moves past 0.25
        const cocoonOpacity = THREE.MathUtils.clamp(1.0 - (currentProgress - 0.1) * 3.5, 0, 1)
        cocoonGroupRef.current.visible = cocoonOpacity > 0.01
        cocoonGroupRef.current.rotation.y = time * 0.15 + currentProgress * Math.PI * 2
        cocoonGroupRef.current.rotation.z = Math.sin(time * 0.2) * 0.1
        const scaleVal = THREE.MathUtils.lerp(1.0, 2.2, Math.min(currentProgress * 3, 1))
        cocoonGroupRef.current.scale.setScalar(scaleVal)
        cocoonGroupRef.current.position.z = currentProgress * 8
      }

      if (threadsGroupRef.current) {
        // Warp threads become visible in Scene 2 (0.15 - 0.50)
        const threadsActive = currentProgress >= 0.12 && currentProgress <= 0.65
        threadsGroupRef.current.visible = threadsActive
        if (threadsActive) {
          // Threads flow through Z-space relative to scroll
          threadsGroupRef.current.rotation.z = currentProgress * Math.PI * 0.5 + time * 0.05
          threadsGroupRef.current.position.z = (currentProgress - 0.3) * 12
        }
      }

      if (weaveGroupRef.current) {
        // Weave lattice is visible around Scene 3 & 4 (0.35 - 0.75)
        const weaveActive = currentProgress >= 0.32 && currentProgress <= 0.75
        weaveGroupRef.current.visible = weaveActive
        if (weaveActive) {
          weaveGroupRef.current.rotation.y = time * 0.08 + (currentProgress - 0.4) * 1.5
          weaveGroupRef.current.position.y = Math.sin(time * 0.8) * 0.15
          // Undulating wave through vertices
          const pos = weavePlaneGeo.attributes.position
          for (let p = 0; p < pos.count; p++) {
            const vx = pos.getX(p)
            const vy = pos.getY(p)
            const waveZ = Math.sin(vx * 1.5 + time * 2) * Math.cos(vy * 1.5 + time * 2) * 0.28
            pos.setZ(p, waveZ)
          }
          pos.needsUpdate = true
        }
      }

      if (connectionGroupRef.current) {
        // Connection nodes active in Scene 5 (0.70 - 0.95)
        const connActive = currentProgress >= 0.68 && currentProgress <= 0.95
        connectionGroupRef.current.visible = connActive
        if (connActive) {
          connectionGroupRef.current.rotation.z = time * 0.1
          const pulse = 1.0 + Math.sin(time * 2.5) * 0.06
          connectionGroupRef.current.scale.setScalar(pulse)
        }
      }

      // Camera focal choreography
      if (cameraRef.current) {
        // Camera moves gently forward and reframes focal center
        const targetZ = THREE.MathUtils.lerp(14, 9, currentProgress)
        const targetY = THREE.MathUtils.lerp(0, -0.6, currentProgress)
        cameraRef.current.position.z += (targetZ - cameraRef.current.position.z) * 0.08
        cameraRef.current.position.y += (targetY - cameraRef.current.position.y) * 0.08
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current)
      }

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    // 8. Cleanup
    return () => {
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)

      if (rendererRef.current) {
        rendererRef.current.dispose()
        if (rendererRef.current.domElement && container.contains(rendererRef.current.domElement)) {
          container.removeChild(rendererRef.current.domElement)
        }
      }
    }
  }, [isReducedMotion])

  // Sync scrollProgress smoothly with lerping
  useEffect(() => {
    progressLerpRef.current = scrollProgress
  }, [scrollProgress])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden'
      }}
      aria-hidden="true"
    >
      {!webglSupported && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 50% 40%, rgba(212,175,55,0.18) 0%, rgba(10,9,8,0.98) 75%)',
            filter: 'contrast(1.1)'
          }}
        />
      )}
    </div>
  )
}
