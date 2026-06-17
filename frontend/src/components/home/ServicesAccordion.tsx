import { useEffect, useState } from 'react'
import { getServices, type Service } from '../../lib/api'
import Reveal from '../Reveal'

const FALLBACK = [
  { id:'s1', num:'01', name:'Corte Clásico',    desc:'Tijera y máquina. Lavado y peinado.',    price:'60K Gs', time:'60 MIN', detail:'Consulta de estilo, lavado con productos premium, corte a tijera y máquina, peinado y acabado.' },
  { id:'s2', num:'02', name:'Perfilado Barba',   desc:'Diseño y perfilado con navaja.',          price:'40K Gs', time:'60 MIN', detail:'Definición de líneas con navaja, toalla caliente, aceite e hidratación.' },
  { id:'s3', num:'03', name:'Combo Completo',    desc:'Corte + barba + tratamiento.',            price:'90K Gs', time:'60 MIN', detail:'La experiencia BKN completa: corte de precisión, perfilado de barba a navaja y tratamiento capilar.' },
  { id:'s4', num:'04', name:'Afeitado Clásico',  desc:'Navaja, toalla caliente y bálsamo.',      price:'50K Gs', time:'60 MIN', detail:'Ritual tradicional: toalla caliente, espuma artesanal, afeitado a navaja y bálsamo post-afeitado.' },
  { id:'s5', num:'05', name:'Diseño & Líneas',   desc:'Freestyle, líneas y detalles.',           price:'70K Gs', time:'60 MIN', detail:'Diseños personalizados, líneas, degradados de precisión y detalles a mano alzada.' },
]

interface Row { id: string; num: string; name: string; desc: string; price: string; time: string; detail: string }

function fromApi(services: Service[]): Row[] {
  return services.map((s, i) => ({
    id: s.id,
    num: String(i + 1).padStart(2, '0'),
    name: s.name,
    desc: s.description ?? '',
    price: parseFloat(s.price).toLocaleString('es-PY') + ' Gs',
    time: s.duration_minutes + ' MIN',
    detail: s.description ?? '',
  }))
}

export default function ServicesAccordion() {
  const [items, setItems] = useState<Row[]>(FALLBACK)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    getServices()
      .then(data => { if (Array.isArray(data) && data.length) setItems(fromApi(data)) })
      .catch(() => {})
  }, [])

  const toggle = (id: string) => setExpanded(prev => (prev === id ? null : id))

  return (
    <section id="bkn-servicios" style={{ padding: '56px 24px 72px', background: '#111111' }}>
      <Reveal style={{ marginBottom: 36 }}>
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
          Lo que hacemos
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
          SERVI<span className="bkn-outline">CIOS</span>
        </div>
      </Reveal>

      <Reveal>
        <div style={{ border: '1px solid rgba(200,200,200,0.08)' }}>
          {items.map(s => {
            const open = expanded === s.id
            return (
              <div
                key={s.id}
                onClick={() => toggle(s.id)}
                style={{
                  padding: 20,
                  borderBottom: '1px solid rgba(200,200,200,0.08)',
                  cursor: 'pointer',
                  transition: 'background .2s',
                  background: open ? '#171717' : 'transparent',
                  boxShadow: open ? 'inset 2px 0 0 #B8996A' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div
                    style={{
                      fontFamily: '"Bebas Neue", sans-serif',
                      fontSize: 13,
                      letterSpacing: 1,
                      color: '#B8996A',
                      width: 22,
                      flexShrink: 0,
                      opacity: 0.6,
                    }}
                  >
                    {s.num}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: '"Bebas Neue", sans-serif',
                        fontSize: 21,
                        letterSpacing: 2,
                        color: '#F0EDE8',
                        marginBottom: 3,
                      }}
                    >
                      {s.name}
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 300, color: '#666', lineHeight: 1.5 }}>
                      {s.desc}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span
                      style={{
                        fontFamily: '"Bebas Neue", sans-serif',
                        fontSize: 23,
                        letterSpacing: 1,
                        color: '#B8996A',
                        display: 'block',
                        lineHeight: 1,
                      }}
                    >
                      {s.price}
                    </span>
                    <span
                      style={{
                        fontFamily: '"DM Mono", monospace',
                        fontSize: 8,
                        letterSpacing: 1,
                        color: '#666',
                        display: 'block',
                        marginTop: 4,
                      }}
                    >
                      {s.time}
                    </span>
                  </div>
                  <div
                    style={{
                      fontFamily: '"DM Mono", monospace',
                      fontSize: 18,
                      color: '#B8996A',
                      flexShrink: 0,
                      transition: 'transform .25s',
                      transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
                    }}
                  >
                    +
                  </div>
                </div>

                {/* Detail panel */}
                <div
                  style={{
                    overflow: 'hidden',
                    maxHeight: open ? 170 : 0,
                    opacity: open ? 1 : 0,
                    transition: 'max-height .35s cubic-bezier(.16,1,.3,1), opacity .3s',
                  }}
                >
                  <div
                    style={{
                      paddingTop: 14,
                      fontSize: 12,
                      fontWeight: 300,
                      lineHeight: 1.75,
                      color: 'rgba(240,237,232,0.5)',
                      borderTop: '1px solid rgba(200,200,200,0.08)',
                      marginTop: 14,
                    }}
                  >
                    {s.detail}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Reveal>
    </section>
  )
}
