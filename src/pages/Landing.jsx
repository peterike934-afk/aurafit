import "./Landing.css"

// ── SVG Icons ─────────────────────────────────────────────
const IconAnalysis = () => (
  <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 5v2M12 17v2M5 12H3M21 12h-2"/>
  </svg>
)

const IconScore = () => (
  <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2Z"/>
  </svg>
)

const IconHistory = () => (
  <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
)

const IconOccasion = () => (
  <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"/>
  </svg>
)

export default function Landing({ onNavigate }) {
  return (
    <div className="landing">

      {/* NAV */}
      <nav className="landing-nav">
        <span className="landing-logo">AURAFIT</span>
        <div className="landing-nav-links">
          <button className="nav-link" onClick={() => onNavigate("login")}>Sign In</button>
          <button className="nav-cta" onClick={() => onNavigate("register")}>Get Started</button>
        </div>
      </nav>

      {/* HERO */}
      <div className="landing-hero">
        <p className="landing-eyebrow">AI-Powered Fashion Intelligence</p>
        <h1 className="landing-heading">
          Your personal
          <em>style advisor.</em>
        </h1>
        <p className="landing-sub">
          Upload your outfit. Get instant AI feedback on fit, colour coordination,
          and occasion suitability. Elevate your style with every wear.
        </p>
        <div className="landing-cta">
          <button className="btn-primary" onClick={() => onNavigate("register")}>
            Start For Free
          </button>
          <button className="btn-ghost" onClick={() => onNavigate("login")}>
            Sign In
          </button>
        </div>

        <div className="landing-stats">
          <div className="stat">
            <span className="stat-number">AI</span>
            <span className="stat-label">Style Analysis</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-number">10</span>
            <span className="stat-label">Style Score</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-number">∞</span>
            <span className="stat-label">Outfit History</span>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div className="landing-features">
        <div className="feature-card">
          <IconAnalysis />
          <h3>Outfit Analysis</h3>
          <p>Upload any outfit and get detailed AI feedback on fit, colour harmony, and personal style.</p>
        </div>
        <div className="feature-card">
          <IconScore />
          <h3>Style Score</h3>
          <p>Receive a granular score with specific, actionable suggestions to elevate your look.</p>
        </div>
        <div className="feature-card">
          <IconHistory />
          <h3>Outfit History</h3>
          <p>Save and track your outfits over time. Build your personal style archive and see progress.</p>
        </div>
        <div className="feature-card">
          <IconOccasion />
          <h3>Occasion Fit</h3>
          <p>Tell us where you're going and receive advice precisely tailored to the moment.</p>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="landing-footer">
        <span className="landing-logo">AURAFIT</span>
        <p className="footer-copy">© 2026 AuraFit. All rights reserved.</p>
      </footer>

    </div>
  )
}
