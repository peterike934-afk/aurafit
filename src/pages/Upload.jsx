import { useState, useRef } from "react"
import { analyzeOutfit } from "../lib/gemini"
import { supabase } from "../lib/supabase"
import "./Upload.css"

const OCCASIONS  = ["any","casual","work","formal","date night","gym","beach","party"]
const BODY_TYPES = ["any","slim","athletic","average","curvy","plus size"]

// ── Icons ─────────────────────────────────────────────────
const IconUploadCloud = () => (
  <svg width="48" height="48" className="upload-icon" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16"/>
    <line x1="12" y1="12" x2="12" y2="21"/>
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
  </svg>
)

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
            className={`dash-nav-item${page === "upload" ? " dash-nav-item--active" : ""}`}
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

// ── Upload page ───────────────────────────────────────────
export default function Upload({ onNavigate, user }) {
  const [images, setImages]           = useState([])
  const [isDrag, setIsDrag]           = useState(false)
  const [occasion, setOccasion]       = useState("any")
  const [bodyType, setBodyType]       = useState("any")
  const [styleIntent, setStyleIntent] = useState("")
  const [loading, setLoading]         = useState(false)
  const [feedback, setFeedback]       = useState(null)
  const [error, setError]             = useState("")
  const [isSaved, setIsSaved]         = useState(false)
  const fileRef                       = useRef(null)

  function handleFiles(files) {
    const valid = Array.from(files).filter(f => f.type.startsWith("image/"))
    if (!valid.length) { setError("Please upload image files only."); return }
    const remaining = 4 - images.length
    if (remaining <= 0) { setError("Maximum 4 images allowed."); return }
    const toAdd = valid.slice(0, remaining).map(file => ({
      file, preview: URL.createObjectURL(file), type: file.type,
    }))
    setImages(prev => [...prev, ...toAdd])
    setFeedback(null); setError(""); setIsSaved(false)
  }

  function handleDrop(e) {
    e.preventDefault(); setIsDrag(false)
    handleFiles(e.dataTransfer.files)
  }

  function removeImage(index) {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  async function handleAnalyze() {
    if (!images.length) { setError("Please upload at least one outfit image."); return }
    setError(""); setLoading(true)
    try {
      const processed = await Promise.all(images.map(img =>
        new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.readAsDataURL(img.file)
          reader.onload  = () => resolve({ base64: reader.result.split(",")[1], type: img.type })
          reader.onerror = reject
        })
      ))
      const result = await analyzeOutfit(processed, occasion, bodyType, styleIntent)
      setFeedback(result)
    } catch {
      setError("Analysis failed. Please try again.")
    }
    setLoading(false)
  }

  async function handleSave() {
    if (!feedback || isSaved) return
    try {
      const firstImage = images[0]
      const ext = firstImage.file.name.split(".").pop()
      const fileName = `${Date.now()}-outfit.${ext}`

      const { error: uploadError } = await supabase.storage
        .from("outfits").upload(fileName, firstImage.file)
      if (uploadError) { setError("Failed to save image."); return }

      const { data: { publicUrl } } = supabase.storage
        .from("outfits").getPublicUrl(fileName)

      const scoreMatch = feedback.match(/(\d+)\/10/)
      const score = scoreMatch ? parseInt(scoreMatch[1]) : null

      const { error: dbError } = await supabase.from("outfits").insert({
        user_id: user?.id, image_url: publicUrl,
        occasion, body_type: bodyType, ai_feedback: feedback, style_score: score,
      })
      if (dbError) { setError("Failed to save outfit."); return }
      setIsSaved(true)
    } catch {
      setError("Something went wrong saving your outfit.")
    }
  }

  function handleReset() {
    setImages([]); setFeedback(null)
    setError(""); setStyleIntent(""); setIsSaved(false)
  }

  const zoneClass = [
    "upload-zone",
    images.length > 0 ? "upload-zone--filled" : "",
    isDrag ? "upload-zone--drag" : "",
  ].filter(Boolean).join(" ")

  return (
    <div className="dashboard">
      <Sidebar onNavigate={onNavigate} />

      <main className="dash-main">
        <div className="dash-header">
          <div>
            <p className="dash-eyebrow">AI Analysis</p>
            <h2 className="dash-heading">Analyze Outfit</h2>
          </div>
        </div>

        <div className="upload-grid">
          {/* ── Left: image zone ── */}
          <div className="upload-left">
            <div className={zoneClass}
              onDrop={handleDrop}
              onDragOver={e => { e.preventDefault(); setIsDrag(true) }}
              onDragLeave={() => setIsDrag(false)}
              onClick={() => images.length < 4 && fileRef.current.click()}
            >
              {images.length > 0 ? (
                <div className="upload-previews">
                  {images.map((img, i) => (
                    <div key={i} className="upload-thumb">
                      <img src={img.preview} alt={`Outfit ${i + 1}`} />
                      <button className="thumb-remove"
                        onClick={e => { e.stopPropagation(); removeImage(i) }}>✕</button>
                    </div>
                  ))}
                  {images.length < 4 && (
                    <div className="upload-thumb upload-thumb--add"
                      onClick={e => { e.stopPropagation(); fileRef.current.click() }}>
                      <span>+ Add</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="upload-placeholder">
                  <IconUploadCloud />
                  <p className="upload-text">Drop your outfit here</p>
                  <p className="upload-sub">or click to browse</p>
                  <p className="upload-hint">Up to 4 images · JPG, PNG, WEBP</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple
              style={{ display: "none" }}
              onChange={e => handleFiles(e.target.files)} />
          </div>

          {/* ── Right: controls + feedback ── */}
          <div className="upload-right">
            <div className="upload-filters">
              <div className="field">
                <label className="field-label">Occasion</label>
                <select className="field-select" value={occasion}
                  onChange={e => setOccasion(e.target.value)}>
                  {OCCASIONS.map(o => (
                    <option key={o} value={o}>
                      {o === "any" ? "Any Occasion" : o.charAt(0).toUpperCase() + o.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label className="field-label">Body Type</label>
                <select className="field-select" value={bodyType}
                  onChange={e => setBodyType(e.target.value)}>
                  {BODY_TYPES.map(b => (
                    <option key={b} value={b}>
                      {b === "any" ? "Any Body Type" : b.charAt(0).toUpperCase() + b.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label className="field-label">
                  Style Intent <span className="field-optional">(optional)</span>
                </label>
                <textarea className="field-textarea"
                  placeholder="e.g. Smart casual for a dinner date. I want a relaxed but put-together vibe."
                  value={styleIntent}
                  onChange={e => setStyleIntent(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            {error && <p className="upload-error">{error}</p>}

            {loading ? (
              <div className="upload-analyzing">
                <div className="spin-gold" />
                <p className="upload-analyzing-label">Analyzing your outfit…</p>
                <p className="upload-analyzing-sub">Reading colour, fit, and occasion match</p>
              </div>
            ) : !feedback ? (
              <button className="btn-primary upload-btn"
                onClick={handleAnalyze} disabled={images.length === 0}>
                Analyze Outfit
              </button>
            ) : (
              <div className="feedback-box">
                <div className="feedback-header">
                  <p className="feedback-label">AI Feedback</p>
                </div>
                <div className="feedback-content">
                  {feedback.split("\n").map((line, i) => (
                    <p key={i}
                      className={line.startsWith("#") || line.startsWith("**")
                        ? "feedback-title" : "feedback-line"}>
                      {line.replace(/^#+\s*/, "").replace(/\*\*/g, "")}
                    </p>
                  ))}
                </div>
                <div className="feedback-actions">
                  <button className="btn-primary upload-btn"
                    onClick={handleSave} disabled={isSaved}>
                    {isSaved ? "✓ Saved to Wardrobe" : "Save Outfit"}
                  </button>
                  <button className="btn-ghost upload-btn" onClick={handleReset}>
                    Analyze Another
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
