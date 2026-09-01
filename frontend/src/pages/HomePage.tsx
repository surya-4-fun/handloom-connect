import { useEffect } from 'react'
import { SpiralHero } from '../components/motion/SpiralHero'
import { ContactSection } from '../components/sections/ContactSection'

export function HomePage() {
  // Lock body/html overflow when at the top of the Homepage hero section
  useEffect(() => {
    const handleScrollState = () => {
      if (window.scrollY < 50) {
        document.body.style.overflow = 'hidden'
        document.documentElement.style.overflow = 'hidden'
      }
    }

    handleScrollState()

    const onScroll = () => {
      if (window.scrollY < 50) {
        document.body.style.overflow = 'hidden'
        document.documentElement.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
        document.documentElement.style.overflow = ''
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [])

  return (
    <>
      <div
        className="homepage-hero-wrapper"
        style={{
          height: '100vh',
          width: '100vw',
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
