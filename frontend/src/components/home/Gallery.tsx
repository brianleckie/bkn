import { useEffect, useRef, useState } from 'react'
import { getPublicGallery, type GalleryImage } from '../../lib/api'
import Reveal from '../Reveal'

const FALLBACK = [
  { id:'g1', image_url: '', title: 'Fade Clásico',          cat: 'CORTE',   note: 'foto · fade' },
  { id:'g2', image_url: '', title: 'Corte + Barba',         cat: 'COMBO',   note: 'foto · combo' },
  { id:'g3', image_url: '', title: 'Afeitado a Navaja',     cat: 'RITUAL',  note: 'foto · afeitado' },
  { id:'g4', image_url: '', title: 'Degradé de Precisión',  cat: 'CORTE',   note: 'foto · degradé' },
  { id:'g5', image_url: '', title: 'Diseño Freestyle',      cat: 'DISEÑO',  note: 'foto · líneas' },
  { id:'g6', image_url: '', title: 'Barba Esculpida',       cat: 'BARBA',   note: 'foto · barba' },
]

interface Item { id: string; image_url: string; title: string; cat: string; note: string }

export default function Gallery() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [items, setItems] = useState<Item[]>(FALLBACK)
  const [btnHover, setBtnHover] = useState<'prev' | 'next' | null>(null)

  useEffect(() => {
    getPublicGallery()
      .then((data: GalleryImage[]) => {
        if (Array.isArray(data) && data.length) {
          setItems(data.map(g => ({ id: g.id, image_url: g.image_url, title: g.title ?? '', cat: '', note: 'foto' })))
        }
      })
      .catch(() => {})
  }, [])

  const scroll = (dir: number) => scrollRef.current?.scrollBy({ left: dir * 246, behavior: 'smooth' })

  const btnStyle = (id: 'prev' | 'next'): React.CSSProperties => ({
    width: 40,
    height: 40,
    border: `1px solid ${btnHover === id ? '#B8996A' : 'rgba(200,200,200,0.16)'}`,
    background: 'transparent',
    color: btnHover === id ? '#B8996A' : '#C8C8C8',
    cursor: 'pointer',
    fontSize: 15,
    transition: 'all .15s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  })

  return (
    <section style={{ padding: '72px 0', background: '#111111', overflow: 'hidden' }}>
      <Reveal style={{ padding: '0 24px', marginBottom: 32, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20 }}>
        <div>
          <div
            style={{
              fontFamily: '"DM Mono", monospace',
              fontSize: 9,
              letterSpacing: 3,
              textTransform: 'uppercase',
              color: '#B8996A',
              marginBottom: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span style={{ width: 22, height: 1, background: '#B8996A', display: 'inline-block' }} />
            Nuestro trabajo
          </div>
          <div
            style={{
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: 'clamp(46px, 12vw, 72px)',
              letterSpacing: 2,
              lineHeight: 0.9,
              color: '#F0EDE8',
            }}
          >
            GALE<span className="bkn-outline">RÍA</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button
            onClick={() => scroll(-1)}
            onMouseEnter={() => setBtnHover('prev')}
            onMouseLeave={() => setBtnHover(null)}
            style={btnStyle('prev')}
          >
            ‹
          </button>
          <button
            onClick={() => scroll(1)}
            onMouseEnter={() => setBtnHover('next')}
            onMouseLeave={() => setBtnHover(null)}
            style={btnStyle('next')}
          >
            ›
          </button>
        </div>
      </Reveal>

      <div
        ref={scrollRef}
        className="bkn-scroll"
        style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          padding: '0 24px',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {items.map(g => (
          <div
            key={g.id}
            style={{
              flexShrink: 0,
              width: 230,
              height: 300,
              position: 'relative',
              overflow: 'hidden',
              scrollSnapAlign: 'start',
              border: '1px solid rgba(200,200,200,0.08)',
              background: 'linear-gradient(155deg,#1a1a1a,#0d0d0d)',
            }}
          >
            {g.image_url ? (
              <img
                src={g.image_url}
                alt={g.title}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <>
                <div
                  className="bkn-stripe"
                  style={{ position: 'absolute', inset: 0 }}
                />
                <img
                  src="/bkn-logo.jpg"
                  alt=""
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    width: 26,
                    height: 26,
                    objectFit: 'contain',
                    mixBlendMode: 'screen',
                    opacity: 0.22,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%,-50%)',
                    fontFamily: '"DM Mono", monospace',
                    fontSize: 8,
                    letterSpacing: 2,
                    color: 'rgba(184,153,106,0.4)',
                    border: '1px dashed rgba(184,153,106,0.2)',
                    padding: '7px 11px',
                  }}
                >
                  {g.note}
                </div>
              </>
            )}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '32px 16px 16px',
                background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
              }}
            >
              {g.cat && (
                <div
                  style={{
                    fontFamily: '"DM Mono", monospace',
                    fontSize: 7,
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                    color: '#B8996A',
                    marginBottom: 5,
                  }}
                >
                  {g.cat}
                </div>
              )}
              <div
                style={{
                  fontFamily: '"Bebas Neue", sans-serif',
                  fontSize: 18,
                  letterSpacing: 2,
                  color: '#F0EDE8',
                }}
              >
                {g.title}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          padding: '0 24px',
          marginTop: 18,
          fontFamily: '"DM Mono", monospace',
          fontSize: 8,
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: '#555',
        }}
      >
        ← Deslizá · {items.length} trabajos
      </div>
    </section>
  )
}
