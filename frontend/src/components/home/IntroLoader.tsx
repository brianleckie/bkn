import { useEffect, useState } from 'react'

export default function IntroLoader() {
  const [opacity, setOpacity] = useState(1)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setOpacity(0), 1000)
    const t2 = setTimeout(() => setGone(true), 1750)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  if (gone) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        background: '#0A0A0A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
        pointerEvents: opacity === 0 ? 'none' : 'auto',
        transition: 'opacity .7s ease',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <img
          src="/bkn-logo.jpg"
          alt="BKN"
          style={{
            width: 72,
            height: 72,
            objectFit: 'contain',
            mixBlendMode: 'screen',
            margin: '0 auto 18px',
            display: 'block',
          }}
        />
        <div
          style={{
            fontFamily: '"Bebas Neue", sans-serif',
            fontSize: 54,
            letterSpacing: 14,
            color: '#F0EDE8',
            lineHeight: 1,
            paddingLeft: 14,
          }}
        >
          BKN
        </div>
        <div
          className="anim-bkn-line"
          style={{
            height: 2,
            background: '#B8996A',
            margin: '14px auto 0',
            width: 110,
          }}
        />
        <div
          className="anim-bkn-fadein"
          style={{
            fontFamily: '"DM Mono", monospace',
            fontSize: 8,
            letterSpacing: 4,
            color: '#666',
            marginTop: 14,
            textTransform: 'uppercase',
          }}
        >
          PREMIUM BARBERSHOP
        </div>
      </div>
    </div>
  )
}
