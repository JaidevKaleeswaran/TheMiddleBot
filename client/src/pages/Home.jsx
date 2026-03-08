import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Zap, Shield, Clock, BarChart3, Phone, CalendarCheck } from 'lucide-react'
import './Home.css'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] },
  }),
}

const features = [
  {
    icon: <Zap size={22} />,
    title: 'Instant Lead Scoring',
    desc: 'AI analyzes every conversation in real-time. Know who is ready to buy before they leave the open house.',
  },
  {
    icon: <Phone size={22} />,
    title: 'Voice-First Follow-Up',
    desc: 'Personalized voice memos generated and delivered in under 60 seconds. Sound like you, even when you are not there.',
  },
  {
    icon: <Clock size={22} />,
    title: 'The 5-Minute Rule, Automated',
    desc: 'Never miss the critical follow-up window. The MiddleBot acts the moment a lead shows intent.',
  },
  {
    icon: <CalendarCheck size={22} />,
    title: 'Priority Scheduling',
    desc: 'Hot leads get immediate calendar slots. Cold leads get nurture sequences. All hands-free.',
  },
  {
    icon: <Shield size={22} />,
    title: 'Your Digital Twin',
    desc: 'The MiddleBot mirrors your tone, style, and priorities. Prospects feel your personal touch — always.',
  },
  {
    icon: <BarChart3 size={22} />,
    title: 'Pipeline Intelligence',
    desc: 'Track every lead from first word to closed deal. Know exactly where your revenue is coming from.',
  },
]

const stats = [
  { value: '$30K', label: 'Average revenue lost per missed lead' },
  { value: '78%', label: 'Of leads go to the first agent who responds' },
  { value: '<60s', label: 'The MiddleBot average response time' },
  { value: '3.2×', label: 'More conversions with automated follow-up' },
]

export default function Home() {
  return (
    <main className="home">
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg-glow" aria-hidden="true" />
        <div className="container hero-content">
          <motion.p
            className="hero-eyebrow"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            Agentic Middleware for Real Estate
          </motion.p>

          <motion.h1
            className="hero-title"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            Never lose a lead<br />
            <span className="hero-title-accent">to silence again.</span>
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            The MiddleBot is your autonomous digital twin — capturing conversations, 
            scoring intent, and delivering personalized follow-ups before your 
            competitors even pick up the phone.
          </motion.p>

          <motion.div
            className="hero-actions"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
          >
            <Link to="/login" className="btn btn-primary">
              Start Free Trial
              <ArrowRight size={16} />
            </Link>
            <a href="#how-it-works" className="btn btn-ghost">
              See How It Works
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <section className="stats-strip">
        <div className="container stats-strip-inner">
          {stats.map((stat, i) => (
            <motion.div
              className="stat-item"
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              custom={i}
            >
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="section" id="how-it-works">
        <div className="container">
          <motion.div
            className="section-header"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <p className="section-eyebrow">The Pipeline</p>
            <h2 className="section-title">
              From conversation to conversion,<br />
              <span className="hero-title-accent">entirely on autopilot.</span>
            </h2>
          </motion.div>

          <div className="pipeline-steps">
            {[
              { step: '01', title: 'Capture', desc: 'Live transcription captures every word from open houses, showings, and calls.' },
              { step: '02', title: 'Analyze', desc: 'AI scores intent, urgency, and budget fit in milliseconds.' },
              { step: '03', title: 'Act', desc: 'Personalized voice memos, SMS, and calendar invites deploy instantly.' },
              { step: '04', title: 'Close', desc: 'Hot leads get priority. Your pipeline stays full. Deals close faster.' },
            ].map((item, i) => (
              <motion.div
                className="pipeline-card"
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                custom={i}
              >
                <span className="pipeline-step-num">{item.step}</span>
                <h3 className="pipeline-step-title">{item.title}</h3>
                <p className="pipeline-step-desc">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="section section--alt">
        <div className="container">
          <motion.div
            className="section-header"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <p className="section-eyebrow">Capabilities</p>
            <h2 className="section-title">
              Built for agents who<br />
              <span className="hero-title-accent">refuse to lose deals.</span>
            </h2>
          </motion.div>

          <div className="features-grid">
            {features.map((feat, i) => (
              <motion.div
                className="feature-card"
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                custom={i}
              >
                <div className="feature-icon">{feat.icon}</div>
                <h3 className="feature-title">{feat.title}</h3>
                <p className="feature-desc">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section cta-section">
        <div className="container cta-content">
          <motion.h2
            className="cta-title"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Stop leaving money on the table.
          </motion.h2>
          <motion.p
            className="cta-subtitle"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
          >
            Join the agents who close more deals with less effort.
          </motion.p>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
          >
            <Link to="/login" className="btn btn-primary btn--lg">
              Get Started — It's Free
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <span className="navbar-logo-icon">M</span>
            <span className="navbar-logo-text">The MiddleBot</span>
          </div>
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} The MiddleBot. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  )
}
