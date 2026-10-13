import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'

interface Storytelling3DCanvasProps {
  scrollProgress: number // 0.0 to 1.0
  isReducedMotion?: boolean
  theme?: 'light' | 'dark'
}

interface FilamentData {
  mesh: THREE.Mesh
  radius: number
  phaseOffset: number
  colorOffset: number
}

export function Storytelling3DCanvas({
  scrollProgress,
  isReducedMotion = false,
  theme: propTheme
}: Storytelling3DCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [webglSupported, setWebglSupported] = useState<boolean>(true)
  const animFrameRef = useRef<number>(0)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)

  // Track active theme ('light' or 'dark')
  const [activeTheme, setActiveTheme] = useState<'light' | 'dark'>(() => {
    if (propTheme) return propTheme
    return typeof document !== 'undefined' && document.documentElement.dataset.theme === 'light'
      ? 'light'
      : 'dark'
  })

  // Synchronize with propTheme if provided
  useEffect(() => {
    if (propTheme) {
      setActiveTheme(propTheme)
    }
  }, [propTheme])

  // Listen to DOM dataset.theme changes in real time
  useEffect(() => {
    if (typeof document === 'undefined') return
    const observer = new MutationObserver(() => {
      const current = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
      setActiveTheme(current)
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    })
    return () => observer.disconnect()
  }, [])

  // Scene object groups
  const rootGroupRef = useRef<THREE.Group | null>(null)
  const cocoonGroupRef = useRef<THREE.Group | null>(null)
  const threadBundleGroupRef = useRef<THREE.Group | null>(null)
  const weaveGroupRef = useRef<THREE.Group | null>(null)
  const weavePlaneGeoRef = useRef<THREE.PlaneGeometry | null>(null)
  const connectionGroupRef = useRef<THREE.Group | null>(null)
  const dustPointsRef = useRef<THREE.Points | null>(null)
  const lightGroupRef = useRef<THREE.Group | null>(null)

  // Interactive mouse tracking
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 })
  const progressLerpRef = useRef<number>(0)

  // Reference to 9 dynamic living thread filaments
  const filamentsRef = useRef<FilamentData[]>([])

  // Material references for live theme switching
  const materialsRef = useRef<{
    threadMaterial?: THREE.MeshStandardMaterial
    coreMaterial?: THREE.MeshStandardMaterial
    weaveMaterial?: THREE.MeshStandardMaterial
    nodeMaterial?: THREE.MeshStandardMaterial
    ringMaterial?: THREE.MeshBasicMaterial
    dustMaterial?: THREE.PointsMaterial
    ambientLight?: THREE.AmbientLight
    mainGoldLight?: THREE.PointLight
    coolRimLight?: THREE.DirectionalLight
  }>({})

  // Theme application helper
  const applyThemeToScene = useCallback((isLight: boolean) => {
    const scene = sceneRef.current
    if (!scene) return

    const mats = materialsRef.current

    if (isLight) {
      // Light mode: warm ivory/pearl parchment fog
      scene.fog = new THREE.FogExp2(0xfbf9f5, 0.022)

      if (mats.threadMaterial) {
        mats.threadMaterial.color.setHex(0x8a6d1e)
        mats.threadMaterial.emissive.setHex(0x281c04)
        mats.threadMaterial.emissiveIntensity = 0.2
        mats.threadMaterial.roughness = 0.32
        mats.threadMaterial.metalness = 0.55
      }
      if (mats.coreMaterial) {
        mats.coreMaterial.color.setHex(0x9a7b23)
        mats.coreMaterial.emissive.setHex(0x61480f)
        mats.coreMaterial.emissiveIntensity = 0.3
      }
      if (mats.weaveMaterial) {
        mats.weaveMaterial.color.setHex(0x8a6d1e)
        mats.weaveMaterial.roughness = 0.38
        mats.weaveMaterial.metalness = 0.5
      }
      if (mats.nodeMaterial) {
        mats.nodeMaterial.color.setHex(0x8a6d1e)
        mats.nodeMaterial.emissive.setHex(0x5a410b)
        mats.nodeMaterial.emissiveIntensity = 0.35
      }
      if (mats.ringMaterial) {
        mats.ringMaterial.color.setHex(0x9a7b23)
        mats.ringMaterial.opacity = 0.45
      }
      if (mats.dustMaterial) {
        mats.dustMaterial.color.setHex(0x9a7b23)
        mats.dustMaterial.opacity = 0.35
      }
      if (mats.ambientLight) {
        mats.ambientLight.color.setHex(0xfaf5ec)
        mats.ambientLight.intensity = 1.6
      }
      if (mats.mainGoldLight) {
        mats.mainGoldLight.color.setHex(0xa8862a)
        mats.mainGoldLight.intensity = 2.8
      }
    } else {
      // Dark mode: obsidian velvet fog
      scene.fog = new THREE.FogExp2(0x0a0908, 0.038)

      if (mats.threadMaterial) {
        mats.threadMaterial.color.setHex(0xd4af37)
        mats.threadMaterial.emissive.setHex(0x4a3a10)
        mats.threadMaterial.emissiveIntensity = 0.35
        mats.threadMaterial.roughness = 0.25
        mats.threadMaterial.metalness = 0.85
      }
      if (mats.coreMaterial) {
        mats.coreMaterial.color.setHex(0xfef08a)
        mats.coreMaterial.emissive.setHex(0xd4af37)
        mats.coreMaterial.emissiveIntensity = 0.7
      }
      if (mats.weaveMaterial) {
        mats.weaveMaterial.color.setHex(0xd4af37)
        mats.weaveMaterial.roughness = 0.35
        mats.weaveMaterial.metalness = 0.7
      }
      if (mats.nodeMaterial) {
        mats.nodeMaterial.color.setHex(0xd4af37)
        mats.nodeMaterial.emissive.setHex(0xf59e0b)
        mats.nodeMaterial.emissiveIntensity = 0.8
      }
      if (mats.ringMaterial) {
        mats.ringMaterial.color.setHex(0xd4af37)
        mats.ringMaterial.opacity = 0.5
      }
      if (mats.dustMaterial) {
        mats.dustMaterial.color.setHex(0xfef08a)
        mats.dustMaterial.opacity = 0.65
      }
      if (mats.ambientLight) {
        mats.ambientLight.color.setHex(0x2a2218)
        mats.ambientLight.intensity = 1.2
      }
      if (mats.mainGoldLight) {
        mats.mainGoldLight.color.setHex(0xd4af37)
        mats.mainGoldLight.intensity = 3.5
      }
    }
  }, [])

  // Re-apply theme when activeTheme state changes
  useEffect(() => {
    applyThemeToScene(activeTheme === 'light')
  }, [activeTheme, applyThemeToScene])

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

    // 3. Lighting setup
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

      for (let j = 0; j <= 48; j++) {
        const t = j / 48
        const angle = t * Math.PI * 2 * turns + (i * (Math.PI * 2 / strandCount))
        const x = Math.cos(angle) * (radius * (1 - Math.abs(t - 0.5) * 0.8))
        const y = (t - 0.5) * heightSpan
        const z = Math.sin(angle) * (radius * (1 - Math.abs(t - 0.5) * 0.8))
        curvePoints.push(new THREE.Vector3(x, y, z))
      }

      const curve = new THREE.CatmullRomCurve3(curvePoints)
      const tubeGeo = new THREE.TubeGeometry(curve, 36, 0.025, 6, false)
      const mesh = new THREE.Mesh(tubeGeo, threadMaterial)
      cocoonGroup.add(mesh)
    }

    // Central glowing raw silk core
    const coreGeo = new THREE.IcosahedronGeometry(0.9, 2)
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
    // SCENE 2: REBUILT LIVING THREAD SCENE (Multi-filament Physical Assembly)
    // 4 Stages: A (Loose Fibres) -> B (Tension) -> C (Plied Yarn) -> D (Weave Bridge)
    // =========================================================================
    const threadBundleGroup = new THREE.Group()
    rootGroup.add(threadBundleGroup)
    threadBundleGroupRef.current = threadBundleGroup

    const filaments: FilamentData[] = []
    const filamentCount = 9 // 1 central axis + 8 outer plies
    const filamentRadii = [0.052, 0.042, 0.038, 0.045, 0.036, 0.044, 0.040, 0.038, 0.046]

    for (let i = 0; i < filamentCount; i++) {
      // Create initial dummy curve to build initial tube mesh
      const dummyPoints = [
        new THREE.Vector3(0, 0, -12),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 12)
      ]
      const dummyCurve = new THREE.CatmullRomCurve3(dummyPoints)
      const tubeGeo = new THREE.TubeGeometry(dummyCurve, 40, filamentRadii[i], 8, false)
      const mesh = new THREE.Mesh(tubeGeo, threadMaterial)
      mesh.frustumCulled = false
      threadBundleGroup.add(mesh)

      filaments.push({
        mesh,
        radius: filamentRadii[i],
        phaseOffset: (i / (filamentCount - 1)) * Math.PI * 2,
        colorOffset: i * 0.1
      })
    }
    filamentsRef.current = filaments

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
    weavePlaneGeoRef.current = weavePlaneGeo
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

    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xd4af37,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5
    })

    const triadPositions = [
      new THREE.Vector3(-3.2, -1.2, 0), // Artisan
      new THREE.Vector3(3.2, -1.2, 0),  // Customer
      new THREE.Vector3(0, 3.0, 0)      // Raw Material Weaver
    ]

    triadPositions.forEach(pos => {
      const nodeMesh = new THREE.Mesh(new THREE.SphereGeometry(0.38, 20, 20), nodeMat)
      nodeMesh.position.copy(pos)
      connectionGroup.add(nodeMesh)

      const ringGeo = new THREE.RingGeometry(0.55, 0.62, 32)
      const ringMesh = new THREE.Mesh(ringGeo, ringMat)
      ringMesh.position.copy(pos)
      connectionGroup.add(ringMesh)
    })

    for (let i = 0; i < triadPositions.length; i++) {
      const p1 = triadPositions[i]
      const p2 = triadPositions[(i + 1) % triadPositions.length]
      const mid = new THREE.Vector3()
        .addVectors(p1, p2)
        .multiplyScalar(0.5)
        .add(new THREE.Vector3(0, 0, 1.5))

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2)
      const tubeGeo = new THREE.TubeGeometry(curve, 28, 0.04, 6, false)
      const arcMesh = new THREE.Mesh(tubeGeo, threadMaterial)
      connectionGroup.add(arcMesh)
    }

    // =========================================================================
    // Floating Atmospheric Zari Fiber Dust Particles
    // =========================================================================
    const dustCount = 300
    const dustGeo = new THREE.BufferGeometry()
    const dustPositions = new Float32Array(dustCount * 3)

    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 22
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 20
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 25
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

    // Store references for live theme updates
    materialsRef.current = {
      threadMaterial,
      coreMaterial: coreMat,
      weaveMaterial: weaveMeshMat,
      nodeMaterial: nodeMat,
      ringMaterial: ringMat,
      dustMaterial: dustMat,
      ambientLight,
      mainGoldLight,
      coolRimLight
    }

    // Apply active theme immediately
    applyThemeToScene(activeTheme === 'light')

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

      // Current scroll progress
      const currentProgress = progressLerpRef.current

      // Particle subtle drifting
      if (dustPointsRef.current) {
        dustPointsRef.current.rotation.y = time * 0.02
        dustPointsRef.current.rotation.x = Math.sin(time * 0.015) * 0.05
      }

      // Root group subtle mouse parallax tilt
      if (rootGroupRef.current && !isReducedMotion) {
        rootGroupRef.current.rotation.y = mouseRef.current.x * 0.18
        rootGroupRef.current.rotation.x = -mouseRef.current.y * 0.12
      }

      // =======================================================================
      // Dynamic Scene State Choreography Based on Scroll Progress (0.0 to 1.0)
      // =======================================================================

      // Scene 1: Sacred Cocoon
      if (cocoonGroupRef.current) {
        const cocoonOpacity = THREE.MathUtils.clamp(1.0 - (currentProgress - 0.08) * 4.0, 0, 1)
        cocoonGroupRef.current.visible = cocoonOpacity > 0.01
        if (cocoonGroupRef.current.visible) {
          cocoonGroupRef.current.rotation.y = time * 0.15 + currentProgress * Math.PI * 2
          cocoonGroupRef.current.rotation.z = Math.sin(time * 0.2) * 0.1
          const scaleVal = THREE.MathUtils.lerp(1.0, 1.8, Math.min(currentProgress * 3.5, 1))
          cocoonGroupRef.current.scale.setScalar(scaleVal)
          cocoonGroupRef.current.position.z = currentProgress * 8
        }
      }

      // =======================================================================
      // Scene 2: Rebuilt Living Thread Stage Progression
      // Active window: progress ~0.10 to ~0.42
      // =======================================================================
      if (threadBundleGroupRef.current) {
        const threadActive = currentProgress >= 0.09 && currentProgress <= 0.44
        threadBundleGroupRef.current.visible = threadActive

        if (threadActive) {
          // Normalized thread progress: 0.0 (Stage A: Loose Fibres) -> 1.0 (Stage D: Weave Bridge)
          const tThread = THREE.MathUtils.clamp((currentProgress - 0.12) / (0.36 - 0.12), 0, 1)

          // Stage A (0.0 - 0.25): Loose filaments widely dispersed
          // Stage B (0.25 - 0.55): Loom tension pulls filaments into spiral orbit
          // Stage C (0.55 - 0.85): Tight convergence into strong plied yarn rope
          // Stage D (0.85 - 1.0): Direct hand-off to the loom warp plane
          const spread = THREE.MathUtils.lerp(2.8, 0.32, Math.pow(tThread, 1.35))
          const twistTurns = THREE.MathUtils.lerp(0.5, 4.2, tThread)
          const waveSlack = (1 - Math.pow(tThread, 1.2)) * 0.45

          // Thread group position and gentle longitudinal movement
          threadBundleGroupRef.current.position.z = THREE.MathUtils.lerp(2, -2, tThread)
          threadBundleGroupRef.current.position.y = THREE.MathUtils.lerp(0.2, -0.1, tThread)
          threadBundleGroupRef.current.rotation.z = time * 0.1 + tThread * Math.PI * 0.8

          // Re-mesh each filament's tube geometry smoothly
          const filList = filamentsRef.current
          const numControlPts = 12

          for (let f = 0; f < filList.length; f++) {
            const fil = filList[f]
            const isCenter = f === 0
            const filAngle = isCenter ? 0 : ((f - 1) / 8) * Math.PI * 2
            const pts: THREE.Vector3[] = []

            for (let c = 0; c <= numControlPts; c++) {
              const u = c / numControlPts // 0.0 (back) to 1.0 (front)
              const z = THREE.MathUtils.lerp(-12, 12, u)

              // Angle along thread length increases with twistTurns
              const currentAngle = filAngle + (u * Math.PI * 2 * twistTurns)

              // Sine wave slack that flattens out as thread reaches Stage C/D
              const waveX = Math.sin(u * 9 + time * 1.8 + fil.phaseOffset) * waveSlack
              const waveY = Math.cos(u * 8 + time * 1.4 + fil.phaseOffset * 1.5) * waveSlack

              // In Stage D, guide formed thread directly toward loom warp alignment
              const alignToLoom = Math.pow(THREE.MathUtils.clamp((tThread - 0.75) * 4, 0, 1), 2)
              const targetX = (f % 2 === 0 ? 0.35 : -0.35) * (1 - alignToLoom)
              const targetY = (f % 3 === 0 ? 0.25 : -0.25) * (1 - alignToLoom)

              const x = (isCenter ? 0 : Math.cos(currentAngle) * spread) + waveX + targetX
              const y = (isCenter ? 0 : Math.sin(currentAngle) * spread * 0.8) + waveY + targetY

              pts.push(new THREE.Vector3(x, y, z))
            }

            // Dispose old geometry and assign updated curve tube
            const spline = new THREE.CatmullRomCurve3(pts)
            const oldGeo = fil.mesh.geometry
            const newGeo = new THREE.TubeGeometry(spline, 36, fil.radius, 6, false)
            fil.mesh.geometry = newGeo
            oldGeo.dispose()
          }
        }
      }

      // Scene 3: Weave lattice
      if (weaveGroupRef.current && weavePlaneGeoRef.current) {
        const weaveActive = currentProgress >= 0.32 && currentProgress <= 0.75
        weaveGroupRef.current.visible = weaveActive
        if (weaveActive) {
          weaveGroupRef.current.rotation.y = time * 0.08 + (currentProgress - 0.4) * 1.5
          weaveGroupRef.current.position.y = Math.sin(time * 0.8) * 0.15
          const pos = weavePlaneGeoRef.current.attributes.position
          for (let p = 0; p < pos.count; p++) {
            const vx = pos.getX(p)
            const vy = pos.getY(p)
            const waveZ = Math.sin(vx * 1.5 + time * 2) * Math.cos(vy * 1.5 + time * 2) * 0.28
            pos.setZ(p, waveZ)
          }
          pos.needsUpdate = true
        }
      }

      // Scene 5: Connection triad nodes
      if (connectionGroupRef.current) {
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

      // Dispose dynamic geometries and materials
      filamentsRef.current.forEach(f => {
        if (f.mesh.geometry) f.mesh.geometry.dispose()
      })

      if (rendererRef.current) {
        rendererRef.current.dispose()
        if (rendererRef.current.domElement && container.contains(rendererRef.current.domElement)) {
          container.removeChild(rendererRef.current.domElement)
        }
      }
    }
  }, [isReducedMotion, applyThemeToScene, activeTheme])

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
            background:
              activeTheme === 'light'
                ? 'radial-gradient(ellipse at 50% 40%, rgba(154,123,35,0.12) 0%, rgba(251,249,245,0.98) 75%)'
                : 'radial-gradient(ellipse at 50% 40%, rgba(212,175,55,0.18) 0%, rgba(10,9,8,0.98) 75%)',
            filter: 'contrast(1.05)'
          }}
        />
      )}
    </div>
  )
}
