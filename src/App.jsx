import React from 'react';
import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { RTL_LANGUAGES } from './i18n/index'

import Navbar  from './components/Navbar'
import Footer  from './components/Footer'
import Home    from './pages/Home'
import About   from './pages/About'
import Builder from './pages/Builder'
import Onboarding from './pages/Onboarding'
import Improve   from './pages/Improve'
import Editor  from './pages/Editor'

// Editor has its own full-page layout (no Navbar/Footer chrome)
const EDITOR_PATHS = ['/editor']

export default function App() {
  const { i18n } = useTranslation()

  // Sync RTL direction on language change
  useEffect(() => {
    const lang = i18n.language?.slice(0, 2) || 'fr'
    document.documentElement.dir  = RTL_LANGUAGES.includes(lang) ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
  }, [i18n.language])

  return (
    <Routes>
      {/* ── Full-page editor (no Navbar/Footer) ── */}
      <Route path="/editor" element={<Editor />} />

      {/* ── Standard layout ── */}
      <Route path="*" element={
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/"                    element={<Home />}       />
              <Route path="/about"               element={<About />}      />
              <Route path="/builder"             element={<Builder />}    />
              <Route path="/onboarding/:templateId" element={<Onboarding />} />
              <Route path="/improve"              element={<Improve />}    />
            </Routes>
          </main>
          <Footer />
        </div>
      } />
    </Routes>
  )
}
