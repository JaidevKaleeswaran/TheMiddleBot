import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import './Navbar.css'

export default function Navbar() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="navbar-inner container">
        <Link to="/" className="navbar-brand">
          <span className="navbar-logo-icon">M</span>
          <span className="navbar-logo-text">The MiddleBot</span>
        </Link>

        <div className={`navbar-links ${mobileOpen ? 'navbar-links--open' : ''}`}>
          <Link
            to="/"
            className={`navbar-link ${isActive('/') ? 'navbar-link--active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/login"
            className={`navbar-link ${isActive('/login') ? 'navbar-link--active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            Log In
          </Link>
          <Link
            to="/login"
            className="navbar-cta"
            onClick={() => setMobileOpen(false)}
          >
            Get Started
          </Link>
        </div>

        <button
          className="navbar-mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </motion.nav>
  )
}
