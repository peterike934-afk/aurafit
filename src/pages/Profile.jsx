import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import "./Profile.css"

// ── Icons ─────────────────────────────────────────────────
const IconDashboard = () => (
  <svg className="dash-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
)
const IconUpload = () => (
  <svg className="dash-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
)
const IconHistory = () => (
  <svg className="dash-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
    <path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>
  </svg>
)
const IconProfile = () => (
  <svg className="dash-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)
const IconSignOut = () => (
  <svg className="dash-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
)

// ── Sidebar ───────────────────────────────────────────────
function Sidebar({ onNavigate, onSignOut }) {
  const items = [
    { label: "Dashboard", page: "dashboard", Icon: IconDashboard },
    { label: "New Outfit", page: "upload",   Icon: IconUpload    },
    { label: "My Outfits", page: "history",  Icon: IconHistory   },
    { label: "Profile",    page: "profile",  Icon: IconProfile   },
  ]
  return (
    <aside className="dash-sidebar">
      <span className="dash-logo">AURAFIT</span>
      <nav className="dash-nav">
        {items.map(({ label, page, Icon }) => (
          <button key={page}
            className={`dash-nav-item${page === "profile" ? " dash-nav-item--active" : ""}`}
            onClick={() => onNavigate(page)}>
            <Icon />{label}
          </button>
        ))}
      </nav>
      <div className="dash-sidebar-footer">
        <button className="dash-signout" onClick={onSignOut}>
          <IconSignOut />Sign Out
        </button>
      </div>
    </aside>
  )
}

// ── Profile page ──────────────────────────────────────────
export default function Profile({ onNavigate, user }) {
  const [name, setName]       = useState(user?.user_metadata?.full_name || "")
  const [email]               = useState(user?.email || "")
  const [loading, setLoading] = useState(false)
  const [saved, setSaved]     = useState(false)
  const [error, setError]     = useState("")
  const [stats, setStats]     = useState({ total: 0, avgScore: 0 })

  useEffect(() => {
    async function fetchStats() {
      if (!user) return
      const { data } = await supabase
        .from("outfits")
        .select("style_score")
        .eq("user_id", user.id)
      if (data?.length > 0) {
        const scores = data.filter(o => o.style_score).map(o => o.style_score)
        const avg = scores.length > 0
          ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
        setStats({ total: data.length, avgScore: avg })
      }
    }
    fetchStats()
  }, [user])

  async function handleSave() {
    setError(""); setLoading(true)
    const { error } = await supabase.auth.updateUser({ data: { full_name: name } })
    if (error) { setError(error.message); setLoading(false); return }
    setSaved(true); setLoading(false)
    setTimeout(() => setSaved(false), 3000)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    onNavigate("landing")
  }

  const initial = name ? name.charAt(0).toUpperCase() : "?"

  return (
    <div className="dashboard">
      <Sidebar onNavigate={onNavigate} onSignOut={handleSignOut} />

      <main className="dash-main">
        <div className="dash-header">
          <div>
            <p className="dash-eyebrow">Account</p>
            <h2 className="dash-heading">Your Profile</h2>
          </div>
        </div>

        <div className="profile-grid">
          {/* ── Left ── */}
          <div className="profile-left">
            <div className="profile-avatar">
              <span>{initial}</span>
            </div>
            <div className="profile-stats">
              <div className="dash-stat-card">
                <span className="dash-stat-number">{stats.total}</span>
                <span className="dash-stat-label">Outfits Analyzed</span>
              </div>
              <div className="dash-stat-card">
                <span className="dash-stat-number">
                  {stats.avgScore > 0 ? `${stats.avgScore}/10` : "—"}
                </span>
                <span className="dash-stat-label">Avg Style Score</span>
              </div>
            </div>
          </div>

          {/* ── Right ── */}
          <div className="profile-right">
            <div className="profile-section">
              <p className="profile-section-label">Account Details</p>
              <div className="auth-fields">
                <div className="field">
                  <label className="field-label">Full Name</label>
                  <input className="field-input" type="text"
                    value={name}
                    onChange={e => { setName(e.target.value); setSaved(false) }}
                    placeholder="Your name" />
                </div>
                <div className="field">
                  <label className="field-label">Email Address</label>
                  <input className="field-input" type="email"
                    value={email} disabled />
                </div>
              </div>

              {error && <p className="auth-error">{error}</p>}

              <div className="profile-save-row">
                <button className="btn-primary" onClick={handleSave} disabled={loading}>
                  {loading ? "Saving…" : "Save Changes"}
                </button>
                {saved && <span className="profile-saved-msg">✓ Saved</span>}
              </div>
            </div>

            <div className="profile-section">
              <p className="profile-section-label">Session</p>
              <div className="danger-zone">
                <div className="danger-zone__text">
                  <h4>Sign out of AuraFit</h4>
                  <p>You'll need to sign back in to access your outfits.</p>
                </div>
                <button className="profile-signout-btn" onClick={handleSignOut}>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
