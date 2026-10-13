import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface RingCanvas3DProps {
  className?: string
}

export function RingCanvas3D({ className = '' }: RingCanvas3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const animFrameRef = useRef<number | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // 1. Scene, Camera, Renderer Setup
    const scene = new THREE.Scene()

    const width = container.clientWidth || window.innerWidth
    const height = container.clientHeight || window.innerHeight
    const aspect = width / height

    // Responsive camera distance: generous negative space so ring frames content without clipping
    const getCameraZ = (asp: number) => {
      if (asp < 0.6) return 9.4  // tall phones
      if (asp < 1.0) return 8.6  // tablets / portrait
      return 6.6                 // desktop
    }

    const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100)
    camera.position.set(0, 0, getCameraZ(aspect))

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      })
    } catch (e) {
      console.warn('WebGL initialization failed:', e)
      return
    }

    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.25
    container.appendChild(renderer.domElement)

    // 2. High-Fidelity Custom Shader for the Organic 3D Ring
    // Recreates Jesper Landberg's molten liquid metal, chromatic dispersion, and fluid striations
    const vertexShader = `
      uniform float uTime;
      uniform vec2 uMouse;
      uniform float uAspect;
      
      varying vec3 vNormal;
      varying vec3 vWorldPosition;
      varying vec3 vViewPosition;
      varying vec2 vUv;
      varying float vDisplacement;
      varying float vTheta;
      varying float vPhi;

      void main() {
        vUv = uv;
        
        float rMajor = 3.25;
        float rXY = length(position.xy);
        float theta = atan(position.y, position.x);
        vTheta = theta;
        
        float phi = atan(position.z, rXY - rMajor);
        vPhi = phi;
        
        // --- 1. Seamless Integer Harmonic Waves (strictly 2pi-periodic, NO seam!) ---
        float wave1 = sin(theta * 2.0 + uTime * 0.65) * 0.22;
        float wave2 = cos(theta * 3.0 - uTime * 0.45) * 0.16;
        float wave3 = sin(theta * 4.0 + uTime * 0.85) * 0.08;
        float wave4 = cos(theta * 6.0 - uTime * 0.7) * 0.04;
        float totalMajorWave = wave1 + wave2 + wave3 + wave4;
        
        // --- 2. Sculptural Tube Thickness Modulation (Integer frequencies only) ---
        float thicknessMod = 1.0 
          + 0.32 * sin(theta * 1.0 + uTime * 0.38) 
          + 0.20 * cos(theta * 2.0 - uTime * 0.52)
          + 0.10 * sin(theta * 4.0 + uTime * 0.7);
          
        // --- 3. 3D Z-Axis Undulation (Curving gently into space) ---
        float zWave = sin(theta * 2.0 + uTime * 0.5) * 0.32
                    + cos(theta * 3.0 - uTime * 0.6) * 0.18;
                    
        // --- 4. Micro-Striations (Spun Silk & Gold Zari Thread Filaments) ---
        float threadStrands = sin(phi * 32.0 + theta * 4.0) * 0.024
                            + cos(phi * 64.0 - theta * 2.0) * 0.012;

        // --- 5. Interactive Mouse Spring Inertia ---
        vec2 mouseInfluence = uMouse * 0.35;
        float mouseAttract = dot(vec2(cos(theta), sin(theta)), mouseInfluence);
        
        // Final position calculation
        float radiusOffset = totalMajorWave + mouseAttract * 0.16;
        float newRXY = (rMajor + radiusOffset) + ((rXY - rMajor) * thicknessMod) + threadStrands;
        float newZ = (position.z * thicknessMod) + zWave + (mouseAttract * 0.12);
        
        vec3 displacedPos = vec3(
          cos(theta) * newRXY,
          sin(theta) * newRXY,
          newZ
        );

        vDisplacement = totalMajorWave + (thicknessMod - 1.0) * 0.5;

        // Perturbed normal calculation for dynamic specular glints
        vec3 displacedNormal = normalize(normal + vec3(
          -sin(theta) * wave1 * 0.45,
          cos(theta) * wave1 * 0.45,
          sin(phi * 32.0) * 0.15
        ));

        vNormal = normalize(normalMatrix * displacedNormal);
        
        vec4 worldPos = modelMatrix * vec4(displacedPos, 1.0);
        vWorldPosition = worldPos.xyz;
        
        vec4 mvPosition = viewMatrix * worldPos;
        vViewPosition = -mvPosition.xyz;
        
        gl_Position = projectionMatrix * mvPosition;
      }
    `

    const fragmentShader = `
      uniform float uTime;
      
      varying vec3 vNormal;
      varying vec3 vWorldPosition;
      varying vec3 vViewPosition;
      varying vec2 vUv;
      varying float vDisplacement;
      varying float vTheta;
      varying float vPhi;

      // Multi-spectral chromatic dispersion
      vec3 spectrum(float t) {
        vec3 a = vec3(0.5, 0.5, 0.5);
        vec3 b = vec3(0.5, 0.5, 0.5);
        vec3 c = vec3(1.0, 1.0, 1.0);
        vec3 d = vec3(0.0, 0.33, 0.67);
        return a + b * cos(6.28318 * (c * t + d));
      }

      void main() {
        vec3 N = normalize(vNormal);
        vec3 V = normalize(vViewPosition);
        vec3 R = reflect(-V, N);

        // 1. Fresnel & Viewing Angle
        float NdotV = max(dot(N, V), 0.0);
        float fresnel = pow(1.0 - NdotV, 2.2);
        float deepFresnel = pow(1.0 - NdotV, 4.5);

        // 2. High-Contrast Studio Environment Reflection
        // Key Light (Warm Champagne Gold)
        vec3 lightDir1 = normalize(vec3(0.65, 0.75, 0.9));
        float diff1 = max(dot(N, lightDir1), 0.0);
        vec3 H1 = normalize(lightDir1 + V);
        float spec1 = pow(max(dot(N, H1), 0.0), 40.0);
        float sharpSpec1 = pow(max(dot(N, H1), 0.0), 160.0);

        // Rim Light (Cool Platinum / Titanium)
        vec3 lightDir2 = normalize(vec3(-0.75, -0.4, 0.7));
        float diff2 = max(dot(N, lightDir2), 0.0);
        vec3 H2 = normalize(lightDir2 + V);
        float spec2 = pow(max(dot(N, H2), 0.0), 64.0);
        float sharpSpec2 = pow(max(dot(N, H2), 0.0), 220.0);

        // Bottom Reflection Light (Deep Antique Bronze)
        vec3 lightDir3 = normalize(vec3(0.0, -1.0, 0.4));
        float diff3 = max(dot(N, lightDir3), 0.0);

        // 3. Chromatic Dispersion (The Signature Jesper Landberg rainbow fringe!)
        float dispersionPhase = fresnel * 2.2 + dot(R, vec3(0.3, 0.8, 0.5)) * 0.7 + uTime * 0.035 + vDisplacement * 0.3;
        vec3 iridescentColor = spectrum(dispersionPhase);

        // 4. Thread Filament Striation Specular Sheen (Handloom Silk & Zari)
        float threadSheen = sin(vPhi * 32.0 + vTheta * 4.0) * 0.5 + 0.5;
        threadSheen = pow(threadSheen, 4.0) * 0.35;

        // 5. Molten Liquid Metal Alloy Palette
        // Matches the luxurious antique gold / champagne platinum / liquid chrome of the reference
        vec3 champagneGold = vec3(0.88, 0.76, 0.45);
        vec3 antiqueBronze = vec3(0.55, 0.42, 0.22);
        vec3 titaniumHighlight = vec3(0.98, 0.96, 0.92);
        vec3 deepDark = vec3(0.04, 0.035, 0.03);

        // Base metallic gradient
        vec3 baseAlloy = mix(antiqueBronze, champagneGold, clamp(N.y * 0.5 + 0.5 + vDisplacement * 0.25, 0.0, 1.0));
        baseAlloy = mix(deepDark, baseAlloy, clamp(NdotV * 1.35, 0.08, 1.0));

        // Specular ribbons & glints
        vec3 specularPass = titaniumHighlight * (spec1 * 0.85 + sharpSpec1 * 1.6 + spec2 * 0.7 + sharpSpec2 * 1.2);
        specularPass += champagneGold * (diff1 * 0.4 + diff2 * 0.25 + diff3 * 0.15);

        // Combine layers
        vec3 color = baseAlloy * 0.68 + specularPass;
        
        // Iridescent chromatic aberration along grazing edges and moving folds
        color = mix(color, iridescentColor * 1.45, fresnel * 0.82);
        color += iridescentColor * deepFresnel * 1.2;
        color += titaniumHighlight * threadSheen * (fresnel + 0.3);

        // Edge ambient fade
        float vignette = clamp(1.0 - length(vWorldPosition.xy) * 0.055, 0.0, 1.0);
        color *= vignette;

        gl_FragColor = vec4(color, 1.0);
      }
    `

    // High tessellation Torus Geometry for silky smooth surface
    const torusGeometry = new THREE.TorusGeometry(3.2, 0.72, 100, 240)

    const ringUniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uAspect: { value: aspect },
    }

    const ringMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: ringUniforms,
      side: THREE.DoubleSide,
    })

    const ringMesh = new THREE.Mesh(torusGeometry, ringMaterial)
    scene.add(ringMesh)

    // 3. Orbiting 3D Sculptural Shuttles with Polished Metallic Highlights
    const orbitingGroup = new THREE.Group()
    scene.add(orbitingGroup)

    interface OrbitObject {
      mesh: THREE.Mesh
      baseRadius: number
      angle: number
      speed: number
      zOffset: number
      rotSpeedX: number
      rotSpeedY: number
      rotSpeedZ: number
    }

    const orbitItems: OrbitObject[] = []

    // Spindle Lathe Geometry
    const spindlePoints: THREE.Vector2[] = []
    for (let i = 0; i <= 24; i++) {
      const t = (i / 24) * Math.PI
      const radius = Math.sin(t) * 0.24 * (1.0 - Math.pow(Math.cos(t) * 0.6, 2.0))
      const y = -0.6 + (i / 24) * 1.2
      spindlePoints.push(new THREE.Vector2(radius, y))
    }
    const spindleGeometry = new THREE.LatheGeometry(spindlePoints, 32)

    // Metallic material with antique gold sheen
    const spindleMaterial = new THREE.MeshStandardMaterial({
      color: 0x322818,
      metalness: 0.95,
      roughness: 0.18,
      emissive: 0xd4af37,
      emissiveIntensity: 0.15,
    })

    const orbitRadii = [2.5, 3.4, 2.7, 3.6]
    const orbitAngles = [0.3, 1.8, 3.5, 4.9]
    const orbitSpeeds = [0.18, -0.22, 0.25, -0.16]
    const orbitZ = [-0.6, 0.7, -0.4, 0.5]

    for (let i = 0; i < 4; i++) {
      const mesh = new THREE.Mesh(spindleGeometry, spindleMaterial)
      const scale = 0.55 + (i % 2) * 0.2
      mesh.scale.set(scale, scale * 1.15, scale)
      orbitingGroup.add(mesh)

      orbitItems.push({
        mesh,
        baseRadius: orbitRadii[i],
        angle: orbitAngles[i],
        speed: orbitSpeeds[i],
        zOffset: orbitZ[i],
        rotSpeedX: 0.4 + i * 0.2,
        rotSpeedY: 0.6 + i * 0.3,
        rotSpeedZ: 0.3 + i * 0.15,
      })
    }

    // Studio Lights for Orbiting Elements
    const ambientLight = new THREE.AmbientLight(0x3a3020, 1.4)
    scene.add(ambientLight)

    const goldKeyLight = new THREE.PointLight(0xd4af37, 5.0, 25)
    goldKeyLight.position.set(3, 4, 5)
    scene.add(goldKeyLight)

    const coolRimLight = new THREE.PointLight(0x50c7d1, 3.5, 25)
    coolRimLight.position.set(-4, -2, 4)
    scene.add(coolRimLight)

    // 4. Mouse Tracking with Damped Physics
    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
    }

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0
      let clientY = 0

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
      } else if ('clientX' in e) {
        clientX = (e as MouseEvent).clientX
        clientY = (e as MouseEvent).clientY
      }

      const rect = container.getBoundingClientRect()
      const nx = ((clientX - rect.left) / rect.width) * 2 - 1
      const ny = -(((clientY - rect.top) / rect.height) * 2 - 1)

      mouse.targetX = Math.max(-1, Math.min(1, nx))
      mouse.targetY = Math.max(-1, Math.min(1, ny))
    }

    window.addEventListener('mousemove', handlePointerMove, { passive: true })
    window.addEventListener('touchmove', handlePointerMove, { passive: true })

    // 5. Responsive Resize Handling
    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth || window.innerWidth
      const h = container.clientHeight || window.innerHeight
      const asp = w / h

      camera.aspect = asp
      camera.position.z = getCameraZ(asp)
      camera.updateProjectionMatrix()

      renderer.setSize(w, h)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      ringUniforms.uAspect.value = asp
    }

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container)
    window.addEventListener('resize', handleResize)

    // 6. Animation Loop
    const clock = new THREE.Clock()

    const animate = () => {
      const elapsedTime = clock.getElapsedTime()
      const delta = clock.getDelta()

      // Damped mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.05
      mouse.y += (mouse.targetY - mouse.y) * 0.05

      if (!prefersReducedMotion) {
        ringUniforms.uTime.value = elapsedTime
        ringMesh.rotation.z = elapsedTime * 0.05
        ringMesh.rotation.x = -mouse.y * 0.22 + Math.sin(elapsedTime * 0.35) * 0.08
        ringMesh.rotation.y = mouse.x * 0.26 + Math.cos(elapsedTime * 0.4) * 0.08
      } else {
        ringUniforms.uTime.value = 1.5
        ringMesh.rotation.x = 0
        ringMesh.rotation.y = 0
        ringMesh.rotation.z = 0
      }
      ringUniforms.uMouse.value.set(mouse.x, mouse.y)

      // Animate Orbiting Shuttles
      orbitItems.forEach(item => {
        if (!prefersReducedMotion) {
          item.angle += item.speed * delta
          const curRadius = item.baseRadius + Math.sin(elapsedTime * 0.6 + item.angle) * 0.25
          const x = Math.cos(item.angle) * curRadius
          const y = Math.sin(item.angle) * curRadius
          const z = item.zOffset + Math.sin(elapsedTime * 0.8 + item.angle) * 0.4

          item.mesh.position.set(x, y, z)
          item.mesh.rotation.x += item.rotSpeedX * delta
          item.mesh.rotation.y += item.rotSpeedY * delta
          item.mesh.rotation.z += item.rotSpeedZ * delta
        } else {
          item.mesh.position.set(
            Math.cos(item.angle) * item.baseRadius,
            Math.sin(item.angle) * item.baseRadius,
            item.zOffset
          )
        }
      })

      renderer.render(scene, camera)
      animFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    // 7. Cleanup on Unmount
    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current)
      }
      window.removeEventListener('mousemove', handlePointerMove)
      window.removeEventListener('touchmove', handlePointerMove)
      window.removeEventListener('resize', handleResize)
      resizeObserver.disconnect()

      torusGeometry.dispose()
      ringMaterial.dispose()
      spindleGeometry.dispose()
      spindleMaterial.dispose()
      renderer.dispose()

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`ring-canvas-3d-wrapper ${className}`}
      aria-hidden="true"
    />
  )
}
