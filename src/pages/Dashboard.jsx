import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { supabase } from "../lib/supabase"
import "./Dashboard.css"

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

export default function Dashboard({ onNavigate, user }) {
  const [outfits, setOutfits] = useState([])
  const [stats, setStats]     = useState({ total: 0, avgScore: 0, topStyle: "—" })
  const [loading, setLoading] = useState(true)

  const name = user?.user_metadata?.full_name?.split(" ")[0] || "there"

  useEffect(() => {
    async function fetchData() {
      if (!user) { setLoading(false); return }
      const { data } = await supabase
        .from("outfits")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(4)

      if (data) {
        setOutfits(data)
        const scores = data.filter(o => o.style_score).map(o => o.style_score)
        const avg = scores.length
          ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
          : 0
        setStats({ total: data.length, avgScore: avg, topStyle: data[0]?.occasion || "—" })
      }
      setLoading(false)
    }
    fetchData()
  }, [user])

  return (
    <div className="dashboard">
      <aside className="dash-sidebar">
        <span className="dash-logo">AURAFIT</span>
        <nav className="dash-nav">
          <button className="dash-nav-item dash-nav-item--active">
            <IconDashboard />Dashboard
          </button>
          <button className="dash-nav-item" onClick={() => onNavigate("upload")}>
            <IconUpload />New Outfit
          </button>
          <button className="dash-nav-item" onClick={() => onNavigate("history")}>
            <IconHistory />My Outfits
          </button>
          <button className="dash-nav-item" onClick={() => onNavigate("profile")}>
            <IconProfile />Profile
          </button>
        </nav>
        <div className="dash-sidebar-footer">
          <button className="dash-signout" onClick={() => onNavigate("landing")}>
            <IconSignOut />Sign Out
          </button>
        </div>
      </aside>

      <main className="dash-main">
        <div className="dash-header">
          <div>
            <p className="dash-eyebrow">Welcome back, {name}</p>
            <h2 className="dash-heading">Your Style Dashboard</h2>
          </div>
          <button className="btn-primary" onClick={() => onNavigate("upload")}>
            + New Outfit
          </button>
        </div>

        {/* STATS */}
        <div className="dash-stats">
          {[
            { number: stats.total, label: "Outfits Analyzed" },
            { number: stats.avgScore || "—", label: "Avg Style Score" },
            { number: stats.total > 0 ? `${Math.round((stats.avgScore / 10) * 100)}%` : "—", label: "Style Rating" },
          ].map((stat, i) => (
            <motion.div key={i} className="dash-stat-card"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}>
              <span className="dash-stat-number">{stat.number}</span>
              <span className="dash-stat-label">{stat.label}</span>
            </motion.div>
          ))}
        </div>

        {/* RECENT OUTFITS */}
        {loading ? (
          <div className="dash-skeleton-grid">
            {[1,2,3,4].map(i => (
              <div key={i} className="dash-skeleton" />
            ))}
          </div>
        ) : outfits.length === 0 ? (
          <div className="dash-empty">
            <p className="dash-empty-icon">◈</p>
            <h3>No outfits yet</h3>
            <p>Upload your first outfit to get AI-powered style feedback.</p>
            <button className="btn-primary" onClick={() => onNavigate("upload")}>
              Upload Outfit
            </button>
          </div>
        ) : (
          <>
            <div className="dash-recent-header">
              <p className="dash-section-label">Recent Outfits</p>
              <button className="btn-text" onClick={() => onNavigate("history")}>
                View All →
              </button>
            </div>
            <div className="dash-recent-grid">
              {outfits.map((outfit, i) => (
                <motion.div key={outfit.id} className="dash-recent-card"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.08 }}>
                  <div className="dash-recent-img-wrap">
                    <img src={outfit.image_url} alt="Outfit" className="dash-recent-img" />
                    {outfit.style_score && (
                      <span className="dash-recent-score">{outfit.style_score}/10</span>
                    )}
                  </div>
                  <div className="dash-recent-info">
                    <p className="dash-recent-occasion">{outfit.occasion || "Any occasion"}</p>
                    <p className="dash-recent-date">
                      {new Date(outfit.created_at).toLocaleDateString("en-US", {
                        month: "short", day: "numeric"
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}