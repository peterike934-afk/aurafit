import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import { supabase } from "./lib/supabase"
import PageTransition from "./components/PageTransition"
import MobileNav from "./components/MobileNav"
import Landing from "./pages/Landing"
import Auth from "./pages/Auth"
import Dashboard from "./pages/Dashboard"
import Upload from "./pages/Upload"
import History from "./pages/History"
import Profile from "./pages/Profile"

export default function App() {
  const [page, setPage] = useState("landing")
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) setPage("dashboard")
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) setPage("landing")
    })

    return () => subscription.unsubscribe()
  }, [])

  function onNavigate(p) {
    setPage(p)
  }

  const showMobileNav = ["dashboard", "upload", "history", "profile"].includes(page)

  function renderPage() {
    switch (page) {
      case "landing":   return <Landing onNavigate={onNavigate} />
      case "login":     return <Auth onNavigate={onNavigate} mode="login" />
      case "register":  return <Auth onNavigate={onNavigate} mode="register" />
      case "dashboard": return <Dashboard onNavigate={onNavigate} user={user} />
      case "upload":    return <Upload onNavigate={onNavigate} user={user} />
      case "history":   return <History onNavigate={onNavigate} user={user} />
      case "profile":   return <Profile onNavigate={onNavigate} user={user} />
      default:          return <Landing onNavigate={onNavigate} />
    }
  }

  return (
    <>
      <AnimatePresence mode="wait">
        <PageTransition key={page}>
          {renderPage()}
        </PageTransition>
      </AnimatePresence>
      {showMobileNav && (
        <MobileNav currentPage={page} onNavigate={onNavigate} />
      )}
    </>
  )
}