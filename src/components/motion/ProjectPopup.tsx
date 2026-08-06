import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProjectPopupProps {
  project: {
    id: string | number;
    title: string;
    detail: string;
    src: string;
    lg?: string;
    accent?: number[];
    to?: string; // Route link to navigate to
  };
  onClose: () => void;
}

export function ProjectPopup({ project, onClose }: ProjectPopupProps) {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [progress, setProgress] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const dialRef = useRef<HTMLDivElement>(null);
  const rotateRef = useRef<HTMLDivElement>(null);

  const progressRef = useRef(0);
  const holdActiveRef = useRef(false);
  const animFrameIdRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const dialRotationRef = useRef<number>(0);

  // Character array for the circular holding ring
  const circleText = "HOLD TO EXPLORE PIECE  HOLD TO EXPLORE PIECE  ";
  const textChars = Array.from(circleText);

  useEffect(() => {
    setIsMobile(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  const handleNavigate = useCallback(() => {
    onClose();
    if (project.to) {
      navigate(project.to);
    } else {
      navigate('/marketplace');
    }
  }, [project.to, navigate, onClose]);

  // Entrance animations
  useEffect(() => {
    const container = containerRef.current;
    const card = cardRef.current;
    const text = textRef.current;
    if (!container || !card || !text) return;

    // Direct DOM styling for high performance spring physics transitions
    container.style.opacity = '0';
    container.style.transition = 'opacity 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
    
    card.style.transform = 'translateY(40px) scale(0.95)';
    card.style.opacity = '0';
    card.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s cubic-bezier(0.25, 1, 0.5, 1)';

    text.style.transform = 'translateY(15px)';
    text.style.opacity = '0';
    text.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1) 0.15s, opacity 0.5s cubic-bezier(0.25, 1, 0.5, 1) 0.15s';

    requestAnimationFrame(() => {
      container.style.opacity = '1';
      card.style.transform = 'translateY(0) scale(1)';
      card.style.opacity = '1';
      text.style.transform = 'translateY(0)';
      text.style.opacity = '1';
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClose = () => {
    const container = containerRef.current;
    const card = cardRef.current;
    if (container && card) {
      container.style.opacity = '0';
      card.style.transform = 'translateY(25px) scale(0.97)';
      card.style.opacity = '0';
      setTimeout(onClose, 400);
    } else {
      onClose();
    }
  };

  // Hold loop updating progress
  useEffect(() => {
    const updateLoop = (now: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = now;
      const dt = Math.min(0.05, (now - lastTimeRef.current) / 1000);
      lastTimeRef.current = now;

      // Update hold progress
      if (holdActiveRef.current) {
        progressRef.current = Math.min(1.0, progressRef.current + dt / 1.2); // 1.2s to fully hold
      } else {
        progressRef.current = Math.max(0.0, progressRef.current - dt / 0.3); // rapid fade out
      }
      setProgress(progressRef.current);

      // Rotate dial ring
      dialRotationRef.current = (dialRotationRef.current + 45 * dt) % 360;
      if (rotateRef.current) {
        rotateRef.current.style.transform = `rotate(${dialRotationRef.current}deg)`;
      }

      // Check if complete
      if (progressRef.current >= 1.0 && holdActiveRef.current) {
        holdActiveRef.current = false;
        handleNavigate();
        return;
      }

      animFrameIdRef.current = requestAnimationFrame(updateLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(updateLoop);
    return () => cancelAnimationFrame(animFrameIdRef.current);
  }, [handleNavigate]);

  const updateDialPosition = (clientX: number, clientY: number) => {
    const dial = dialRef.current;
    if (!dial) return;
    dial.style.transform = `translate3d(${clientX - 55}px, ${clientY - 55}px, 0)`;
  };

  // Dial mouse controls
  const handlePointerEnter = (e: React.PointerEvent) => {
    if (isMobile) return;
    const dial = dialRef.current;
    if (dial) dial.style.opacity = '1';
    updateDialPosition(e.clientX, e.clientY);
    lastTimeRef.current = performance.now();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isMobile) return;
    updateDialPosition(e.clientX, e.clientY);
  };

  const handlePointerLeave = () => {
    if (isMobile) return;
    const dial = dialRef.current;
    if (dial) dial.style.opacity = '0';
    holdActiveRef.current = false;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button === 0) { // left click
      holdActiveRef.current = true;
    }
  };

  const handlePointerUp = () => {
    holdActiveRef.current = false;
  };

  return (
    <div
      ref={containerRef}
      role="presentation"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      className="project-popup-overlay"
    >
      <div className="project-popup-content-wrapper">
        <div
          ref={cardRef}
          role="button"
          tabIndex={0}
          aria-label={`Explore ${project.title}`}
          onPointerEnter={handlePointerEnter}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onClick={() => isMobile && handleNavigate()}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleNavigate()}
          className="project-popup-card"
          style={{ cursor: isMobile ? 'pointer' : 'none' }}
        >
          <img
            src={project.lg || project.src}
            alt={project.title}
            onLoad={() => setLoaded(true)}
            className={`project-popup-image ${loaded ? 'is-loaded' : ''}`}
          />
          
          {/* Close button inside card for convenience */}
          <button 
            type="button" 
            onClick={(e) => { e.stopPropagation(); handleClose(); }}
            className="project-popup-close-btn"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div ref={textRef} className="project-popup-text-row">
          <span className="project-popup-title">{project.title}</span>
          <span className="project-popup-detail">{project.detail}</span>
        </div>
      </div>

      {/* Floating Hold Dial element */}
      {!isMobile && (
        <div
          ref={dialRef}
          aria-hidden="true"
          className="project-popup-dial"
          style={{ opacity: 0 }}
        >
          {/* Circular progress SVG */}
          <svg className="project-popup-dial-svg" viewBox="0 0 110 110">
            <circle
              cx="55"
              cy="55"
              r="50"
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="2.5"
            />
            <circle
              cx="55"
              cy="55"
              r="50"
              fill="none"
              stroke="#C8A24C" // Accent Gold
              strokeWidth="3"
              strokeDasharray="314.16"
              strokeDashoffset={314.16 * (1 - progress)}
              transform="rotate(-90 55 55)"
              strokeLinecap="round"
            />
          </svg>
          
          {/* Center visual dot / arrow */}
          <div className="project-popup-dial-center">
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
              <path
                d="M5 13L13 5M13 5H6.5M13 5V11.5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Rotated circular letters wrapper */}
          <div ref={rotateRef} className="project-popup-dial-letters">
            {textChars.map((char, index) => {
              const angle = (index / textChars.length) * 360;
              const active = index < Math.round(progress * textChars.length);
              return (
                <span
                  key={index}
                  className="project-popup-dial-char"
                  style={{
                    transform: `rotate(${angle}deg)`,
                    color: active ? '#C8A24C' : '#F5F2EA',
                    textShadow: active ? '0 0 8px rgba(200,162,76,0.6)' : 'none'
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
