import "./Dashboard.css"

// ── Nav Icons ─────────────────────────────────────────────
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
const IconEmpty = () => (
  <svg width="40" height="40" className="dash-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"/>
  </svg>
)

// ── Sidebar ───────────────────────────────────────────────
function Sidebar({ active, onNavigate }) {
  const items = [
    { label: "Dashboard", page: "dashboard", Icon: IconDashboard },
    { label: "New Outfit", page: "upload",    Icon: IconUpload    },
    { label: "My Outfits", page: "history",   Icon: IconHistory   },
    { label: "Profile",    page: "profile",   Icon: IconProfile   },
  ]
  return (
    <aside className="dash-sidebar">
      <span className="dash-logo">AURAFIT</span>
      <nav className="dash-nav">
        {items.map(({ label, page, Icon }) => (
          <button
            key={page}
            className={`dash-nav-item${active === page ? " dash-nav-item--active" : ""}`}
            onClick={() => onNavigate(page)}
          >
            <Icon />
            {label}
          </button>
        ))}
      </nav>
      <div className="dash-sidebar-footer">
        <button className="dash-signout" onClick={() => onNavigate("landing")}>
          <IconSignOut />
          Sign Out
        </button>
      </div>
    </aside>
  )
}

// ── Dashboard ─────────────────────────────────────────────
export default function Dashboard({ onNavigate, user }) {
  const firstName = user?.user_metadata?.full_name?.split(" ")[0] ?? "there"

  return (
    <div className="dashboard">
      <Sidebar active="dashboard" onNavigate={onNavigate} />

      <main className="dash-main">
        <div className="dash-header">
          <div>
            <p className="dash-eyebrow">Welcome back{user ? `, ${firstName}` : ""}</p>
            <h2 className="dash-heading">Style Dashboard</h2>
          </div>
          <button className="btn-primary" onClick={() => onNavigate("upload")}>
            + New Outfit
          </button>
        </div>

        <div className="dash-stats">
          <div className="dash-stat-card">
            <span className="dash-stat-number">0</span>
            <span className="dash-stat-label">Outfits Analyzed</span>
          </div>
          <div className="dash-stat-card">
            <span className="dash-stat-number">—</span>
            <span className="dash-stat-label">Avg Style Score</span>
          </div>
          <div className="dash-stat-card">
            <span className="dash-stat-number">0</span>
            <span className="dash-stat-label">Saved Outfits</span>
          </div>
        </div>

        <p className="dash-section-label">Recent Outfits</p>

        <div className="dash-empty">
          <IconEmpty />
          <h3>No outfits yet</h3>
          <p>Upload your first outfit to get AI-powered style feedback and scoring.</p>
          <button className="btn-primary" style={{ marginTop: "8px" }} onClick={() => onNavigate("upload")}>
            Upload Outfit
          </button>
        </div>
      </main>
    </div>
  )
}
