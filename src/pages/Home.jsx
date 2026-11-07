import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Logo from '../components/Logo'
import { useCVDispatch, useCVState } from '../store/CVContext'
import { ACTIONS } from '../store/cvReducer'
import './landing.css'

const THEME_KEY = 'opus-theme'

function readTheme() {
  try { return localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light' } catch { return 'light' }
}

const ICONS = [
  <path key="g" d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" />,
  <g key="c"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></g>,
  <g key="s"><circle cx="12" cy="12" r="9" /><path d="M8 12.5l3 3 5-6" /></g>,
  <path key="f" d="M13 2L4 14h7l-1 8 9-12h-7z" />,
]

export default function Home() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useCVDispatch()
  const cv = useCVState()

  const [theme, setTheme] = useState(readTheme)
  const [fullName, setFullName] = useState(
    [cv.personalInfo.firstName, cv.personalInfo.lastName].filter(Boolean).join(' ')
  )
  const [jobTitle, setJobTitle] = useState(cv.personalInfo.title || '')
  const [step, setStep] = useState(0)

  // Arrivée depuis une autre page via /#faq
  useEffect(() => {
    if (window.location.hash) document.querySelector(window.location.hash)?.scrollIntoView()
  }, [])

  const pinRef = useRef(null)
  const innerRef = useRef(null)
  const barsRef = useRef([])

  const steps = t('landing.steps', { returnObjects: true })
  const cards = t('landing.benefits.cards', { returnObjects: true })
  const quotes = t('landing.proof.quotes', { returnObjects: true })
  const faq = t('landing.faq.items', { returnObjects: true })

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    try { localStorage.setItem(THEME_KEY, next) } catch { /* stockage indisponible */ }
  }

  function start(e) {
    e?.preventDefault()
    const name = fullName.trim()
    const [firstName = '', ...rest] = name.split(/\s+/).filter(Boolean)
    dispatch({
      type: ACTIONS.UPDATE_PERSONAL_INFO,
      payload: { firstName, lastName: rest.join(' '), title: jobTitle.trim() },
    })
    dispatch({ type: ACTIONS.SET_STEP, payload: 0 })
    navigate('/editor')
  }

  // Étapes pilotées par le scroll (section épinglée)
  useEffect(() => {
    const pin = pinRef.current
    const inn = innerRef.current
    if (!pin || !inn) return
    let cur = -1
    const topOff = () => parseFloat(getComputedStyle(inn).top) || 0
    const span = () => Math.max(pin.offsetHeight - inn.offsetHeight, 1)
    function tick() {
      const r = pin.getBoundingClientRect()
      const p = Math.min(Math.max((topOff() - r.top) / span(), 0), 0.9999)
      const x = p * 4
      const i = Math.floor(x)
      if (i !== cur) { cur = i; setStep(i) }
      barsRef.current.forEach((b, k) => {
        if (b) b.style.height = (k < i ? 100 : k === i ? (x - i) * 100 : 0) + '%'
      })
    }
    addEventListener('scroll', tick, { passive: true })
    addEventListener('resize', tick)
    tick()
    return () => { removeEventListener('scroll', tick); removeEventListener('resize', tick) }
  }, [])

  function goToStep(k) {
    const pin = pinRef.current, inn = innerRef.current
    if (!pin || !inn) return
    const topOff = parseFloat(getComputedStyle(inn).top) || 0
    const span = pin.offsetHeight - inn.offsetHeight
    const top = pin.getBoundingClientRect().top + window.scrollY - topOff + ((k + 0.05) / 4) * span
    window.scrollTo({ top, behavior: 'smooth' })
  }

  const previewName = fullName.trim() || t('landing.preview.sampleName')
  const previewJob = jobTitle.trim() || t('landing.preview.sampleJob')

  return (
    <div className="lp" data-theme={theme}>
      <header className="lp-head">
        <div className="lp-wrap lp-nav">
          <Link to="/" aria-label="OPUS"><Logo height={26} className="lp-logo" /></Link>
          <div>
            <a href="#faq" className="lp-navlink">{t('landing.nav.contact')}</a>
            <button className="lp-tg" onClick={toggleTheme} aria-label={t('landing.nav.theme')}>
              {theme === 'dark' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
              )}
            </button>
            <Link to="/editor" className="lp-btn s">{t('landing.nav.cta')}</Link>
          </div>
        </div>
      </header>

      <div className="lp-top">
        <div className="lp-bgfx" aria-hidden="true" />

        <section className="lp-wrap lp-hero">
          <div className="lp-lab"><i className="lp-dot" />{t('landing.hero.label')}</div>
          <h1>{t('landing.hero.title')}</h1>
          <p className="lp-sub">{t('landing.hero.subtitle')}</p>
          <form className="lp-start" onSubmit={start}>
            <input
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder={t('landing.hero.namePlaceholder')}
              aria-label={t('landing.hero.namePlaceholder')}
              autoComplete="name"
            />
            <i />
            <input
              value={jobTitle}
              onChange={e => setJobTitle(e.target.value)}
              placeholder={t('landing.hero.jobPlaceholder')}
              aria-label={t('landing.hero.jobPlaceholder')}
            />
            <button className="lp-btn" type="submit">
              {fullName.trim() ? t('landing.hero.ctaContinue') : t('landing.hero.cta')}
            </button>
          </form>
          <p className="lp-mini">{t('landing.hero.mini')}</p>
        </section>
      </div>

      <main>
        <section className="lp-wrap lp-lead">
          <h2>{t('landing.lead.title')} <em>{t('landing.lead.titleEm')}</em></h2>
          <p className="lp-lsub">{t('landing.lead.subtitle')}</p>
        </section>

        <section className="lp-pin" ref={pinRef}>
          <div className="lp-wrap lp-pin-in" ref={innerRef}>
            <div className="lp-panel" aria-hidden="true">
              <div className="lp-win" data-s={step + 1}>
                <div className="lp-bar lp-mono">
                  <i /><i /><i />
                  <span>{t('landing.preview.window')}</span>
                  <b className="lp-sc">{t('landing.preview.score')}</b>
                  <b className="lp-exp">{t('landing.preview.download')}</b>
                </div>
                <div className="lp-body">
                  <aside className="lp-side">
                    {t('landing.preview.sections', { returnObjects: true }).map((s, k) => (
                      <span key={s} className={k === 0 ? 'a' : ''}>{s}</span>
                    ))}
                  </aside>
                  <div className="lp-form">
                    <div className="lp-fld"><s /><s /></div>
                    <div className="lp-fld"><s /><s /></div>
                    <div className="lp-tip">{t('landing.preview.tip')}</div>
                    <div className="lp-fld"><s /><s /></div>
                  </div>
                  <div className="lp-pv">
                    <div className="lp-tpl lp-mono">
                      {t('landing.preview.templates', { returnObjects: true }).map(s => <span key={s}>{s}</span>)}
                    </div>
                    <div className="lp-pp">
                      <b>{previewName}</b>
                      <em>{previewJob}</em>
                      <s /><s style={{ width: '80%' }} /><s className="h" /><s /><s style={{ width: '70%' }} /><s /><s className="h" /><s style={{ width: '60%' }} /><s />
                    </div>
                  </div>
                </div>
                <div className="lp-ph">{t('landing.preview.placeholder')}</div>
              </div>
            </div>

            <div className="lp-steps">
              <div className="lp-tabs">
                {steps.map((s, k) => (
                  <button key={s.title} className={k === step ? 'on' : ''} onClick={() => goToStep(k)}>
                    <span className="lp-pr"><b ref={el => { barsRef.current[k] = el }} /></span>
                    <span>
                      <span className="n">{String(k + 1).padStart(2, '0')}</span>
                      <span className="t">{s.title}</span>
                      <span className="d"><span className="dp">{s.desc}</span></span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="lp-wrap lp-bento">
          <h2>{t('landing.benefits.title')}</h2>
          <p className="lp-bsub">{t('landing.benefits.subtitle')}</p>
          <div className="lp-pk">
            {cards.map((c, k) => (
              <div className="lp-pc" key={c.kicker}>
                <span className="lp-ic">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{ICONS[k]}</svg>
                </span>
                <span className="k">{c.kicker}</span>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="lp-wrap lp-proof">
          <h2>{t('landing.proof.title')}</h2>
          <div className="lp-q3">
            {quotes.map(q => (
              <div className="lp-q" key={q.who}>
                <p>{q.quote}</p>
                <span>{q.who}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="lp-wrap lp-faq" id="faq">
          <div>
            <h2>{t('landing.faq.title')}</h2>
            <p className="l">{t('landing.faq.subtitle')}</p>
            <Link to="/contact" className="lp-btn o">{t('landing.faq.contact')}</Link>
          </div>
          <div>
            {faq.map(f => (
              <details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>
            ))}
          </div>
        </section>

        <section className="lp-wrap">
          <div className="lp-fin">
            <h2>{t('landing.final.title')} <em>{t('landing.final.titleEm')}</em></h2>
            <button className="lp-btn" onClick={start}>{t('landing.final.cta')}</button>
          </div>
        </section>
      </main>

      <footer className="lp-wrap lp-ft">
        <Logo height={22} className="lp-logo" />
        <span>{t('landing.footer.rights')}</span>
        <span>
          <Link to="/contact">{t('landing.footer.contact')}</Link>
          <Link to="/terms">{t('landing.footer.terms')}</Link>
          <Link to="/privacy">{t('landing.footer.privacy')}</Link>
        </span>
      </footer>
    </div>
  )
}
