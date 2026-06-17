import { useEffect, useRef } from 'react'
import Reveal from '../Reveal'

interface CounterProps {
  target: number
  suffix: string
  label: string
  borderRight?: boolean
}

function Counter({ target, suffix, label, borderRight }: CounterProps) {
  const numRef = useRef<HTMLSpanElement>(null)
  const animated = useRef(false)

  useEffect(() => {
    const el = numRef.current
    if (!el) return

    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting && !animated.current) {
            animated.current = true
            const dur = 1200
            const t0 = performance.now()
            const step = (t: number) => {
              const p = Math.min(1, (t - t0) / dur)
              const eased = 1 - Math.pow(1 - p, 3)
              el.textContent = Math.round(target * eased) + suffix
              if (p < 1) requestAnimationFrame(step)
            }
            requestAnimationFrame(step)
            obs.unobserve(e.target)
          }
        })
      },
      { threshold: 0.4 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [target, suffix])

  return (
    <div
      style={{
        flex: 1,
        padding: '18px 12px',
        textAlign: 'center',
        borderRight: borderRight ? '1px solid rgba(200,200,200,0.1)' : undefined,
      }}
    >
      <span
        ref={numRef}
        style={{
          fontFamily: '"Bebas Neue", sans-serif',
          fontSize: 30,
          letterSpacing: 2,
          color: '#B8996A',
          display: 'block',
          lineHeight: 1,
        }}
      >
        0
      </span>
      <span
        style={{
          fontFamily: '"DM Mono", monospace',
          fontSize: 8,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          color: '#666',
          display: 'block',
          marginTop: 5,
        }}
      >
        {label}
      </span>
    </div>
  )
}

export default function StatsStrip() {
  return (
    <section style={{ padding: '0 24px 8px', background: '#0A0A0A' }}>
      <Reveal>
        <div style={{ display: 'flex', border: '1px solid rgba(200,200,200,0.1)' }}>
          <Counter target={500} suffix="+" label="Clientes" borderRight />
          <Counter target={2} suffix="" label="Barberos" borderRight />
          <Counter target={100} suffix="%" label="Precisión" />
        </div>
      </Reveal>
    </section>
  )
}
