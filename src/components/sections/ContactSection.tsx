import { useState } from 'react'
import { motion } from 'framer-motion'

export function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setForm({ name: '', email: '', message: '' })
      setSubmitted(false)
    }, 3000)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 24, filter: 'blur(2px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] }
    }
  }

  return (
    <section id="contact" className="contact-section section-pad">
      <div className="container contact-grid">
        <motion.div 
          className="contact-info"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-15%' }}
        >
          <motion.div className="eyebrow" variants={itemVariants}>
            Connect
          </motion.div>
          <motion.h2 className="contact-title" variants={itemVariants}>
            Begin a<br />
            <span>conversation.</span>
          </motion.h2>
          <motion.p className="contact-description" variants={itemVariants}>
            Have questions about loom locations, custom textiles, or artisan partnerships? Get in touch with our team.
          </motion.p>
          
          <motion.div className="contact-details" variants={itemVariants}>
            <div className="detail-item">
              <span className="detail-label">Office & Studio</span>
              <span className="detail-value">Lodi Colony, New Delhi, India</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Coordinates</span>
              <span className="detail-value">28.5873° N, 77.2253° E</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Inquiries</span>
              <a href="mailto:hello@handloomconnect.in" className="detail-link">
                hello@handloomconnect.in
              </a>
            </div>
          </motion.div>

          <motion.div className="contact-socials" variants={itemVariants}>
            <a href="#instagram" className="social-link">Instagram</a>
            <a href="#journal" className="social-link">Craft Journal</a>
            <a href="#pinterest" className="social-link">Pinterest</a>
          </motion.div>
        </motion.div>

        <motion.div 
          className="contact-form-container"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
        >
          {submitted ? (
            <motion.div 
              className="form-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="success-icon">✓</div>
              <h3>Message Received</h3>
              <p>Thank you for reaching out. We will get back to you within 24 hours.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <input 
                  type="text" 
                  id="name"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder=" " 
                />
                <label htmlFor="name">Your Name</label>
              </div>

              <div className="form-group">
                <input 
                  type="email" 
                  id="email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder=" " 
                />
                <label htmlFor="email">Email Address</label>
              </div>

              <div className="form-group">
                <textarea 
                  id="message" 
                  required
                  rows={4}
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder=" "
                />
                <label htmlFor="message">Message</label>
              </div>

              <button type="submit" className="button button--primary button--gold-glow">
                Send Message
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}
