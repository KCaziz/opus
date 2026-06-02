export default function HexDecoration({ size = 28, gap = 6, rows = 6, cols = 5, className = '' }) {
  const w = size
  const h = size * 1.15
  const totalW = cols * (w + gap) - gap
  const totalH = rows * (h * 0.75 + gap)

  const hexes = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * (w + gap) + (r % 2 === 1 ? (w + gap) / 2 : 0)
      const y = r * (h * 0.75 + gap)
      if (x + w > totalW + (w + gap) / 2) continue
      hexes.push({ x, y })
    }
  }

  const points = (x, y) => {
    const cx = x + w / 2
    const cy = y + h / 2
    const pts = []
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 180) * (60 * i - 30)
      pts.push(`${cx + (w / 2) * Math.cos(angle)},${cy + (h / 2) * Math.sin(angle)}`)
    }
    return pts.join(' ')
  }

  return (
    <svg
      className={className}
      width={totalW + w / 2}
      height={totalH + h * 0.25}
      viewBox={`0 0 ${totalW + w / 2} ${totalH + h * 0.25}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {hexes.map((h_, i) => (
        <polygon
          key={i}
          points={points(h_.x, h_.y)}
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
      ))}
    </svg>
  )
}
