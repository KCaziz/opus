export default function About() {
  return (
    <section className="section-gap">
      <div className="container" style={{ maxWidth: 640 }}>
        <p className="label-tag mb-2">À propos</p>
        <h1 style={{ fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-0.03em' }}>
          About us
        </h1>
        <p className="mt-4" style={{ color: 'var(--color-text-muted)', lineHeight: 1.8 }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      </div>
    </section>
  )
}
