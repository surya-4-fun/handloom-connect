import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { SiteHeader } from '../components/navigation/SiteHeader'
import { SiteFooter } from '../components/navigation/SiteFooter'
import { FloatingChatbot } from '../components/navigation/FloatingChatbot'
import { CinematicIntro } from '../components/motion/CinematicIntro'

export function AppLayout() {
  const { pathname, hash } = useLocation()

  // Route & Hash Scroll Handling with Native Browser Smooth Scroll & Fixed Header Offset
  useEffect(() => {
    if (hash) {
      const targetId = hash.replace('#', '')
      const timer = setTimeout(() => {
        const el = document.getElementById(targetId)
        if (el) {
          const y = el.getBoundingClientRect().top + window.pageYOffset - 85
          window.scrollTo({ top: y, behavior: 'smooth' })
        }
      }, 250)
      return () => clearTimeout(timer)
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }

    document.body.style.cursor = ''
    document.body.style.removeProperty('cursor')
  }, [pathname, hash])

  return (
    <>
      <CinematicIntro />
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
            style={{ width: '100%' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <SiteFooter />
      <FloatingChatbot />
    </>
  )
}
