import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { aiChatService, ChatMessage } from '../services/aiChatService'

export function AIAssistantPage() {
  const [searchParams] = useSearchParams()
  const productId = searchParams.get('productId') || searchParams.get('product') || undefined
  const artisanId = searchParams.get('artisanId') || searchParams.get('artisan') || undefined
  const rawMaterialId = searchParams.get('materialId') || searchParams.get('rawMaterialId') || undefined

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: productId 
        ? `Greetings. I am your Handloom Connect AI Curator & Stylist. I see you are consulting regarding item "${productId}". Ask me about its weave, authenticity, artisan lineage, or occasion pairing.`
        : artisanId
        ? `Greetings. I am your Handloom Connect AI Curator. You are viewing artisan profile "${artisanId}". Inquire about their heritage lineage, master techniques, or regional craft.`
        : rawMaterialId
        ? `Greetings. I am your Handloom Connect AI Assistant. You are inspecting material reference "${rawMaterialId}". Ask me about fiber origin, sustainability, or technical specifications.`
        : 'Greetings. I am your Handloom Connect AI Curator & Stylist. Tell me about the occasion, textile drape preference, or region you wish to explore today.'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userText = input.trim()
    const userMsgId = Date.now().toString()
    const aiMsgId = (Date.now() + 1).toString()

    const userMsg: ChatMessage = { id: userMsgId, sender: 'user', text: userText }
    const aiPlaceholder: ChatMessage = { id: aiMsgId, sender: 'ai', text: '' }

    setMessages(prev => [...prev, userMsg, aiPlaceholder])
    setInput('')
    setIsLoading(true)

    try {
      // Send only recent 6 messages to keep request payload compact and fast
      const historyForApi = messages.slice(-6).map(msg => ({
        sender: msg.sender,
        text: msg.text
      }))

      const response = await aiChatService.sendMessage(
        {
          message: userText,
          history: historyForApi,
          context: {
            currentPage: productId ? 'product_detail' : artisanId ? 'artisan_detail' : rawMaterialId ? 'raw_materials' : 'assistant',
            productId,
            artisanId,
            rawMaterialId
          }
        },
        {
          onDelta: (accumulated) => {
            setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, text: accumulated } : m))
          }
        }
      )

      const replyText = response?.reply ?? ''
      if (!replyText) {
        throw new Error('Received an empty response from the AI service. Please try again.')
      }

      setMessages(prev => prev.map(m => m.id === aiMsgId ? {
        ...m,
        text: replyText,
        recommendations: response?.suggestions,
        materialSuggestions: response?.materialSuggestions
      } : m))
    } catch (error: unknown) {
      console.error('Error fetching AI response:', error)
      setMessages(prev => prev.map(m => m.id === aiMsgId ? {
        ...m,
        text: m.text ? m.text : (error instanceof Error ? error.message : 'I apologize, but I am having trouble connecting to my knowledge base right now. Please try again in a moment.')
      } : m))
    } finally {
      setIsLoading(false)
    }
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
          
          {(productId || artisanId || rawMaterialId) && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
              fontSize: '0.8rem',
              color: 'var(--gold)',
              background: 'rgba(212, 175, 55, 0.08)',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              padding: '6px 14px',
              borderRadius: '100px',
              width: 'fit-content'
            }}>
              <span>✦</span>
              <span>
                Active Context: {productId ? `Product (${productId})` : artisanId ? `Artisan (${artisanId})` : `Material (${rawMaterialId})`}
              </span>
            </div>
          )}

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
                  {msg.text || (isLoading && msg.sender === 'ai' ? 'Consulting weaving archives...' : '')}
                </div>

                {msg.recommendations && msg.recommendations.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginTop: '12px' }}>
                    {msg.recommendations.map((rec, idx) => (
                      <div key={`${rec.title}-${idx}`} style={{ padding: '14px', background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span style={{ color: 'var(--gold)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{rec.craft}</span>
                        <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: 'var(--ink)', margin: '0' }}>{rec.title}</h4>
                        <strong style={{ color: 'var(--gold)', fontSize: '0.95rem' }}>{rec.price}</strong>
                        {rec.reason && (
                          <p style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: '4px 0 0', lineHeight: 1.4 }}>
                            {rec.reason}
                          </p>
                        )}
                        {(rec.id || rec.productId) && (
                          <Link 
                            to={`/marketplace/${rec.id || rec.productId}`}
                            style={{
                              marginTop: '8px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.8rem',
                              fontWeight: 500,
                              color: 'var(--gold)',
                              textDecoration: 'none'
                            }}
                          >
                            View Product →
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {msg.materialSuggestions && msg.materialSuggestions.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginTop: '12px' }}>
                    {msg.materialSuggestions.map((mat, idx) => (
                      <div key={`${mat.name}-${idx}`} style={{ padding: '14px', background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span style={{ color: 'var(--gold)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{mat.category || 'Raw Material'}</span>
                        <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: 'var(--ink)', margin: '0' }}>{mat.name}</h4>
                        <strong style={{ color: 'var(--gold)', fontSize: '0.95rem' }}>{mat.price} {mat.unit ? `(${mat.unit})` : ''}</strong>
                        {mat.origin && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Origin: {mat.origin}</span>
                        )}
                        {mat.reason && (
                          <p style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: '4px 0 0', lineHeight: 1.4 }}>
                            {mat.reason}
                          </p>
                        )}
                        <Link 
                          to="/raw-materials"
                          style={{
                            marginTop: '8px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.8rem',
                            fontWeight: 500,
                            color: 'var(--gold)',
                            textDecoration: 'none'
                          }}
                        >
                          View in Catalog →
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoading && !messages.some(m => m.sender === 'ai' && !m.text) && (
              <div style={{ alignSelf: 'flex-start', maxWidth: '80%' }}>
                 <div style={{
                  padding: '16px 20px',
                  borderRadius: '20px 20px 20px 4px',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  color: 'var(--muted)',
                  fontSize: '0.95rem',
                  fontStyle: 'italic'
                }}>
                  Consulting weaving archives...
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={isLoading}
              placeholder="Ask about sarees for a wedding, winter shawls, or indigo textiles..."
              style={{
                flexGrow: 1,
                padding: '14px 20px',
                borderRadius: '100px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--ink)',
                fontSize: '0.95rem',
                outline: 'none',
                opacity: isLoading ? 0.7 : 1
              }}
            />
            <button type="submit" disabled={isLoading} className="button button--primary" style={{ borderRadius: '100px', padding: '0 28px', opacity: isLoading ? 0.7 : 1 }}>
              {isLoading ? 'Thinking...' : 'Consult'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
