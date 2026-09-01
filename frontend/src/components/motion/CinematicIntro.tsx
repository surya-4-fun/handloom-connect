import { useCallback, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useIntroAnimation } from '../../hooks/useIntroAnimation'

const SESSION_KEY = 'hc-cinematic-intro-v2-seen'

export function CinematicIntro() {
  const { pathname } = useLocation()
  const scope = useRef<HTMLDivElement>(null)
  const [shouldPlay] = useState(() => pathname === '/' && sessionStorage.getItem(SESSION_KEY) !== 'true')
  const [isMounted, setIsMounted] = useState(shouldPlay)

  const removeOverlay = useCallback(() => {
    if (shouldPlay) sessionStorage.setItem(SESSION_KEY, 'true')
    document.documentElement.dataset.introState = 'complete'
    window.dispatchEvent(new CustomEvent('hc:intro-complete'))
    setIsMounted(false)
  }, [shouldPlay])

  useIntroAnimation({ scope, enabled: shouldPlay && isMounted, onComplete: removeOverlay })

  if (!isMounted) return null
  return <div ref={scope} className="cinematic-intro cinematic-intro--v2" aria-hidden="true">
    <div className="intro-curtain intro-curtain--left"><span className="intro-curtain__texture"/><span className="intro-curtain__edge"/></div>
    <div className="intro-curtain intro-curtain--right"><span className="intro-curtain__texture"/><span className="intro-curtain__edge"/></div>
    <div className="intro-logo">
      <span className="intro-logo__mark">HC</span>
      <strong>Handloom <i>Connect</i></strong>
      <svg className="intro-thread" viewBox="0 0 240 22" role="presentation">
        <defs><linearGradient id="silk-gold" x1="0" x2="1"><stop offset="0" stopColor="#8C6A1D"/><stop offset=".45" stopColor="#C8A24C"/><stop offset=".7" stopColor="#E0C06A"/><stop offset="1" stopColor="#8C6A1D"/></linearGradient></defs>
        <path data-intro-thread d="M2 11 C31 7 43 14 72 10 C98 6 119 15 146 10 C176 5 198 14 238 9"/>
      </svg>
    </div>
  </div>
}
