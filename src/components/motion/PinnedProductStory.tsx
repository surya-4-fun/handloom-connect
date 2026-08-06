import { useState } from 'react'
import { ButtonLink } from '../primitives/Button'
import { products } from '../../mocks/homeData'

const notes = [
  ['01 · Texture', 'Indigo, made dimensional.', 'Handspun yarn and a reversible weave create depth that changes gently with the light.'],
  ['02 · Drape', 'Silk with an easy presence.', 'A breathable Tussar surface carries the quiet irregularity that proves a human hand was here.'],
  ['03 · Everyday', 'Craft made to be lived with.', 'Table linen designed for daily rituals—not kept away for a distant special occasion.'],
]

export function PinnedProductStory() {
  const [activeIndex, setActiveIndex] = useState(0)

  const goToSlide = (newIndex: number) => {
    if (newIndex >= 0 && newIndex < notes.length) {
      setActiveIndex(newIndex)
    }
  }

  return (
    <section className="product-story" id="services" aria-label="Product stories" style={{ position: 'relative', padding: '110px 0 80px', minHeight: '85vh' }}>
      <div className="product-story__stage container" style={{ position: 'relative', height: 'auto', display: 'grid', gridTemplateColumns: '1.15fr .85fr', gridTemplateRows: 'auto 1fr', gap: '2rem' }}>
        
        {/* Header with Title & Arrow Controls */}
        <div className="product-story__heading" style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p className="eyebrow">Objects with a memory</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
            <button
              type="button"
              onClick={() => goToSlide(activeIndex - 1)}
              disabled={activeIndex === 0}
              aria-label="Previous story"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: activeIndex === 0 ? 'rgba(255,255,255,0.2)' : '#fff',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                cursor: activeIndex === 0 ? 'not-allowed' : 'pointer',
                display: 'grid',
                placeItems: 'center',
                fontSize: '16px',
                transition: 'all 0.25s ease',
              }}
            >
              ←
            </button>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--muted)', fontSize: '0.75rem', letterSpacing: '0.12em' }}>
              <i style={{ width: '38px', height: '1px', background: 'rgba(255,255,255,0.4)', display: 'inline-block' }} />
              {String(activeIndex + 1).padStart(2, '0')} / {String(notes.length).padStart(2, '0')}
            </span>
            <button
              type="button"
              onClick={() => goToSlide(activeIndex + 1)}
              disabled={activeIndex === notes.length - 1}
              aria-label="Next story"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: activeIndex === notes.length - 1 ? 'rgba(255,255,255,0.2)' : '#fff',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                cursor: activeIndex === notes.length - 1 ? 'not-allowed' : 'pointer',
                display: 'grid',
                placeItems: 'center',
                fontSize: '16px',
                transition: 'all 0.25s ease',
              }}
            >
              →
            </button>
          </div>
        </div>

        {/* Media Frame */}
        <div className="product-story__media" style={{ position: 'relative', minHeight: '480px', width: '100%' }}>
          {products.map((product, index) => {
            const isActive = index === activeIndex
            return (
              <figure
                className="product-story__visual"
                key={product.id}
                style={{
                  position: 'absolute',
                  inset: 0,
                  margin: 0,
                  opacity: isActive ? 1 : 0,
                  visibility: isActive ? 'visible' : 'hidden',
                  transform: isActive ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(20px)',
                  transition: 'opacity 0.5s cubic-bezier(0.25, 1, 0.5, 1), transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), visibility 0.5s',
                  pointerEvents: isActive ? 'auto' : 'none',
                }}
              >
                <div className="product-story__halo" />
                <img src={product.image} alt={product.alt} loading="lazy" style={{ width: '100%', height: '100%', maxHeight: '520px', objectFit: 'cover', borderRadius: '18px' }} />
                <figcaption>{String(index + 1).padStart(2, '0')} / 03</figcaption>
              </figure>
            )
          })}
        </div>

        {/* Content Article */}
        <div className="product-story__content" style={{ position: 'relative', minHeight: '480px', display: 'flex', alignItems: 'center' }}>
          {notes.map(([eyebrow, title, copy], index) => {
            const isActive = index === activeIndex
            return (
              <article
                className="product-story__copy"
                key={title}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  right: 0,
                  opacity: isActive ? 1 : 0,
                  visibility: isActive ? 'visible' : 'hidden',
                  transform: isActive ? 'translateY(-50%)' : 'translateY(calc(-50% + 30px))',
                  transition: 'opacity 0.5s cubic-bezier(0.25, 1, 0.5, 1), transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), visibility 0.5s',
                  pointerEvents: isActive ? 'auto' : 'none',
                }}
              >
                <p>{eyebrow}</p>
                <h2 style={{ margin: '0.8rem 0 1rem', fontSize: 'clamp(2.5rem, 4vw, 4.2rem)' }}>{title}</h2>
                <span style={{ fontSize: '1.05rem', lineHeight: 1.6 }}>{copy}</span>
                <div style={{ marginTop: '2rem' }}>
                  <ButtonLink to="/marketplace" variant="ghost">Discover the piece</ButtonLink>
                </div>
                <small style={{ marginTop: '1rem', display: 'block', color: 'var(--muted)' }}>
                  {products[index].name} · {products[index].price}
                </small>
              </article>
            )
          })}
        </div>

        {/* Interactive Progress Tabs */}
        <div style={{
          gridColumn: '1 / -1',
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          marginTop: '2rem',
        }}>
          {notes.map(([eyebrow], i) => (
            <button
              key={i}
              type="button"
              onClick={() => goToSlide(i)}
              aria-label={`Go to ${eyebrow}`}
              style={{
                background: 'none',
                border: 'none',
                padding: '8px 12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: i === activeIndex ? 'var(--gold)' : 'rgba(255,255,255,0.4)',
                fontSize: '0.75rem',
                letterSpacing: '0.12em',
                transition: 'all 0.3s ease',
              }}
            >
              <span
                style={{
                  width: i === activeIndex ? '28px' : '10px',
                  height: '3px',
                  borderRadius: '3px',
                  background: i === activeIndex ? 'var(--gold)' : 'rgba(255,255,255,0.25)',
                  transition: 'all 0.3s ease',
                }}
              />
              {eyebrow.split('·')[1]?.trim() || eyebrow}
            </button>
          ))}
        </div>

      </div>
    </section>
  )
}
