import { useState } from 'react'
import { Icon } from '../primitives/Icon'
import { aiChatService } from '../../services/aiChatService'

interface Message {
  id: string
  sender: 'ai' | 'user'
  text: string
  recommendations?: { title: string; craft: string; price: string }[]
}

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Greetings. I am your Handloom Connect AI Curator. Looking for a specific weave, occasion outfit, or artisan story today?',
      recommendations: [
        { title: 'Banarasi Real Zari Katan Silk', craft: 'Banarasi Brocade', price: '₹48,500' },
        { title: 'Kashmiri Hand-Embroidered Pashmina', craft: 'Sozni Needlework', price: '₹62,000' }
      ]
    }
  ])
  const [input, setInput] = useState('')

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userText = input.trim()
    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: userText }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    try {
      const historyForApi = messages.map(msg => ({
        sender: msg.sender,
        text: msg.text
      }))

      const response = await aiChatService.sendMessage({
        message: userText,
        history: historyForApi,
        context: { currentPage: 'floating_widget' }
      })

      const replyText = response?.reply || "Thank you for asking. Based on heirloom weave characteristics, I recommend examining our Mulberry Silk or Tussar collection."
      const recs = response?.suggestions?.map(s => ({
        title: s.title,
        craft: s.craft,
        price: s.price
      }))

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: replyText,
        recommendations: recs && recs.length > 0 ? recs : undefined
      }])
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "I am having trouble connecting to my curator assistant right now. Please try again in a moment."
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Persistent Floating Chatbot Icon at Bottom Right */}
      <button
        onClick={() => setIsOpen(v => !v)}
        aria-label="Open AI Curator Stylist Chatbot"
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          zIndex: 999,
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #D4AF37 0%, #9A7B23 100%)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          color: '#0A0908',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(212, 175, 55, 0.4)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease'
        }}
        className="floating-chatbot-btn"
      >
        <Icon name="sparkles" size={26} />
      </button>

      {/* Popup AI Chatbot Window Overlay */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '30px',
            zIndex: 1000,
            width: '380px',
            maxWidth: 'calc(100vw - 40px)',
            height: '520px',
            background: 'var(--surface)',
            border: '1px solid var(--gold)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(212, 175, 55, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            backdropFilter: 'blur(16px)',
            animation: 'chatbot-slide-up 0.35s ease'
          }}
        >
          {/* Header */}
          <div style={{ padding: '16px 20px', background: 'var(--canvas-secondary)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(212,175,55,0.2)', border: '1px solid var(--gold)', display: 'grid', placeItems: 'center', color: 'var(--gold)' }}>
                <Icon name="sparkles" size={16} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>AI Curator & Stylist</strong>
                <small style={{ fontSize: '0.68rem', color: 'var(--gold)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Handloom Connect Atelier</small>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '18px' }}>✕</button>
          </div>

          {/* Messages Container */}
          <div style={{ flexGrow: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                <div style={{
                  padding: '12px 16px',
                  borderRadius: msg.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                  background: msg.sender === 'user' ? 'rgba(212,175,55,0.2)' : 'var(--canvas-secondary)',
                  border: msg.sender === 'user' ? '1px solid var(--gold)' : '1px solid var(--border)',
                  color: 'var(--ink)',
                  fontSize: '0.88rem',
                  lineHeight: '1.5'
                }}>
                  {msg.text}
                </div>

                {msg.recommendations && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                    {msg.recommendations.map(rec => (
                      <div key={rec.title} style={{ padding: '8px 12px', background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                        <span style={{ color: 'var(--gold)', fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{rec.craft}</span>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', color: 'var(--ink)' }}>{rec.title}</div>
                        <strong style={{ color: 'var(--gold)', fontSize: '0.8rem' }}>{rec.price}</strong>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} style={{ padding: '12px', borderTop: '1px solid var(--border)', background: 'var(--canvas-secondary)', display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about sarees, dyes, or shawls..."
              style={{
                flexGrow: 1,
                padding: '10px 14px',
                borderRadius: '100px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--ink)',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
            <button type="submit" className="button button--primary" style={{ borderRadius: '100px', padding: '0 16px', minHeight: '38px', fontSize: '0.7rem' }}>
              Send
            </button>
          </form>
        </div>
      )}
    </>
  )
}
