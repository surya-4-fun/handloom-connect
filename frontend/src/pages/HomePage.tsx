import { SpiralHero } from '../components/motion/SpiralHero'
import { ContactSection } from '../components/sections/ContactSection'

export function HomePage() {
  return (
    <>
      <div
        className="homepage-hero-wrapper"
        style={{
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <SpiralHero />
      </div>
      <ContactSection />
    </>
  )
}
