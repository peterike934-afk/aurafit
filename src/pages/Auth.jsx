import { useState } from "react"
import { supabase } from "../lib/supabase"
import "./Auth.css"

export default function Auth({ onNavigate, mode }) {
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [name, setName]         = useState("")
  const [error, setError]       = useState("")
  const [loading, setLoading]   = useState(false)

  const isLogin = mode === "login"

async function handleSubmit() {
  setError(""); setLoading(true)

  if (isLogin) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    onNavigate("dashboard")
  } else {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: undefined,
      }
    })
    if (error) { setError(error.message); setLoading(false); return }
    if (data.user) onNavigate("dashboard")
  }
  setLoading(false)
}
  return (
    <div className="auth">
      <nav className="auth-nav">
        <button className="landing-logo" onClick={() => onNavigate("landing")}>AURAFIT</button>
      </nav>

      <div className="auth-body">
        <div className="auth-card">
          <p className="auth-eyebrow">{isLogin ? "Welcome back" : "Create account"}</p>
          <h2 className="auth-heading">{isLogin ? "Sign in to AuraFit" : "Start your style journey"}</h2>

          <div className="auth-fields">
            {!isLogin && (
              <div className="field">
                <label className="field-label">Full Name</label>
                <input className="field-input" type="text" placeholder="Your name"
                  value={name} onChange={e => setName(e.target.value)} />
              </div>
            )}
            <div className="field">
              <label className="field-label">Email</label>
              <input className="field-input" type="email" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="field">
              <label className="field-label">Password</label>
              <input className="field-input" type="password" placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)} />
            </div>
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button className="auth-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
          </button>

          <p className="auth-switch">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button className="auth-switch-link"
              onClick={() => onNavigate(isLogin ? "register" : "login")}>
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}