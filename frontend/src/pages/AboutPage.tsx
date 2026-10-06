import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ButtonLink } from '../components/primitives/Button'
import { Icon } from '../components/primitives/Icon'

/* ─── Data ─────────────────────────────────────────────────────────── */

const STATS = [
  { value: '120+', label: 'Verified Artisans' },
  { value: '15+',  label: 'Weaving Clusters' },
  { value: '100%', label: 'Direct Trade' },
  { value: '2026', label: 'Diploma Project' },
]

const WHY_HANDLOOM = [
  {
    icon: '🧵',
    title: 'Preserve Craftsmanship',
    body: 'Promoting and safeguarding centuries-old Indian handloom traditions from being lost to mass production.',
  },
  {
    icon: '🌍',
    title: 'Digital Visibility',
    body: 'Giving master weavers and artisans a direct, centralized platform to showcase their work to a global audience.',
  },
  {
    icon: '🤝',
    title: 'Connect & Discover',
    body: 'Helping conscious customers discover authentic traditional products without exploitative middlemen.',
  },
  {
    icon: '🚀',
    title: 'Modern Technology',
    body: 'Bridging the gap between rural craftsmanship and cutting-edge digital commerce.',
  },
]

const FEATURES = [
  { title: 'Handloom Marketplace', icon: 'shopping-bag' as const, desc: 'Browse authentic, region-specific handwoven garments and textiles.' },
  { title: 'Artisan Discovery', icon: 'users' as const, desc: 'Meet the master weavers and read the stories behind their craft.' },
  { title: 'Raw Materials (B2B)', icon: 'layers' as const, desc: 'A dedicated portal for sourcing pure silk, cotton, and natural dyes.' },
  { title: 'Product Authenticity', icon: 'shield-check' as const, desc: 'Cryptographically verified provenance and Product 360° traceability.' },
  { title: 'AI Assistant', icon: 'sparkles' as const, desc: 'Personalized cultural styling and garment recommendations.' },
  { title: 'AR Product Preview', icon: 'eye' as const, desc: 'Experience 3D holographic craft textures and virtual fabric draping.' },
  { title: 'Cart & Wishlist', icon: 'heart' as const, desc: 'Save your favorite heirloom pieces and seamlessly manage your cart.' },
  { title: 'Secure Checkout', icon: 'shield' as const, desc: 'Reliable authentication and order processing powered by modern infrastructure.' },
]

const TECH_STACK = [
  { name: 'React 18', category: 'Frontend UI', color: '#61DAFB' },
  { name: 'TypeScript', category: 'Type Safety', color: '#3178C6' },
  { name: 'Vite', category: 'Build Tool', color: '#646CFF' },
  { name: 'Supabase', category: 'Backend & Database', color: '#3ECF8E' },
  { name: 'Framer Motion', category: 'Animations', color: '#E902B5' },
  { name: 'GSAP & Lenis', category: 'Scroll & Motion', color: '#88CE02' },
]

/* ─── Animation variants ─────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 36, filter: 'blur(5px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.85, ease: [0.25, 1, 0.5, 1] } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.1 } },
}

/* ─── Animated Counter ───────────────────────────────────────────── */
function AnimatedStat({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <motion.strong
        initial={{ opacity: 0, scale: 0.7 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
        style={{
          display: 'block',
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.6rem, 5vw, 4rem)',
          color: 'var(--gold)',
          lineHeight: 1,
          marginBottom: '0.4rem',
        }}
      >
        {value}
      </motion.strong>
      <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)' }}>
        {label}
      </span>
    </div>
  )
}

/* ─── Main Page ──────────────────────────────────────────────────── */
export function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null)

  // Parallax on hero image
  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    const handleScroll = () => {
      const scrollY = window.scrollY
      const img = el.querySelector('.about-hero__img') as HTMLImageElement | null
      if (img) img.style.transform = `translateY(${scrollY * 0.22}px) scale(1.08)`
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div style={{ background: 'var(--canvas)', color: 'var(--ink)', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        style={{
          position: 'relative',
          minHeight: '90vh',
          display: 'flex',
          alignItems: 'flex-end',
          paddingBottom: '6vh',
          overflow: 'hidden',
        }}
        aria-label="About Handloom Connect"
      >
        {/* Background image */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img
            className="about-hero__img"
            src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=1800&auto=format&fit=crop"
            alt="Artisan at a handloom loom"
            style={{ width: '100%', height: '110%', objectFit: 'cover', objectPosition: 'center', transformOrigin: 'center top' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,9,8,0.97) 0%, rgba(10,9,8,0.5) 50%, rgba(10,9,8,0.22) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
        </div>

        {/* Hero content */}
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            style={{ maxWidth: '860px' }}
          >
            <motion.p className="eyebrow" variants={fadeUp}>About Handloom Connect</motion.p>
            <motion.h1
              variants={fadeUp}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3.2rem, 6vw, 5.8rem)',
                fontWeight: 400,
                lineHeight: 0.95,
                letterSpacing: '-0.02em',
                marginBottom: '2rem',
              }}
            >
              Connecting Tradition, Technology, and the <br />
              <span style={{ color: 'var(--gold)' }}>Future of Handloom.</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              style={{ fontSize: '1.15rem', lineHeight: 1.65, color: 'var(--muted)', maxWidth: '600px', marginBottom: '2.5rem' }}
            >
              Handloom Connect is a digital platform designed to seamlessly connect artisans, customers, traditional craftsmanship, and modern digital commerce in a centralized marketplace.
            </motion.p>
          </motion.div>
        </div>

        {/* Decorative bottom thread line */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, var(--gold), transparent)', opacity: 0.4, zIndex: 2 }} />
      </section>

      {/* ─── STATS BAR ────────────────────────────────────────── */}
      <section style={{ borderBottom: '1px solid var(--border)', borderTop: '1px solid var(--border)', background: 'var(--canvas-secondary)', padding: '52px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '2rem 3rem' }}>
            {STATS.map(s => <AnimatedStat key={s.label} value={s.value} label={s.label} />)}
          </div>
        </div>
      </section>

      {/* ─── PROJECT VISION ──────────────────────────────────────── */}
      <section className="section-pad" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'clamp(40px, 8vw, 100px)', alignItems: 'center' }}>
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-10%' }}
            >
              <motion.p className="eyebrow" variants={fadeUp}>Project Vision</motion.p>
              <motion.h2 variants={fadeUp} style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)', lineHeight: 1.05, marginBottom: '1.6rem' }}>
                A diploma project bridging <span style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)' }}>heritage and innovation.</span>
              </motion.h2>
              <motion.p variants={fadeUp} style={{ fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--ink)', marginBottom: '1.2rem' }}>
                This project represents a comprehensive effort to bring the fragmented, informal sector of Indian handloom into the modern digital age.
                The ultimate goal is to combine traditional Indian handloom with modern interactive technology, creating a sustainable digital commerce ecosystem.
              </motion.p>
              <motion.p variants={fadeUp} style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--muted)', marginBottom: '2rem' }}>
                By establishing a centralized marketplace, we can provide master weavers with the digital visibility they deserve, ensuring authenticity and traceability for customers worldwide.
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 1.1, ease: [0.25, 1, 0.5, 1] }}
              style={{ position: 'relative' }}
            >
              <div style={{ position: 'relative', aspectRatio: '4/5', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.07)' }}>
                <img
                  src="https://images.unsplash.com/photo-1598531147610-cba35f2c8f1d?q=80&w=1200&auto=format&fit=crop"
                  alt="Artisan weaving silk on traditional loom"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.02) brightness(0.92)' }}
                  loading="lazy"
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,9,8,0.45) 0%, transparent 60%)' }} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES (What the platform offers) ───────────────────────────────────────────── */}
      <section className="section-pad" style={{ background: 'var(--canvas-secondary)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-10%' }}
            style={{ textAlign: 'center', marginBottom: '4rem' }}
          >
            <motion.p className="eyebrow" variants={fadeUp} style={{ justifyContent: 'center' }}>What the platform offers</motion.p>
            <motion.h2 variants={fadeUp} style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', maxWidth: '700px', marginInline: 'auto' }}>
              Comprehensive Digital Capabilities
            </motion.h2>
          </motion.div>
          
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-10%' }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}
          >
            {FEATURES.map((feat, i) => (
              <motion.div
                key={feat.title}
                variants={fadeUp}
                custom={i}
                style={{
                  background: 'var(--canvas)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '28px',
                  display: 'flex',
                  gap: '16px',
                  transition: 'border-color 0.3s',
                }}
              >
                <div style={{ color: 'var(--gold)' }}>
                  <Icon name={feat.icon} size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--ink)', margin: '0 0 8px 0', fontWeight: 600 }}>{feat.title}</h3>
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.5, color: 'var(--muted)', margin: 0 }}>{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── WHY HANDLOOM CONNECT ───────────────────────────────────────────── */}
      <section className="section-pad" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-10%' }}
            style={{ textAlign: 'center', marginBottom: '4rem' }}
          >
            <motion.p className="eyebrow" variants={fadeUp} style={{ justifyContent: 'center' }}>Why Handloom Connect</motion.p>
            <motion.h2 variants={fadeUp} style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', maxWidth: '700px', marginInline: 'auto' }}>
              The Core Philosophy
            </motion.h2>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-10%' }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '28px' }}
          >
            {WHY_HANDLOOM.map((v, i) => (
              <motion.div
                key={v.title}
                variants={fadeUp}
                custom={i}
                style={{
                  background: 'var(--canvas)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '36px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  transition: 'border-color 0.3s, box-shadow 0.3s',
                }}
                whileHover={{ borderColor: 'rgba(212,175,55,0.5)', boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(212,175,55,0.2)', y: -4 }}
              >
                <span style={{ fontSize: '2rem' }}>{v.icon}</span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 400, color: 'var(--ink)', margin: 0 }}>{v.title}</h3>
                <p style={{ fontSize: '0.93rem', lineHeight: 1.65, color: 'var(--muted)', margin: 0 }}>{v.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── TECHNOLOGY STACK ─────────────────────────────────────────── */}
      <section className="section-pad" style={{ background: 'var(--canvas-secondary)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-10%' }}
            style={{ textAlign: 'center', marginBottom: '4rem' }}
          >
            <motion.p className="eyebrow" variants={fadeUp} style={{ justifyContent: 'center' }}>Architecture</motion.p>
            <motion.h2 variants={fadeUp}>Technology Stack</motion.h2>
            <motion.p variants={fadeUp} style={{ color: 'var(--muted)', maxWidth: '600px', margin: '1rem auto 0' }}>
              Built with a modern, high-performance web architecture to deliver a seamless and engaging experience.
            </motion.p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', maxWidth: '1000px', marginInline: 'auto' }}>
            {TECH_STACK.map((tech, i) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{
                  padding: '24px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  background: 'var(--canvas)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '8px'
                }}
              >
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: tech.color, marginBottom: '8px', boxShadow: `0 0 10px ${tech.color}` }} />
                <strong style={{ color: 'var(--ink)', fontSize: '1.1rem' }}>{tech.name}</strong>
                <span style={{ fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{tech.category}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────── */}
      <section className="section-pad">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
            style={{
              textAlign: 'center',
              padding: 'clamp(60px, 8vw, 100px) clamp(24px, 5vw, 80px)',
              background: 'var(--canvas-secondary)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Decorative radial glow */}
            <div style={{ position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '300px', background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <p className="eyebrow" style={{ justifyContent: 'center' }}>Explore Handloom Connect</p>
            <h2 style={{ fontSize: 'clamp(2.4rem, 4vw, 4.2rem)', maxWidth: '680px', marginInline: 'auto', marginBottom: '1.4rem' }}>
              Discover the <span style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)' }}>digital ecosystem.</span>
            </h2>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '3rem' }}>
              <ButtonLink to="/marketplace" variant="primary">Explore Marketplace</ButtonLink>
              <ButtonLink to="/artisans" variant="ghost">Meet Artisans</ButtonLink>
              <ButtonLink to="/raw-materials" variant="ghost">Raw Materials</ButtonLink>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
