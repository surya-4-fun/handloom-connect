import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import handloomLogoEmblem from '../../assets/images/handloom-logo-emblem.png';
import {
  Renderer,
  Camera,
  Transform,
  Plane,
  Triangle,
  Program,
  Mesh,
  Texture,
  RenderTarget,
  Vec3
} from '../../utils/webgl/ogl';
import { ProjectPopup } from './ProjectPopup';

interface CardData {
  id: string;
  title: string;
  detail: string;
  src: string;
  lg: string;
  to: string;
  accent: number[]; // RGB color for page pagination line indicators
  w: number;
  h: number;
}

const CARDS_DATA: CardData[] = [
  {
    id: 'indigo-throw',
    title: 'Heritage Kanchipuram Silk',
    detail: 'Artisan Craft · Leela Raman · Tamil Nadu',
    src: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop',
    lg: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop',
    to: '/marketplace',
    accent: [0.784, 0.635, 0.298],
    w: 1200,
    h: 800
  },
  {
    id: 'tussar-stole',
    title: 'Handspun Tussar Silk Stole',
    detail: 'Branding & Craft · Meera Devi · Bhagalpur',
    src: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200&auto=format&fit=crop',
    lg: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200&auto=format&fit=crop',
    to: '/marketplace',
    accent: [0.884, 0.535, 0.298],
    w: 1200,
    h: 800
  },
  {
    id: 'table-linen',
    title: 'Master Weaver at Loom',
    detail: 'Loom Craftsmanship · Sutradhar Collective · Bengal',
    src: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=1200&auto=format&fit=crop',
    lg: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=1200&auto=format&fit=crop',
    to: '/artisans',
    accent: [0.484, 0.635, 0.598],
    w: 1200,
    h: 800
  },
  {
    id: 'kanchipuram',
    title: 'Banarasi Zari Heirloom',
    detail: 'Royal Brocade · Varanasi Weavers · UP',
    src: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1200&auto=format&fit=crop',
    lg: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1200&auto=format&fit=crop',
    to: '/marketplace',
    accent: [0.854, 0.435, 0.398],
    w: 1200,
    h: 800
  },
  {
    id: 'natural-dyes',
    title: 'Natural Indigo Vat Dyeing',
    detail: 'Organic Craft · Nila Workshop · Gujarat',
    src: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=1200&auto=format&fit=crop',
    lg: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=1200&auto=format&fit=crop',
    to: '/materials',
    accent: [0.384, 0.635, 0.798],
    w: 1200,
    h: 800
  },
  {
    id: 'wool-carpet',
    title: 'Pure Kashmiri Pashmina',
    detail: 'Hand-spun Weave · Srinagar Artisans · Kashmir',
    src: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop',
    lg: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop',
    to: '/artisans',
    accent: [0.684, 0.535, 0.498],
    w: 1200,
    h: 800
  },
  {
    id: 'jamdani-saree',
    title: 'Fine Bengal Jamdani',
    detail: 'Muslin Craft · Phulia Weavers · Bengal',
    src: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=1200&auto=format&fit=crop',
    lg: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=1200&auto=format&fit=crop',
    to: '/marketplace',
    accent: [0.784, 0.635, 0.298],
    w: 1200,
    h: 800
  },
  {
    id: 'pashmina-shawl',
    title: 'Chanderi Gold Textile',
    detail: 'Sheer Zari Weave · Chanderi Atelier · MP',
    src: 'https://images.unsplash.com/photo-1601244005535-a48d21d951ac?q=80&w=1200&auto=format&fit=crop',
    lg: 'https://images.unsplash.com/photo-1601244005535-a48d21d951ac?q=80&w=1200&auto=format&fit=crop',
    to: '/marketplace',
    accent: [0.984, 0.735, 0.498],
    w: 1200,
    h: 800
  }
];

// Shaders matching agencidev's premium card & refraction filters
const cardVertexShader = `
  attribute vec3 position;
  attribute vec2 uv;
  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uScrollSpeed;
  varying vec2 vUv;
  #define PI 3.14159265359
  void main() {
    vUv = uv;
    vec3 world = (modelMatrix * vec4(position, 1.0)).xyz;
    vec3 p = position;
    // gentle cylindrical bend across the card's width
    p.z = sin(uv.x * PI) * 0.25;
    vec4 view = viewMatrix * (modelMatrix * vec4(p, 1.0));
    // parabola over world height -> bows the column sideways into the diagonal sweep
    view.x += world.y * world.y * 0.08;
    // scroll-speed skew -> the "smear" while the spiral is moving fast
    view.x += sin(uv.y * PI) * uScrollSpeed * 1.5;
    gl_Position = projectionMatrix * view;
  }
`;

const cardFragmentShader = `
  precision highp float;
  uniform sampler2D tMap;
  uniform float uColorStrength;
  uniform float uZoom;
  uniform vec2 uPlaneSizes;
  uniform vec2 uImageSizes;
  uniform float uReveal;
  varying vec2 vUv;

  float roundedRect(vec2 uv, vec2 size, float radius) {
    vec2 d = abs(uv - 0.5) - size * 0.5 + radius;
    return length(max(d, vec2(0.0))) - radius;
  }

  void main() {
    // object-fit: cover implementation
    vec2 ratio = vec2(
      min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
      min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
    );
    vec2 st = vec2(
      vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );

    vec3 col;
    if (gl_FrontFacing) {
      vec2 zuv = (st - 0.5) / uZoom + 0.5;
      col = texture2D(tMap, zuv).rgb;
      col = mix(col, vec3(0.02), uColorStrength);
    } else {
      // Gaussian blur approximation for Card backface
      float o = 30.0 / 1024.0;
      vec3 c = vec3(0.0);
      c += texture2D(tMap, st + vec2(-o, -o)).rgb * 1.0;
      c += texture2D(tMap, st + vec2(0.0, -o)).rgb * 2.0;
      c += texture2D(tMap, st + vec2(o, -o)).rgb * 1.0;
      c += texture2D(tMap, st + vec2(-o, 0.0)).rgb * 2.0;
      c += texture2D(tMap, st).rgb * 4.0;
      c += texture2D(tMap, st + vec2(o, 0.0)).rgb * 2.0;
      c += texture2D(tMap, st + vec2(-o, o)).rgb * 1.0;
      c += texture2D(tMap, st + vec2(0.0, o)).rgb * 2.0;
      c += texture2D(tMap, st + vec2(o, o)).rgb * 1.0;
      col = (c / 16.0) * 0.45; // darkened back
    }

    // reveal transitions inside a rounded-rect mask
    float reveal = clamp(uReveal, 0.0, 1.0);
    float d = roundedRect(vUv, vec2(reveal), 0.015 * reveal);
    float alpha = 1.0 - smoothstep(0.0, 0.003, d);
    alpha *= smoothstep(0.1, 1.0, reveal);

    gl_FragColor = vec4(col, alpha);
  }
`;

// Shaders for rendering the central logo with real-time WebGL refraction
const logoVertexShader = `
  attribute vec3 position;
  attribute vec2 uv;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const logoFragmentShader = `
  precision highp float;
  uniform sampler2D tMap; // HC Brand Logo Texture
  uniform sampler2D tBackdrop; // RenderTarget of background cards
  uniform vec2 uRes;
  uniform float uOpacity;
  uniform float uStrength;
  uniform float uBlur;
  uniform float uTint;    
  uniform float uChroma;  
  uniform float uReflMin; 
  uniform float uReflMax; 
  uniform float uSpec;    
  varying vec2 vUv;

  float field(vec2 p) {
    vec4 s = texture2D(tMap, p);
    float luma = dot(s.rgb, vec3(0.2126, 0.7152, 0.0722));
    return s.a * (0.35 + 0.65 * luma);
  }

  void main() {
    vec4 mark = texture2D(tMap, vUv);
    float sil = smoothstep(0.02, 0.35, mark.a);
    if (sil <= 0.001) discard;

    float e = 0.006;
    vec2 g = vec2(
      field(vUv + vec2(e, 0.0)) - field(vUv - vec2(e, 0.0)),
      field(vUv + vec2(0.0, e)) - field(vUv - vec2(0.0, e))
    );
    vec2 suv = gl_FragCoord.xy / uRes + g * uStrength;

    // Frosted glass blur filter (13-tap Gaussian)
    vec2 r = uBlur / uRes;
    vec3 b = vec3(0.0);
    float wsum = 0.0;
    for (int i = -3; i <= 3; i++) {
      for (int j = -2; j <= 2; j++) {
        vec2 o = vec2(float(i), float(j)) * r * 0.5;
        float wt = exp(-dot(o, o) / (2.0 * r.x * r.x + 1e-6));
        b += texture2D(tBackdrop, suv + o).rgb * wt;
        wsum += wt;
      }
    }
    b /= wsum;

    // Saturate and contrast adjustments inside the lens
    vec3 gray = vec3(dot(b, vec3(0.2126, 0.7152, 0.0722)));
    b = mix(gray, b, 1.45);
    b *= 1.15;
    b = (b - 0.5) * 1.05 + 0.5;

    float lum = dot(mark.rgb, vec3(0.2126, 0.7152, 0.0722));
    const vec3 GLASS_TINT = vec3(0.92, 0.95, 1.05);
    vec3 art = clamp(mark.rgb * mix(vec3(1.0), GLASS_TINT, uTint), 0.0, 1.0);

    // Chromatic aberration fringes on refraction boundaries
    float bl = dot(b, vec3(0.3333));
    vec3 bd = max(b + uChroma * (bl - 0.5) * vec3(0.8, 0.0, -0.8), 0.0);

    float refl = mix(uReflMin, uReflMax, lum);
    vec3 env = art + bd * (1.0 - art);
    vec3 col = mix(art, env, refl);

    // Dynamic specular highlight on shiny edges
    col += uSpec * pow(lum, 3.0) * bd * (1.0 - col);
    col = clamp(col, 0.0, 1.0);
    gl_FragColor = vec4(col, sil * uOpacity);
  }
`;

const backgroundGridVertexShader = `
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const backgroundGridFragmentShader = `
  precision highp float;
  uniform vec2 uRes;
  uniform float uScroll;
  varying vec2 vUv;
  void main() {
    vec2 st = vUv * 2.0 - 1.0;
    vec2 g = st * vec2(uRes.x / uRes.y, 1.0) * 10.0 + vec2(uScroll * 0.12, -uScroll * 0.06);
    vec2 q = abs(fract(g) - 0.5);
    float line = smoothstep(0.48, 0.5, max(q.x, q.y));
    float vign = 1.0 - smoothstep(0.3, 1.3, length(st));
    gl_FragColor = vec4(vec3(line * 0.1 * vign), line * 0.12 * vign);
  }
`;

const grainVertexShader = `
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const grainFragmentShader = `
  precision highp float;
  uniform vec2 uRes;
  uniform float uTime;
  varying vec2 vUv;
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  void main() {
    float t = mod(uTime, 10.0);
    float n = hash(vUv * uRes + vec2(t * 17.3, t * 11.7));
    gl_FragColor = vec4(vec3(n), 0.045);
  }
`;

// Helper math functions
const lerp = (start: number, end: number, amt: number) => start + (end - start) * amt;
const clampVal = (val: number, min: number, max: number) => Math.min(max, Math.max(min, val));

class SpiralEngine {
  gl: WebGLRenderingContext | WebGL2RenderingContext;
  renderer: Renderer;
  camera: Camera;
  scene: Transform;
  cards: {
    mesh: Mesh;
    program: Program;
    onArc: boolean;
    sx: number;
    sy: number;
    shw: number;
    shh: number;
  }[] = [];
  logoMesh: Mesh;
  logoReady = false;
  backdrop: RenderTarget | null = null;
  blitMesh: Mesh;
  gridMesh: Mesh;
  grainMesh: Mesh;
  n: number;
  center: number;
  rect: DOMRect;
  scrollOffset: number;
  baseScrollOffset: number;
  wheelDeltaY = 0;
  targetWheel = 0;
  wheelDir = 1;
  revealP = 1.0;
  t0 = performance.now();
  raf = 0;
  running = false;
  started = false;
  disposed = false;
  onState?: (state: { active: number; scrollOffset: number; velNorm: number }) => void;
  projV = new Vec3();

  // Spiral geometry helper constants
  PI_HALF_STEPS = Math.PI / 2 / 0.85;

  constructor(canvas: HTMLCanvasElement, cardsList: CardData[], options: { onState?: any } = {}) {
    this.n = cardsList.length;
    this.center = Math.floor(this.n / 2);
    this.onState = options.onState;
    
    // Initial offset to distribute cards nicely
    this.scrollOffset = 2.0 - this.center - this.PI_HALF_STEPS;
    this.baseScrollOffset = this.scrollOffset;

    this.renderer = new Renderer({
      canvas,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
      alpha: true,
      antialias: true
    });
    this.gl = this.renderer.gl;

    this.camera = new Camera(this.gl, { fov: 35, near: 0.1, far: 100 });
    this.camera.position.z = 8;

    this.scene = new Transform();

    // Standard card geometry
    const planeGeo = new Plane(this.gl, { width: 1.6, height: 1.05, widthSegments: 10, heightSegments: 10 });

    for (let i = 0; i < cardsList.length; i++) {
      const card = cardsList[i];
      const tex = new Texture(this.gl, {
        image: new Uint8Array([20, 20, 20, 255]),
        width: 1,
        height: 1,
        minFilter: this.gl.LINEAR,
        magFilter: this.gl.LINEAR,
        wrapS: this.gl.CLAMP_TO_EDGE,
        wrapT: this.gl.CLAMP_TO_EDGE
      });

      const prog = new Program(this.gl, {
        vertex: cardVertexShader,
        fragment: cardFragmentShader,
        transparent: true,
        uniforms: {
          tMap: { value: tex },
          uColorStrength: { value: 0 },
          uZoom: { value: 1.0 },
          uPlaneSizes: { value: [1.6, 1.05] },
          uImageSizes: { value: [1, 1] },
          uReveal: { value: 0 },
          uScrollSpeed: { value: 0 }
        }
      });

      const mesh = new Mesh(this.gl, { geometry: planeGeo, program: prog });
      mesh.scale.set(1.6, 1.05, 1);
      mesh.setParent(this.scene);

      this.cards.push({
        mesh,
        program: prog,
        onArc: false,
        sx: 0, sy: 0, shw: 0, shh: 0
      });

      // Load card high-res image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        if (this.disposed) return;
        tex.image = img;
        tex.needsUpdate = true;
        prog.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight];
        this.ensureRunning();
      };
      img.src = card.src;
    }

    // Logo refracting badge setup
    const logoTex = new Texture(this.gl, {
      minFilter: this.gl.LINEAR,
      magFilter: this.gl.LINEAR,
      wrapS: this.gl.CLAMP_TO_EDGE,
      wrapT: this.gl.CLAMP_TO_EDGE
    });

    const logoProg = new Program(this.gl, {
      vertex: logoVertexShader,
      fragment: logoFragmentShader,
      transparent: true,
      uniforms: {
        tMap: { value: logoTex },
        tBackdrop: { value: logoTex },
        uRes: { value: [1, 1] },
        uOpacity: { value: 0 },
        uStrength: { value: 0.16 }, // refraction strength
        uBlur: { value: 10 },        // frosted glass blur strength
        uTint: { value: 0.05 },      // cool chrome tone mix
        uChroma: { value: 0.25 },     // dispersion scale
        uReflMin: { value: 0.18 },
        uReflMax: { value: 0.85 },
        uSpec: { value: 0.35 }
      }
    });

    this.logoMesh = new Mesh(this.gl, {
      geometry: new Plane(this.gl, { width: 1, height: 1 }),
      program: logoProg
    });
    this.logoMesh.position.set(0, 0.1, 0.05); // slight pop forward
    this.logoMesh.visible = false;
    this.logoMesh.setParent(this.scene);

    // Load the circular Handloom Connect emblem texture onto logoTex
    const emblemImg = new Image();
    emblemImg.src = handloomLogoEmblem;
    emblemImg.onload = () => {
      if (this.disposed) return;
      logoTex.image = emblemImg;
      logoTex.needsUpdate = true;
      const aspect = emblemImg.height / emblemImg.width || 1;
      this.logoMesh.scale.set(2.6, 2.6 * aspect, 1);
      this.logoReady = true;
    };
    if (emblemImg.complete && emblemImg.width > 0) {
      logoTex.image = emblemImg;
      logoTex.needsUpdate = true;
      this.logoMesh.scale.set(2.6, 2.6 * (emblemImg.height / emblemImg.width), 1);
      this.logoReady = true;
    }

    // Post processing meshes
    const triangleGeo = new Triangle(this.gl);

    this.blitMesh = new Mesh(this.gl, {
      geometry: triangleGeo,
      program: new Program(this.gl, {
        vertex: backgroundGridVertexShader,
        fragment: `
          precision highp float;
          uniform sampler2D tMap;
          varying vec2 vUv;
          void main() {
            vec4 tex = texture2D(tMap, vUv);
            gl_FragColor = vec4(tex.rgb, tex.a);
          }
        `,
        transparent: true,
        uniforms: { tMap: { value: logoTex } }
      })
    });

    this.gridMesh = new Mesh(this.gl, {
      geometry: triangleGeo,
      program: new Program(this.gl, {
        vertex: backgroundGridVertexShader,
        fragment: backgroundGridFragmentShader,
        uniforms: {
          uRes: { value: [1, 1] },
          uScroll: { value: 0 }
        }
      })
    });

    this.grainMesh = new Mesh(this.gl, {
      geometry: triangleGeo,
      program: new Program(this.gl, {
        vertex: grainVertexShader,
        fragment: grainFragmentShader,
        transparent: true,
        uniforms: {
          uRes: { value: [1, 1] },
          uTime: { value: 0 }
        }
      })
    });

    this.rect = canvas.getBoundingClientRect();
    this.resize();
  }

  resize() {
    if (this.disposed) return;
    const canvas = this.renderer.gl.canvas as HTMLCanvasElement;
    const parent = canvas.parentElement;
    const w = parent?.clientWidth || window.innerWidth;
    const h = parent?.clientHeight || window.innerHeight;
    
    this.renderer.setSize(w, h);
    this.camera.perspective({
      fov: w < 900 ? 45 : 35,
      aspect: w / h
    });

    this.gridMesh.program.uniforms.uRes.value = [w, h];
    this.grainMesh.program.uniforms.uRes.value = [w, h];

    const bufW = this.gl.drawingBufferWidth;
    const bufH = this.gl.drawingBufferHeight;

    if (!this.backdrop || this.backdrop.width !== bufW || this.backdrop.height !== bufH) {
      this.backdrop = new RenderTarget(this.gl, { width: bufW, height: bufH });
      
      const logoUniforms = this.logoMesh.program.uniforms;
      logoUniforms.tBackdrop.value = this.backdrop.texture;
      logoUniforms.uRes.value = [bufW, bufH];
      
      this.blitMesh.program.uniforms.tMap.value = this.backdrop.texture;
    }

    this.rect = canvas.getBoundingClientRect();
  }

  addScroll(delta: number, isTouch = false) {
    // Scroll dampening and limits
    this.targetWheel = clampVal(
      this.targetWheel + delta * (isTouch ? 0.00045 : 0.00015),
      -1.5,
      1.5
    );
    if (delta !== 0) {
      this.wheelDir = delta > 0 ? 1 : -1;
    }
    this.ensureRunning();
  }

  setScrollFromWindow(scrollY: number) {
    const scrollFactor = scrollY / (window.innerHeight || 800);
    this.scrollOffset = this.baseScrollOffset + scrollFactor * 1.5;
    this.ensureRunning();
  }

  scrollToIndex(index: number) {
    // Rotates the spiral to align with the clicked project index
    const targetOffset = 2.0 - index - this.PI_HALF_STEPS;
    this.scrollOffset = targetOffset;
    this.targetWheel = 0;
    this.ensureRunning();
  }

  pick(clientX: number, clientY: number): number {
    const rx = clientX - this.rect.left;
    const ry = clientY - this.rect.top;
    let clickedIndex = -1;
    let maxZ = -Infinity;

    for (let i = 0; i < this.n; i++) {
      const card = this.cards[i];
      if (card.onArc && Math.abs(rx - card.sx) <= card.shw && Math.abs(ry - card.sy) <= card.shh) {
        const z = card.mesh.position.z;
        if (z > maxZ) {
          maxZ = z;
          clickedIndex = i;
        }
      }
    }
    return clickedIndex;
  }

  get active(): number {
    return ((Math.round(this.scrollOffset + this.center + this.PI_HALF_STEPS) % this.n) + this.n) % this.n;
  }

  start() {
    this.started = true;
    this.ensureRunning();
  }

  stop() {
    this.running = false;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  ensureRunning() {
    if (this.disposed || !this.started || this.running) return;
    this.running = true;
    this.raf = requestAnimationFrame(this.frame);
  }

  placeCard(card: any, offsetIndex: number, revealProgress: number) {
    const angle = 0.8 * offsetIndex;
    const radius = 2.4 * (1 - revealProgress / 2);
    
    // Helical spiral curve positioning
    card.mesh.position.set(
      Math.cos(angle) * radius,
      0.48 * offsetIndex + -0.9 + 1.6 * revealProgress,
      Math.sin(angle) * radius
    );
    
    // Face the viewer
    card.mesh.rotation.y = -angle + Math.PI / 2;
  }

  frame = () => {
    if (this.disposed) return;
    const time = (performance.now() - this.t0) / 1000;

    // Apply scroll drag physics with spring interpolation
    this.wheelDeltaY += (this.targetWheel - this.wheelDeltaY) * 0.1;
    this.scrollOffset += this.wheelDeltaY;
    
    if (Math.abs(this.targetWheel) < 0.002) {
      this.targetWheel = 0.002 * this.wheelDir;
    }
    this.targetWheel *= 0.88; // friction

    // Animate the initial opening reveal sweep
    this.revealP = lerp(this.revealP, 0, 0.045);

    const canvasWidth = this.rect.width || 1;
    const canvasHeight = this.rect.height || 1;

    this.camera.updateMatrixWorld();
    const projVector = this.projV;

    // Loop through cards to calculate positions and on-screen coordinates
    for (let i = 0; i < this.n; i++) {
      const card = this.cards[i];
      const offsetIndex = ((i - this.scrollOffset) % this.n + this.n) % this.n - this.center;

      this.placeCard(card, offsetIndex, this.revealP);
      card.onArc = Math.abs(card.mesh.position.y) < 3.8;

      if (!card.onArc) continue;

      const unifs = card.program.uniforms;
      unifs.uReveal.value = 1.0 - this.revealP;
      unifs.uScrollSpeed.value = this.wheelDeltaY;

      card.mesh.updateMatrixWorld();
      const worldMat = card.mesh.worldMatrix;

      // Project vertices to screen-space coordinates for pixel hover/click tests
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      const cornerOffsets = [
        [-0.5, -0.5],
        [0.5, -0.5],
        [-0.5, 0.5],
        [0.5, 0.5],
        [0.0, 0.0]
      ];

      for (const [ox, oy] of cornerOffsets) {
        const dx = ox * 1.6;
        const dy = oy * 1.05;
        const pz = 0.25 * Math.sin((ox + 0.5) * Math.PI);

        // Transform mesh corners by world matrix
        const wx = worldMat[0] * dx + worldMat[4] * dy + worldMat[8] * pz + worldMat[12];
        const wy = worldMat[1] * dx + worldMat[5] * dy + worldMat[9] * pz + worldMat[13];
        const wz = worldMat[2] * dx + worldMat[6] * dy + worldMat[10] * pz + worldMat[14];
        const wSkew = worldMat[1] * dx + worldMat[5] * dy + worldMat[13];

        projVector.set(
          wx + wSkew * wSkew * 0.08 + Math.sin((oy + 0.5) * Math.PI) * this.wheelDeltaY * 1.5,
          wy,
          wz
        );

        this.camera.project(projVector);
        const sx = (projVector.x * 0.5 + 0.5) * canvasWidth;
        const sy = (1.0 - (projVector.y * 0.5 + 0.5)) * canvasHeight;

        if (sx < minX) minX = sx;
        if (sx > maxX) maxX = sx;
        if (sy < minY) minY = sy;
        if (sy > maxY) maxY = sy;
      }

      card.sx = (minX + maxX) / 2;
      card.sy = (minY + maxY) / 2;
      card.shw = (maxX - minX) / 2 + 3;
      card.shh = (maxY - minY) / 2 + 3;
    }

    this.logoMesh.program.uniforms.uOpacity.value = 0.92 * (1.0 - this.revealP);
    this.gridMesh.program.uniforms.uScroll.value = this.scrollOffset;
    this.grainMesh.program.uniforms.uTime.value = time;

    this.renderPasses();

    const normalizedVelocity = clampVal(Math.abs(this.wheelDeltaY) / 0.05, 0, 1);
    this.onState?.({
      active: this.active,
      scrollOffset: this.scrollOffset,
      velNorm: normalizedVelocity
    });

    this.raf = requestAnimationFrame(this.frame);
  };

  renderPasses() {
    // 1st render pass: draw opaque meshes behind the logo into our backdrop RenderTarget
    for (const card of this.cards) {
      card.mesh.visible = card.onArc && card.mesh.position.z < 0;
    }
    this.logoMesh.visible = false;
    this.renderer.render({ scene: this.gridMesh, target: this.backdrop || undefined });
    this.renderer.render({ scene: this.scene, camera: this.camera, target: this.backdrop || undefined, clear: false });

    // 2nd render pass: draw final frame blitting backdrop, then rendering front transparent cards & logo
    this.renderer.render({ scene: this.blitMesh });

    for (const card of this.cards) {
      card.mesh.visible = card.onArc && card.mesh.position.z >= 0;
    }
    this.logoMesh.visible = this.logoReady;
    this.renderer.render({ scene: this.scene, camera: this.camera, clear: false });
    this.renderer.render({ scene: this.grainMesh, clear: false });
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.stop();
    this.scene.traverse((node: any) => {
      if (node.geometry) node.geometry.remove();
      if (node.program) node.program.remove();
    });
    if (this.backdrop) {
      const gl = this.renderer.gl;
      gl.deleteFramebuffer(this.backdrop.buffer);
      gl.deleteTexture(this.backdrop.texture.texture);
    }
    this.blitMesh.geometry.remove();
    this.blitMesh.program.remove();
    this.gridMesh.geometry.remove();
    this.gridMesh.program.remove();
    this.grainMesh.geometry.remove();
    this.grainMesh.program.remove();
  }
}

export function SpiralHero() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollPct, setScrollPct] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<CardData | null>(null);
  const [selectedProject, setSelectedProject] = useState<CardData | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const engineRef = useRef<SpiralEngine | null>(null);
  const pointerPos = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    setIsMobile(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  // Load custom lens refraction overlay and configure scroll trigger pinning
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const engine = new SpiralEngine(canvas, CARDS_DATA, {
      onState: (state: any) => {
        setActiveIndex(state.active);
        // Calculate scroll scrub pct
        const total = CARDS_DATA.length;
        const normScroll = ((state.scrollOffset % total) + total) % total;
        setScrollPct(normScroll / (total - 1 || 1));
      }
    });
    engineRef.current = engine;
    engine.start();

    const handleResize = () => engine.resize();
    const handleHeroWheel = (e: WheelEvent) => {
      if (window.scrollY < 50) {
        e.preventDefault();
        engine.addScroll(e.deltaY);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('wheel', handleHeroWheel, { passive: false });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('wheel', handleHeroWheel);
      engine.dispose();
      engineRef.current = null;
    };
  }, []);

  // Set up custom mouse cursor physics / hover lens
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let cx = 0;
    let cy = 0;
    let tx = 0;
    let ty = 0;
    let scale = 0.85;
    let opacity = 0;

    const updatePosition = () => {
      cx += (tx - cx) * 0.16;
      cy += (ty - cy) * 0.16;
      const targetOpacity = pointerPos.current.active ? 1 : 0;
      opacity += (targetOpacity - opacity) * 0.12;

      const targetScale = hoveredCard ? 1.05 : 0.85;
      scale += (targetScale - scale) * 0.15;

      cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0) scale(${scale})`;
      cursor.style.opacity = String(opacity);

      requestAnimationFrame(updatePosition);
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Bounds check: Only activate cursor lens when mouse is strictly inside hero container
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (e.clientY < rect.top || e.clientY > rect.bottom || e.clientX < rect.left || e.clientX > rect.right) {
          pointerPos.current.active = false;
          setHoveredCard(null);
          if (canvasRef.current) canvasRef.current.style.cursor = 'default';
          return;
        }
      }

      tx = e.clientX;
      ty = e.clientY;
      pointerPos.current.active = true;

      // Card hover check
      if (engineRef.current) {
        const idx = engineRef.current.pick(e.clientX, e.clientY);
        if (idx >= 0) {
          setHoveredCard(CARDS_DATA[idx]);
          if (canvasRef.current) canvasRef.current.style.cursor = 'pointer';
        } else {
          setHoveredCard(null);
          if (canvasRef.current) canvasRef.current.style.cursor = 'default';
        }
      }
    };

    const handleMouseLeave = () => {
      pointerPos.current.active = false;
      setHoveredCard(null);
      if (canvasRef.current) canvasRef.current.style.cursor = 'default';
    };

    const handleMouseDown = () => {
      if (hoveredCard) {
        // Shrink cursor lens slightly on press
        scale = 0.95;
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (engineRef.current) {
        const idx = engineRef.current.pick(e.clientX, e.clientY);
        if (idx >= 0) {
          setSelectedProject(CARDS_DATA[idx]);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleClick);

    const animId = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animId);
      pointerPos.current.active = false;
      if (canvasRef.current) canvasRef.current.style.cursor = '';
      document.body.style.cursor = '';
      document.body.style.removeProperty('cursor');
    };
  }, [hoveredCard]);



  return (
    <div ref={containerRef} className="spiral-hero-wrapper" id="home">
      <main className="spiral-hero">
        {/* Background WebGL spiral */}
        <canvas ref={canvasRef} className="spiral-canvas" />

      {/* SVG backdrop-filter displacement lens map definition */}
      <svg width="0" height="0" aria-hidden="true" className="absolute">
        <filter id="agd-pill-lens" x="-15%" y="-15%" width="130%" height="130%" colorInterpolationFilters="sRGB">
          <feImage
            result="map"
            x="-15%"
            y="-15%"
            width="130%"
            height="130%"
            preserveAspectRatio="none"
            href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAAA4CAYAAAB6+vMDAAAQAElEQVR4AeydD4htbTvG16yZ872+fyQiEYlIRCISEYlIRCISkYhEJCL5l4hEJCIRiUhEIhIRiUhEIhKRiEQkzpkZv9/1PvfTvddee58z57zn+973+2Y613td9/08e++1nuc3a2bPe86a9eLiG28v0RV6FXoBvRq9Fr0OvSV6K/TW6G3Q26K3Q2+P3gG9I3on9M7oXdC7ondD747eA70nei/03uh90Pui90Pvjz4AfSD6IPTB6EPQh6IPQx+OPgJ9JPoo9NHoY9DHoo9DH48+AX0i+iT0yehT0KeiT0Ofjj4DfSb6LPTZ6HPQ56LPQ5+PvgB9Ifoi9MXoS9CXoi9DX46+An0l+ir01ehr0Neir0Nfj74BfRP6ZvQt6FvRt6FvR9+BvhN9F/pu9D3oe9H3oe9HP4B+EP0Q+mH0I+hH0Y+hH0c/gX4S/RT6afQz6GfRz6GfR7+AfhH9Evpl9CvoV9GvoV9Hv4F+E/0W+m30O+h30e+h30d/gP4Q/RH6Y/Qn6E/Rn6E/R3+B/hL9Ffpr9Dfob9Hfob9H/4D+Ef0T+mf0L+hf0b+hf0f/gf4T/Rf6b/Q/6H/R/6FH6BrdonV5sCyvRF3sHHfvVY6/inNEF2hB5T33nn2117N/F93yetv51St3vHJ5euMcb4e7Tz1bq72e/VeC1uVqWV52GgseeMh6waArN+jihWU50FtQ31GL81+9LAu6QOU9V6+7eavb8fg93+v52re8/p3Fed82uRaCq2Zm3QTwAM4rzvNlptWDfGNqwsSVomBae2aDVsWCx81s9LrVa5Zl9sw7uhi9+GuX5QKtKDVjemkZ9Z7bO6VbHufYnttTN8yJ89q36Aalrj7unCNxzjfKcX0r1uZGsVZxcoF6w5pW7qC+Mffe116f69VvfBb6QqquZAK2skgTOPKEi0UTpEv8kgUurSz65SmxgY4J06UZVV5ftyz2rCNqe8nMC4T0LoYcq1y+jDFd2de7bplTdWW964Y5VSfz+sIXMWYvmf41so6TdeX4Netgjps3Etxr1m6KtQy4eok1LyBvyAFUSDd75r49T0bWvMDeiz5jzyubwAU2TkzgplgEcyAjF2QHzqIKVcQGXFErYVJX9PRLNi65efUdU0KlX75+WSrrq7Xisalx4VLW+gXjahle2XqrW+Yo+3rEcwpSB886Yv6NYs41sndNPTM9c8T56o82Lojp2UePWCdl/wDQDmRl1v4aBcByYVTsWaCEg1wx8efByksKoMAFPA5eF7KuCRwnK2xXLMSRWEBBOxKLK2gPhpun2CizkF2Ru5u3Eq6VjdYd0yN7Q4IW8XwBEa8r3OO8YIvzfIIY0MhxniuwDa+egO3pEfPsT2cNzILX9dB+iXUUxCOx5o82ypWSPRFGFSCFcEgAp15iENdnuryOgynwAhvw6ZccfLngXXGC+i54LNaDrVhIYesSMmVP0B6wMdaRWfE4x+oqaFaCtqeAx+NyNdSbCrxzHsh4zDkXtgMJIo+xJ1h7CmDMyRjnlLqcfoH30Iw6fOYjsb4PmwLmCRAfsVeCeM0eCmO5V0TrwDj2PlfFZ3hjs+YJ+pM9YfYKJ3j5EsuBxoFP8KY4EaEr+LzaPaAX5+TjLMqDkb3qHYHoOJpjbILAOS+9UafXstDZC4j0A185G1b9CSBj8/tCxoWuxsylu1z9BEwVnH7/NsVrOJYvlbx2QKOXupx+QKOOUwvWQWZtBMueY8mjZ96qwHvImjvm1dAcZ2904ZsQ0hPAUiBknwXR7LtsgXxaju4MoNAJ3wqoBZ0+oQNGoVNXZOFTgYyTCXTlLEJqXKCcE7GA8dEPaPZQ5utsRq6EZuTjnSd0cXozM7e+l4wzVrBZ+wan6rwpYbzeDXf33W3V5i7fxSp7+la+Mah3vIGQ1/B7tGSOzxyNLFCBhTrO/OoFHGskdPbTY7105WN04Yqc67gaWdgci7MnuuClZ63YQ4GMzEPCNwULQiiMdwVxfZIvwRdcYgMeL1TwxflMCHx4BzDgcaCCl8yJ6F79lH19ikVJ1h8nFq/gFEZhs07msXHm+KX+lPIum7m6cp5e8meAZn1P25//Ve3P+vbkO1D7esnvu7bZ3ikJVADhuPVAwnlWtj4Ajnnp7Tn7kTF9KOBVZu+sH3Un11Uwzp4XgMJ3Axu6EEYw8yRsrU9KbADkRevKd0mOOLDAZz2ysE1xUsm6Yk5gMyOz47rqcJqVfVVZL1Xf2qtuxGtYq9S8Tpy+P+4x5/tT+tYXOmP+WMha2evyh8bWuurZHyTbU5X1rv5zOb98OWbPK4t1nOPI5upDAcHM8TlHVe8h/cp61bqyp8zqIPN8ez3nRIxPN6Mcm85eH2TqwNggfFKu1nOUBjqe1KudueDzqtc1QeRAhMlaj0bP/ID8gBMwK/OeHFM1Zp7iOa6afK18AtTzMpYa9xjNcWvmON9aAOP2kedoTz8l/y+Dclzv8rO/avMpCZtj2TBeN85x6dfW5DjZTa6++RE9r0rmyHorHu8c9ZCszMr88IVl2bpjKn2fj8dZ1+uZPabyem2P7UjwkisgzxOnPsfY+jhSCzwXXfVNczO7BMO6u1kJXyDiwMzKfsQJxxl7nNfz93n2LjlR5SdJnOeK86UgzvhKdjwi17cWqRlPXf3htXh9rHpbv+UxpRqrurtfrlQ2iMfcKF7fXuVra/pxziVOT4/oBZDmgaTV2/GDmjWv+iGPUanpz0zfXj1vd3OpQ+gnl/JcPL/H8XUSQMHrmpvEIlQWxmwuB6pPEKgFxJ6uzMqsZub5rs7okk1w3PlqZvqOCZWuKscv+aEzc8wXZkVtPtC6LAtjB72d2jl30S3PcU4+1y2vvZ0TAMdjkznma2rzNbl8m4XyEeuoq2Tm62fFXmU+HtjGc5hVjQU2x5hnT+jKhU0JnK7MXadAXOsztTyf6byQD+gAmid4jAtb1YIxxQHO7LwhwVEZY2HMV7h1uRBZxx0rsQGXQyseMabb1yM2VJDW4Rd618WyHPUcp7+8gXXL6wVAXv/A9/qc843zht/oKGDiQtl79iPWSFCn2Itk/JFjwwV09u0h4ToSe9t7gqaEUy918MyypPtVoDgrXx3ck8B1CZu1fk6BhxOY3jMnnf45Z0GFqitwjX4ymyFkZoFa2TQ9qqw3TcCWl/kHx+yxBlDydM45WUc3jumsi3BGZMHbhXGMBTTW/6yzZxnXlfOHF2SnXNAc07v2GLO3+p+t6io4nRfv8JkdmyBygMkbFza/BHYPWMzTM8bCCNIli2mvZO9AjAtYwBv5gk2IrCvjy5voRwDk/OKcc9yaHABxr6bJrGuBqAvmFPOq59UzffakPD3q6ey/WbCOnDGvbMKWcesunscx52w5s17rUlguXA4o854CGy8iQEfixNMbLlCCVD7HGBe6gzEWpgCbzgJ7hUtNDnD6siyVlzfTjwkg51/ZK2MAZI1mZl3TK2fthS0Q2qM2By7yHCNX78CBKnU5LAhfQCNvXZaU/eKsfHWgJGwO6F7h7OvnFKA4kAPnwFPj+Z5suLAFJE46Tl/fu7IJXQBjbpwFjS98jEy6/8MKCN/CmtyObB2xdrog6vPqaB8FSvYg3mrfGAlkeWBzHvuc3Nwr2znJUMYBU7YCoXlotamEzMkRL6BXr4C0PikOUNgiHh+nJ3TmAk3Yplg0oZqwUSezGPajZVnKFz56prz/M1ag4LOsPJ11DXz60ITSmvV2vCSQBZ8esadx9jRufU4DMOGTJRmL00+Px9pbqxmnGdiYJGj29Gj0kp23FQcmaBEnNCEjd/jMqsZnZiECl77wMdwe1bJYo+X+4+wKeKVzrZxkFkJrPTVrGGdfAhoueGZlVj1bR+xx4NPZf0HaFaxUX4aS7SGhs1daK0zniWuSsKVfveaOCZs/z9JTM57MAXbPHE5U6BZcmQMXC6KXXKzkhQ/G+O9ird/ryVdAyDKbNSz4FnPTrMeeuC8BzZo9nLD1zB4HKHrua+bQCzNbBzjnHjBEL/Xw9eiBYyB9smAljye3Vr64fUFL5oAClV7yRFD63VmEQGWP7EKULA/y8uJH+i/G+/8+ZgUErqYku3ioZ9c4kLIHemRumkCynwFNZ7z2254MWAuaSj1YSQ1D6elqjKVHXjuNyTQz2CbnyzL9gIf7gs4JfKNO5gAz5kEOCZ8nMsVCJOOBEF/4SMZdmGbL7Nu8151WQKh8QMAzjLWu/kKdjNeexMfeeTXsdfaWPQ54uAwkDwZSkwUvbzbI9o64kq2hNROcOBqZTJ6wObajAGefA0nGc4AevLl5ILLmRAUyNdkFUFXHl8XWkg/nJLzS//NGPP6xhgVhAVeexWaOdYAjC521vrun7G/Aw+UnWRZOSCCLq+lj7rpt+IRTgJjxMTn98aIzW28lbPb0JuGrEy4PdJ700j6sVWvdx2dYAddS9aegDmR47YUeCNueHUHovm5VfNivrO/xY1+NsTWAjeIoO3FPvtAZeUUMbP1ENic6wdv0XYTl/uP5rMDeWtPbAzHgjf0Tylzlzux5rpR7rNg7xRf9NVcyJz2rxsH2A39sXu4/XhYr8DR796y8jMevR1c9qJy9MekI0sd8JvjZ4mfNAYB8puXqNnz3s26MLfcfz2cFan03vvvVqEHpVzO/quUqd27vT/HSmdrk9SxsNbk/sQdQtXlPHrx9vSlQbk5+gri0j5rTWvfxGVZgbz397YEnbAcXDvev9lLfU+ehsr7Hj301xtZ5dRuNAjLvXJx4Ql7l8lgOKBnPZ8j2gKkDGe4VUAhTswDWqur4siz1js0xyvs/z7ICrjOPH7YUdOWLA8g68JEF0Frf3VP2el4R4SMZDw8bt5efqGz4sq/WAm56PYEPGNmf6Qik8kE5KMYCHm6dzIGZc+AChwSu1zlh+nqA84QXoBtun3JCmDk27nXnFQhEPKqWtta2+tbJThh70vcqQNovjf0NcGb2PhnPvuPCFjV+whZjYcd+05pmDeo1OPKEzhp7unHLv7bFh436mTOezrZK13AYw0CnD2yEBV45iOx9oHtT8Vv2Q+296LvM2Zg2Q8o5erHhK58jC5cf2au4G3t3bs00Pn/Hn3t+e+ErGv2vLD11Dx7jGWP/Zp5q/8GOPv4bC1M9XhN1nvl/wGgz0Pr015Wd97tKQD2T3sKjM4ex8F/979u74R/aD01D+3g8nre7n6mZ85d9mvm5fsTevU+0zPnHXm/48jW6rEvwP2u4rT3+vx/Cg5nXYTH7M0G9M7q+P8D3FpPveM1G+jU1dY+qX/p0eRrvWep/f9hWbZ2zvrXzNqruvx19v9+5tW4fGf9e8aR31v7B62Xf730/2GvtzP3j/Opxnle3UvV20/9l9vL93+u7pffb3WfO177O0b22v8fVb97f3+o+e3Zk7/+c1//l/tP7t3f5Utd+f8o/h/9H/4f/h+D2NnAAAAAElFTkSuQmCC"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="map"
            scale="45"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      {/* Floating dynamic glass cursor/lens tracking mouse */}
      {!isMobile && (
        <div
          ref={cursorRef}
          aria-hidden="true"
          className="spiral-cursor-lens"
        >
          <svg width="20" height="20" viewBox="0 0 18 18" fill="none" className="shrink-0">
            <path
              d="M5 13L13 5M13 5H6.5M13 5V11.5"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="cursor-lens-label">
            <span className="cursor-title">{hoveredCard ? hoveredCard.title : 'EXPLORE'}</span>
            <span className="cursor-detail">{hoveredCard ? hoveredCard.detail.split('·')[1].trim() : 'DRAG TO SPIN'}</span>
          </span>
        </div>
      )}

      {/* Bottom overlay: Description copy */}
      <div className="spiral-overlay-left">
        <h2>
          <span>Product partners</span>
          <span>for AI-first startups.</span>
        </h2>
        <p>
          Discover authentic Indian handloom, trace every design to its maker and loom origin. 
          We connect traditions with modern living.
        </p>
      </div>

      {/* Bottom overlay: Center slide counter / indicator */}
      <div className="spiral-overlay-center">
        <span className="slide-counter-num">
          {String(activeIndex + 1).padStart(2, '0')}
        </span>
        <div className="slide-counter-bar">
          {CARDS_DATA.map((card, idx) => (
            <span
              key={card.id}
              className={`slide-counter-dot ${idx === activeIndex ? 'is-active' : ''}`}
              style={{
                background: idx === activeIndex 
                  ? `rgb(${card.accent.map(v => Math.round(v * 255)).join(',')})`
                  : 'rgba(255, 255, 255, 0.22)'
              }}
            />
          ))}
          <div
            className="slide-counter-progress"
            style={{
              left: `${scrollPct * 100}%`,
              background: `rgb(${CARDS_DATA[activeIndex].accent.map(v => Math.round(v * 255)).join(',')})`
            }}
          />
        </div>
        <span className="slide-counter-total">
          {String(CARDS_DATA.length).padStart(2, '0')}
        </span>
      </div>

      {/* Bottom overlay: Right links / actions */}
      <div className="spiral-overlay-right">
        <button
          type="button"
          onClick={() => navigate('/wishlist')}
          className="spiral-overlay-link"
        >
          WISHLIST
        </button>
        <button
          type="button"
          onClick={() => navigate('/marketplace')}
          className="spiral-overlay-link"
        >
          SHOP LOOMS
        </button>
        <button
          type="button"
          onClick={() => navigate('/artisans')}
          className="spiral-overlay-link"
        >
          MEET MAKERS <span>(→)</span>
        </button>
      </div>

      {/* Detail Popup Modal */}
      {selectedProject && (
        <ProjectPopup
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
      </main>
    </div>
  );
}
