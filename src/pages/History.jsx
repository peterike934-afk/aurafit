import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import "./History.css"

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
const IconEmpty = () => (
  <svg width="40" height="40" className="dash-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <path d="M3 9h18M9 21V9"/>
  </svg>
)

// ── Sidebar ───────────────────────────────────────────────
function Sidebar({ onNavigate }) {
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
            className={`dash-nav-item${page === "history" ? " dash-nav-item--active" : ""}`}
            onClick={() => onNavigate(page)}>
            <Icon />{label}
          </button>
        ))}
      </nav>
      <div className="dash-sidebar-footer">
        <button className="dash-signout" onClick={() => onNavigate("landing")}>
          <IconSignOut />Sign Out
        </button>
      </div>
    </aside>
  )
}

// ── Skeleton loader ───────────────────────────────────────
function SkeletonGrid() {
  return (
    <div className="history-loading">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="history-skeleton" style={{ animationDelay: `${i * 0.05}s` }}>
          <div className="history-skeleton__img" />
          <div className="history-skeleton__info">
            <div className="history-skeleton__line" />
            <div className="history-skeleton__line history-skeleton__line--short" />
          </div>
        </div>
      ))}
    </div>
  )
}

// ── History page ──────────────────────────────────────────
export default function History({ onNavigate, user }) {
  const [outfits, setOutfits] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOutfits() {
      if (!user) { setLoading(false); return }
      const { data, error } = await supabase
        .from("outfits")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
      if (!error) setOutfits(data || [])
      setLoading(false)
    }
    fetchOutfits()
  }, [user])

  return (
    <div className="dashboard">
      <Sidebar onNavigate={onNavigate} />

      <main className="dash-main">
        <div className="dash-header">
          <div>
            <p className="dash-eyebrow">Archive · {loading ? "…" : outfits.length} outfit{outfits.length !== 1 ? "s" : ""}</p>
            <h2 className="dash-heading">My Outfits</h2>
          </div>
          <button className="btn-primary" onClick={() => onNavigate("upload")}>
            + New Outfit
          </button>
        </div>

        {loading ? (
          <SkeletonGrid />
        ) : outfits.length === 0 ? (
          <div className="dash-empty">
            <IconEmpty />
            <h3>No outfits saved yet</h3>
            <p>Analyze and save your first outfit to start building your style archive.</p>
            <button className="btn-primary" style={{ marginTop: "8px" }}
              onClick={() => onNavigate("upload")}>
              Upload Outfit
            </button>
          </div>
        ) : (
          <div className="history-grid">
            {outfits.map((outfit, i) => (
              <div key={outfit.id} className="history-card"
                style={{ animationDelay: `${i * 0.04}s` }}>
                <div className="history-img-wrap">
                  <img src={outfit.image_url} alt="Outfit" className="history-img" />
                  {outfit.style_score && (
                    <span className="history-score">{outfit.style_score}/10</span>
                  )}
                  <div className="history-img-overlay">
                    <span>View</span>
                  </div>
                </div>
                <div className="history-info">
                  <p className="history-occasion">{outfit.occasion || "Any occasion"}</p>
                  <p className="history-date">
                    {new Date(outfit.created_at).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric"
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
