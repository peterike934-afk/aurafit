import "./Feedback.css"
import { motion } from "framer-motion"

export default function FeedbackCard({ feedback, onSave, onReset, isSaved }) {
  const scores = [
    { label: "Color Harmony", value: feedback.scores.colorHarmony },
    { label: "Fit Balance", value: feedback.scores.fitBalance },
    { label: "Occasion Match", value: feedback.scores.occasionMatch },
    { label: "Overall Style", value: feedback.scores.overallStyle },
  ]

  const avgScore = (
    Object.values(feedback.scores).reduce((a, b) => a + b, 0) /
    Object.values(feedback.scores).length
  ).toFixed(1)

  return (
    <div className="feedback-card">
      {/* HEADER */}
      <div className="fc-header">
        <div className="fc-score-circle">
          <span className="fc-score-number">{avgScore}</span>
          <span className="fc-score-label">Style Score</span>
        </div>
        <div className="fc-header-info">
          <p className="fc-style-identity">{feedback.styleIdentity}</p>
          <p className="fc-vibe">{feedback.vibe}</p>
          <p className="fc-occasion-tag">{feedback.occasion}</p>
        </div>
      </div>

      {/* SCORES */}
      <div className="fc-scores">
        {scores.map(score => (
          <div key={score.label} className="fc-score-row">
            <span className="fc-score-name">{score.label}</span>
           <div className="fc-score-bar-wrap">
  <motion.div
    className="fc-score-bar"
    initial={{ width: 0 }}
    animate={{ width: `${(score.value / 10) * 100}%` }}
    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
  />
</div>
            <span className="fc-score-val">{score.value}</span>
          </div>
        ))}
      </div>

      {/* SUMMARY */}
      <div className="fc-summary">
        <p className="fc-section-label">Stylist's Note</p>
        <p className="fc-summary-text">{feedback.summary}</p>
      </div>

      {/* SUGGESTIONS */}
      <div className="fc-suggestions">
        <p className="fc-section-label">AI Suggestions</p>
        <ul className="fc-suggestion-list">
          {feedback.suggestions.map((s, i) => (
            <li key={i} className="fc-suggestion-item">
              <span className="fc-suggestion-dot">◈</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ACTIONS */}
      <div className="fc-actions">
        <button className="btn-primary" onClick={onSave} disabled={isSaved}>
          {isSaved ? "✓ Saved" : "Save Outfit"}
        </button>
        <button className="btn-ghost" onClick={onReset}>
          Analyze Another
        </button>
      </div>
    </div>
  )
}