import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, ArrowRight, Eye, EyeOff, User as UserIcon, Building, AlertCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { auth, db, googleProvider } from '../firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import './Login.css'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
}

export default function Login() {
  const navigate = useNavigate()
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState('agent')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const redirectByRole = (userRole) => {
    if (userRole === 'client') {
      window.location.href = 'http://localhost:5175/'
    } else {
      window.location.href = 'http://localhost:5174/dashboard'
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    // Bypassing authentication entirely as requested
    console.log(`Bypassing auth, redirecting to ${role} app`);
    redirectByRole(role)
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    
    // Bypassing authentication entirely as requested
    console.log(`Bypassing auth, redirecting to ${role} app`);
    redirectByRole(role)
  }

  return (
    <main className="login-page">
      <div className="login-glow" aria-hidden="true" />

      <div className="login-container">
        {/* ── Left panel — branding ── */}
        <motion.div
          className="login-brand-panel"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <Link to="/" className="login-brand-logo">
            <span className="navbar-logo-icon">M</span>
            <span className="navbar-logo-text">The MiddleBot</span>
          </Link>

          <h2 className="login-brand-headline">
            Your leads deserve<br />
            <span className="hero-title-accent">a faster reply.</span>
          </h2>

          <p className="login-brand-sub">
            Join thousands of agents who close more deals with intelligent,
            automated follow-up.
          </p>
        </motion.div>

        {/* ── Right panel — form ── */}
        <motion.div
          className="login-form-panel"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          <div className="login-form-header">
            <h1 className="login-form-title">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="login-form-subtitle">
              {isSignUp
                ? 'Start capturing leads in minutes'
                : 'Log in to The MiddleBot dashboard'}
            </p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="form-error-banner"
              >
                <AlertCircle size={16} />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="role-toggle">
            <button
              type="button"
              className={`role-toggle-btn ${role === 'agent' ? 'active' : ''}`}
              onClick={() => setRole('agent')}
            >
              <Building size={16} /> Agent
            </button>
            <button
              type="button"
              className={`role-toggle-btn ${role === 'client' ? 'active' : ''}`}
              onClick={() => setRole('client')}
            >
              <UserIcon size={16} /> Client
            </button>
          </div>

          <form className="login-form" onSubmit={handleSubmit} id="login-form">
            {isSignUp && (
              <div className="form-group">
                <label htmlFor="name" className="form-label">Full Name</label>
                <div className="form-input-wrap">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-input"
                    placeholder="Jane Smith"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <div className="form-input-wrap">
                <Mail size={16} className="form-input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input form-input--icon"
                  placeholder="you@brokerage.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="form-label-row">
                <label htmlFor="password" className="form-label">Password</label>
                {!isSignUp && (
                  <button type="button" className="form-forgot">
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="form-input-wrap">
                <Lock size={16} className="form-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  className="form-input form-input--icon"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                />
                <button
                  type="button"
                  className="form-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary login-submit" id="login-submit" disabled={loading || googleLoading}>
              {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Log In')}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <div className="login-divider">
            <span>or</span>
          </div>

          <button className="btn btn-oauth" id="google-login" onClick={handleGoogleLogin} disabled={loading || googleLoading}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84Z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" fill="#EA4335" />
            </svg>
            {googleLoading ? 'Processing...' : 'Continue with Google'}
          </button>

          <p className="login-toggle-text">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button
              type="button"
              className="login-toggle-btn"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? 'Log In' : 'Sign Up'}
            </button>
          </p>
        </motion.div>
      </div>
    </main>
  )
}
