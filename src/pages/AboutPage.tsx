import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { ButtonLink } from '../components/primitives/Button'

/* ─── Data ─────────────────────────────────────────────────────────── */

const STATS = [
  { value: '120+', label: 'Verified Artisans' },
  { value: '15+',  label: 'Weaving Clusters' },
  { value: '100%', label: 'Direct Trade' },
  { value: '2026', label: 'Est. Year' },
]

const VALUES = [
  {
    icon: '🧵',
    title: 'Radical Transparency',
    body: 'Every product is traced to the exact loom, cluster, and maker who created it. No anonymous supply chains, ever.',
  },
  {
    icon: '⚖️',
    title: 'Fair & Direct Wages',
    body: 'We eliminate middlemen entirely, ensuring artisans receive a just, verified share of every transaction.',
  },
  {
    icon: '🌿',
    title: 'Living Heritage',
    body: 'We document and preserve endangered weave techniques through structured knowledge transfer programmes.',
  },
  {
    icon: '🌍',
    title: 'Conscious Commerce',
    body: 'Natural dyes, minimal packaging, and zero synthetic blends. Sustainability isn\'t a label — it\'s the default.',
  },
]

const TIMELINE = [
  { year: '2024', event: 'Research begins', detail: 'Field research across Kanchipuram, Bhagalpur and Kutch to map living weave clusters.' },
  { year: '2025', event: 'First artisan network', detail: '40 verified artisans onboarded directly; first loom-origin traceability system launched.' },
  { year: '2026', event: 'Platform launch', detail: 'Handloom Connect goes live — bridging India\'s master weavers with thoughtful homes globally.' },
]

const TEAM = [
  {
    name: 'Arjun Mehta',
    role: 'Founder & Creative Director',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    quote: 'Craft is not nostalgia. It is a living economy.',
  },
  {
    name: 'Priya Nair',
    role: 'Head of Artisan Relations',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
    quote: 'Every thread tells a story of patient, invisible skill.',
  },
  {
    name: 'Kabir Singh',
    role: 'Technology & Provenance',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop',
    quote: 'Traceability is the new hallmark of quality.',
  },
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
  const [activeTimeline, setActiveTimeline] = useState(0)
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
          {/* Gradient overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,9,8,0.97) 0%, rgba(10,9,8,0.5) 50%, rgba(10,9,8,0.22) 100%)' }} />
          {/* Noise grain overlay */}
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
            <motion.p className="eyebrow" variants={fadeUp}>Our Story</motion.p>
            <motion.h1
              variants={fadeUp}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3.2rem, 7vw, 6.8rem)',
                fontWeight: 400,
                lineHeight: 0.95,
                letterSpacing: '-0.03em',
                marginBottom: '2rem',
              }}
            >
              Woven by hand.<br />
              <span style={{ color: 'var(--gold)' }}>Designed for generations.</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              style={{ fontSize: '1.15rem', lineHeight: 1.65, color: 'var(--muted)', maxWidth: '560px', marginBottom: '2.5rem' }}
            >
              Handloom Connect is a cultural technology platform bridging India's master weavers
              with thoughtful homes across the world — one traceable thread at a time.
            </motion.p>
            <motion.div variants={fadeUp} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <ButtonLink to="/artisans" variant="primary">Meet the Artisans</ButtonLink>
              <ButtonLink to="/marketplace" variant="ghost">Explore Collection</ButtonLink>
            </motion.div>
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

      {/* ─── OUR MISSION ──────────────────────────────────────── */}
      <section className="section-pad" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'clamp(40px, 8vw, 100px)', alignItems: 'center' }}>
            {/* Text */}
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-10%' }}
            >
              <motion.p className="eyebrow" variants={fadeUp}>Our Mission</motion.p>
              <motion.h2 variants={fadeUp} style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)', lineHeight: 1.05, marginBottom: '1.6rem' }}>
                Restoring dignity to <span style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)' }}>the invisible hand.</span>
              </motion.h2>
              <motion.p variants={fadeUp} style={{ fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--ink)', marginBottom: '1.2rem' }}>
                We work directly with master craftspeople across Kanchipuram, Bhagalpur, Bengal, and Kutch.
                By replacing exploitative middlemen with direct, verifiable cluster relationships, we restore
                fair wages, transparency, and cultural dignity to India's most skilled weavers.
              </motion.p>
              <motion.p variants={fadeUp} style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--muted)', marginBottom: '2rem' }}>
                Every fabric sold through Handloom Connect is traced to its exact loom of origin. Buyers receive a
                certificate of provenance documenting the artisan's name, cluster, weave technique, and dye source.
                No anonymous supply chains. No greenwashing. Just pure, honest craft.
              </motion.p>
              <motion.div variants={fadeUp}>
                <ButtonLink to="/origin-map" variant="secondary">Explore the Craft Map</ButtonLink>
              </motion.div>
            </motion.div>

            {/* Image collage */}
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
                  style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.02) brightness(0.92)', transition: 'transform 1.2s ease' }}
                  loading="lazy"
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,9,8,0.45) 0%, transparent 60%)' }} />
              </div>
              {/* Floating badge */}
              <div style={{
                position: 'absolute', bottom: '-18px', right: '-18px',
                background: 'var(--brand)', color: 'var(--canvas)',
                padding: '14px 22px', borderRadius: '6px',
                fontSize: '11px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase',
                boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
                zIndex: 2,
              }}>
                Est. 2026
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── VALUES ───────────────────────────────────────────── */}
      <section className="section-pad" style={{ background: 'var(--canvas-secondary)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-10%' }}
            style={{ textAlign: 'center', marginBottom: '4rem' }}
          >
            <motion.p className="eyebrow" variants={fadeUp} style={{ justifyContent: 'center' }}>What We Stand For</motion.p>
            <motion.h2 variants={fadeUp} style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', maxWidth: '700px', marginInline: 'auto' }}>
              Principles woven into every thread
            </motion.h2>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-10%' }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '28px' }}
          >
            {VALUES.map((v, i) => (
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

      {/* ─── TIMELINE ─────────────────────────────────────────── */}
      <section className="section-pad" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-10%' }}
            style={{ textAlign: 'center', marginBottom: '4rem' }}
          >
            <motion.p className="eyebrow" variants={fadeUp} style={{ justifyContent: 'center' }}>The Journey</motion.p>
            <motion.h2 variants={fadeUp}>From idea to movement</motion.h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2px', maxWidth: '900px', marginInline: 'auto' }}>
            {TIMELINE.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.75, ease: [0.25, 1, 0.5, 1], delay: i * 0.15 }}
                onClick={() => setActiveTimeline(i)}
                style={{
                  cursor: 'pointer',
                  padding: '36px 28px',
                  borderRadius: 'var(--radius-lg)',
                  border: `1px solid ${activeTimeline === i ? 'rgba(212,175,55,0.6)' : 'var(--border)'}`,
                  background: activeTimeline === i ? 'rgba(212,175,55,0.04)' : 'var(--canvas-secondary)',
                  transition: 'all 0.35s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {activeTimeline === i && (
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />
                )}
                <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: '3.5rem', color: activeTimeline === i ? 'var(--gold)' : 'rgba(212,175,55,0.25)', lineHeight: 1, marginBottom: '0.5rem', transition: 'color 0.35s' }}>
                  {item.year}
                </span>
                <strong style={{ display: 'block', color: 'var(--ink)', marginBottom: '0.6rem', fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: '1.3rem' }}>
                  {item.event}
                </strong>
                <p style={{ fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--muted)', margin: 0 }}>{item.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TEAM ─────────────────────────────────────────────── */}
      <section className="section-pad" style={{ background: 'var(--canvas-secondary)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-10%' }}
            style={{ textAlign: 'center', marginBottom: '4rem' }}
          >
            <motion.p className="eyebrow" variants={fadeUp} style={{ justifyContent: 'center' }}>The People</motion.p>
            <motion.h2 variants={fadeUp}>Behind the platform</motion.h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-10%' }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}
          >
            {TEAM.map((member, i) => (
              <motion.div
                key={member.name}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -6 }}
                style={{
                  background: 'var(--canvas)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  transition: 'box-shadow 0.3s',
                }}
              >
                <div style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden' }}>
                  <img
                    src={member.image}
                    alt={member.name}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.8s ease' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)')}
                    onMouseLeave={e => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1)')}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,9,8,0.9) 0%, transparent 55%)' }} />
                  <div style={{ position: 'absolute', bottom: '20px', left: '22px', right: '22px' }}>
                    <span style={{ color: 'var(--gold)', fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase' }}>{member.role}</span>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', color: 'var(--ink)', margin: '4px 0 0', fontWeight: 400 }}>{member.name}</h3>
                  </div>
                </div>
                <div style={{ padding: '22px 24px' }}>
                  <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--muted)', lineHeight: 1.6, fontStyle: 'italic' }}>
                    "{member.quote}"
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
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
            <p className="eyebrow" style={{ justifyContent: 'center' }}>Join the Movement</p>
            <h2 style={{ fontSize: 'clamp(2.4rem, 5vw, 4.2rem)', maxWidth: '680px', marginInline: 'auto', marginBottom: '1.4rem' }}>
              Every purchase is an act of <span style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)' }}>cultural preservation.</span>
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '1.05rem', maxWidth: '520px', marginInline: 'auto', lineHeight: 1.65, marginBottom: '2.5rem' }}>
              Discover handwoven textiles with a verified story. Shop the collection or connect with an artisan directly.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <ButtonLink to="/marketplace" variant="primary">Shop the Collection</ButtonLink>
              <ButtonLink to="/artisans" variant="ghost">Meet the Makers</ButtonLink>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
