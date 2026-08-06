import { motion } from 'framer-motion'
const heroImage = 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=1200&auto=format&fit=crop'

export function AboutSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(4px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] }
    }
  }

  return (
    <section id="about" className="about-section section-pad">
      <div className="container about-grid">
        <motion.div 
          className="about-image-container"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
        >
          <div className="about-image-wrapper">
            <img 
              src={heroImage} 
              alt="Artisan working on a handloom loom" 
              className="about-image"
              loading="lazy"
            />
            <div className="about-image-overlay" />
          </div>
          <div className="about-image-badge">
            <span>Est. 2026</span>
          </div>
        </motion.div>

        <motion.div 
          className="about-content"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-15%' }}
        >
          <motion.div className="eyebrow" variants={itemVariants}>
            Our Story
          </motion.div>
          <motion.h2 className="about-title" variants={itemVariants}>
            Woven by hand.<br />
            <span>Designed for generations.</span>
          </motion.h2>
          <motion.p className="about-lead" variants={itemVariants}>
            Handloom Connect is a bridge between the rich heritage of Indian weavers and modern, conscious living. Every thread tells a story of patience, skill, and cultural survival.
          </motion.p>
          <motion.p className="about-body" variants={itemVariants}>
            We work directly with master craftspeople across Kanchipuram, Bhagalpur, Bengal, and Kutch. By replacing middlemen with direct, verifiable cluster relationships and tracing every fabric to its loom origin, we restore dignity, fair wages, and transparency to the makers of India's finest handwoven textiles.
          </motion.p>
          <motion.div className="about-stats" variants={itemVariants}>
            <div className="stat-item">
              <strong>120+</strong>
              <span>Verified Artisans</span>
            </div>
            <div className="stat-item">
              <strong>15+</strong>
              <span>Weaving Clusters</span>
            </div>
            <div className="stat-item">
              <strong>100%</strong>
              <span>Direct Trade</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
