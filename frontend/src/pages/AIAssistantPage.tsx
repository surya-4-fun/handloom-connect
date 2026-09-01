import { useState } from 'react'

interface Message {
  id: string
  sender: 'ai' | 'user'
  text: string
  recommendations?: { title: string; craft: string; price: string }[]
}

export function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Greetings. I am your Handloom Connect AI Curator & Stylist. Tell me about the occasion, textile drape preference, or region you wish to explore today.',
      recommendations: [
        { title: 'Banarasi Real Zari Katan Silk Saree', craft: 'Varanasi Weave', price: '₹48,500' },
        { title: 'Kashmiri Hand-Embroidered Pashmina', craft: 'Sozni Needlework', price: '₹62,000' }
      ]
    }
  ])
  const [input, setInput] = useState('')

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: input }
    setMessages(prev => [...prev, userMsg])
    const prompt = input.toLowerCase()
    setInput('')

    setTimeout(() => {
      let aiText = "Thank you for sharing your preference. Based on heirloom weaving techniques and textile draping characteristics, I recommend examining our authentic Mulberry Silk or Tussar collection."
      let recs = [
        { title: 'Kanchipuram Temple Border Korvai Silk', craft: 'Korvai Weave', price: '₹39,200' },
        { title: 'Dhakai Jamdani Fine Muslin Saree', craft: 'Phulia Weave', price: '₹28,400' }
      ]

      if (prompt.includes('wedding') || prompt.includes('bridal') || prompt.includes('heavy')) {
        aiText = "For wedding celebrations and formal occasions, nothing matches the weight and gold luster of Real Zari Banarasi Katan or Kanchipuram Korvai silk."
        recs = [
          { title: 'Banarasi Real Zari Katan Silk Saree', craft: 'Banarasi Brocade', price: '₹48,500' },
          { title: 'Kanchipuram Temple Border Korvai Silk', craft: 'Kanchipuram Silk', price: '₹39,200' }
        ]
      } else if (prompt.includes('winter') || prompt.includes('shawl') || prompt.includes('warm')) {
        aiText = "For cold weather elegance, hand-spun Ladakhi Pashmina with fine Sozni needlework offers featherweight insulation and timeless refinement."
        recs = [
          { title: 'Kashmiri Hand-Embroidered Pashmina Shawl', craft: 'Sozni Needlework', price: '₹62,000' }
        ]
      }

      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'ai', text: aiText, recommendations: recs }])
    }, 600)
  }

  return (
    <div className="ai-assistant-page section-pad" style={{ background: 'var(--canvas)', color: 'var(--ink)', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p className="eyebrow" style={{ justifyContent: 'center' }}>AI Concierge & Curator</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 400 }}>
            Personal Handloom Stylist
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '1rem' }}>
            Powered by craft history, weave attributes, and personal styling intelligence.
          </p>
        </div>

        <div style={{ background: 'var(--canvas-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', minHeight: '480px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', marginBottom: '20px' }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                <div style={{
                  padding: '16px 20px',
                  borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                  background: msg.sender === 'user' ? 'rgba(212,175,55,0.18)' : 'var(--surface)',
                  border: msg.sender === 'user' ? '1px solid var(--gold)' : '1px solid var(--border)',
                  color: 'var(--ink)',
                  fontSize: '0.95rem',
                  lineHeight: 1.5
                }}>
                  {msg.text}
                </div>

                {msg.recommendations && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '12px' }}>
                    {msg.recommendations.map(rec => (
                      <div key={rec.title} style={{ padding: '12px', background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                        <span style={{ color: 'var(--gold)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{rec.craft}</span>
                        <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: 'var(--ink)', margin: '4px 0 8px' }}>{rec.title}</h4>
                        <strong style={{ color: 'var(--gold)', fontSize: '0.9rem' }}>{rec.price}</strong>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about sarees for a wedding, winter shawls, or indigo textiles..."
              style={{
                flexGrow: 1,
                padding: '14px 20px',
                borderRadius: '100px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--ink)',
                fontSize: '0.95rem',
                outline: 'none'
              }}
            />
            <button type="submit" className="button button--primary" style={{ borderRadius: '100px', padding: '0 28px' }}>
              Consult
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
