import { useEffect, useState } from 'react'
import { getAvailability } from '../../lib/api'
import type { Barber } from '../../lib/api'

const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const WK_LABELS = ['Do','Lu','Ma','Mi','Ju','Vi','Sá']
const pad = (n: number) => String(n).padStart(2, '0')
const STRIPE = 'repeating-linear-gradient(135deg,rgba(200,200,200,0.06) 0 1px,transparent 1px 7px)'

interface Props {
  barber: Barber
  monthOffset: number
  selectedDate: string | null
  selectedTime: string | null
  onChangeBarber: () => void
  onMonthPrev: () => void
  onMonthNext: () => void
  onDateSelect: (date: string) => void
  onTimeSelect: (time: string | null) => void
}

export default function DateTimeStep({
  barber,
  monthOffset,
  selectedDate,
  selectedTime,
  onChangeBarber,
  onMonthPrev,
  onMonthNext,
  onDateSelect,
  onTimeSelect,
}: Props) {
  const [slots, setSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const todayStr = new Date().toISOString().split('T')[0]
  const todayDt = new Date(todayStr + 'T00:00:00')
  const viewDate = new Date(todayDt.getFullYear(), todayDt.getMonth() + monthOffset, 1)
  const y = viewDate.getFullYear()
  const m = viewDate.getMonth()
  const firstDow = new Date(y, m, 1).getDay()
  const daysInMonth = new Date(y, m + 1, 0).getDate()

  useEffect(() => {
    if (!selectedDate) { setSlots([]); return }
    setLoading(true)
    getAvailability(barber.id, selectedDate)
      .then(data => {
        if (Array.isArray(data)) {
          setSlots(data.map(s => s.start_datetime.substring(11, 16)))
        } else {
          setSlots([])
        }
      })
      .catch(() => setSlots([]))
      .finally(() => setLoading(false))
  }, [barber.id, selectedDate])

  const handleDateClick = (ds: string) => {
    onDateSelect(ds)
    onTimeSelect(null)
  }

  const calBase: React.CSSProperties = {
    aspectRatio: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '"DM Mono", monospace',
    fontSize: 11,
    letterSpacing: 0.5,
    border: '1px solid transparent',
    transition: 'all .18s cubic-bezier(.16,1,.3,1)',
    userSelect: 'none',
    cursor: 'pointer',
  }

  return (
    <div className="anim-bkn-fade">
      {/* Barber chip */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 11,
          padding: '13px 15px',
          background: '#111111',
          border: '1px solid rgba(200,200,200,0.08)',
          marginBottom: 18,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            flexShrink: 0,
            background: 'linear-gradient(155deg,#1c1c1c,#0d0d0d)',
            border: '1px solid rgba(200,200,200,0.1)',
          }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 8, letterSpacing: 1.5, textTransform: 'uppercase', color: '#666' }}>Con</div>
          <div style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 18, letterSpacing: 2, color: '#F0EDE8' }}>{barber.name}</div>
        </div>
        <button
          onClick={onChangeBarber}
          style={{
            background: 'transparent',
            border: '1px solid rgba(200,200,200,0.16)',
            color: 'rgba(240,237,232,0.6)',
            fontFamily: '"DM Mono", monospace',
            fontSize: 8,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            padding: '7px 12px',
            cursor: 'pointer',
          }}
        >
          Cambiar
        </button>
      </div>

      {/* Calendar */}
      <div style={{ background: '#111111', border: '1px solid rgba(200,200,200,0.08)', padding: 16 }}>
        {/* Month nav */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <button
            onClick={() => { if (monthOffset > 0) onMonthPrev() }}
            style={{
              width: 34, height: 34,
              border: '1px solid rgba(200,200,200,0.08)',
              background: 'transparent',
              fontSize: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all .15s',
              color: monthOffset <= 0 ? 'rgba(240,237,232,0.15)' : '#888',
              cursor: monthOffset <= 0 ? 'not-allowed' : 'pointer',
            }}
          >
            ‹
          </button>
          <span style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 20, letterSpacing: 2, color: '#F0EDE8' }}>
            {MONTHS[m]} {y}
          </span>
          <button
            onClick={onMonthNext}
            style={{
              width: 34, height: 34,
              border: '1px solid rgba(200,200,200,0.08)',
              background: 'transparent',
              color: '#888',
              cursor: 'pointer',
              fontSize: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ›
          </button>
        </div>

        {/* Weekday labels */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3, marginBottom: 7 }}>
          {WK_LABELS.map(w => (
            <div key={w} style={{ fontFamily: '"DM Mono", monospace', fontSize: 8, textTransform: 'uppercase', color: 'rgba(102,102,102,0.6)', textAlign: 'center', padding: '3px 0' }}>
              {w}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3 }}>
          {Array.from({ length: firstDow }, (_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const d = i + 1
            const dt = new Date(y, m, d)
            const ds = `${y}-${pad(m + 1)}-${pad(d)}`
            const isPast = dt < todayDt
            const isSun = dt.getDay() === 0
            const off = isPast || isSun
            const isToday = ds === todayStr
            const sel = ds === selectedDate

            let style: React.CSSProperties = { ...calBase }
            if (sel) {
              style = { ...style, background: '#B8996A', color: '#0A0A0A', fontWeight: 500 }
            } else if (off) {
              style = { ...style, color: 'rgba(240,237,232,0.12)', backgroundImage: STRIPE, cursor: 'not-allowed' }
            } else {
              style = { ...style, color: 'rgba(240,237,232,0.62)' }
              if (isToday) style = { ...style, border: '1px solid rgba(184,153,106,0.45)' }
            }

            return (
              <div
                key={ds}
                style={style}
                onClick={() => !off && handleDateClick(ds)}
              >
                {d}
              </div>
            )
          })}
        </div>

        {/* Time slots */}
        <div style={{ marginTop: 18, borderTop: '1px solid rgba(200,200,200,0.08)', paddingTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 8, letterSpacing: 2, textTransform: 'uppercase', color: '#666' }}>
              Horarios de {barber.name}
            </span>
            <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 7, letterSpacing: 1, color: '#666', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 8, height: 8, backgroundImage: STRIPE, display: 'inline-block' }} />
              OCUPADO
            </span>
          </div>

          {loading ? (
            <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 9, color: '#666', textAlign: 'center', padding: 20 }}>
              Cargando...
            </div>
          ) : !selectedDate ? (
            <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 9, color: '#666', textAlign: 'center', padding: 20 }}>
              Elegí una fecha primero
            </div>
          ) : slots.length === 0 ? (
            <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 9, color: '#666', textAlign: 'center', padding: 20 }}>
              Sin disponibilidad este día
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
              {slots.map(t => {
                const sel = selectedTime === t
                return (
                  <div
                    key={t}
                    onClick={() => onTimeSelect(selectedTime === t ? null : t)}
                    style={{
                      padding: '13px 6px',
                      textAlign: 'center',
                      fontFamily: '"DM Mono", monospace',
                      fontSize: 12,
                      letterSpacing: 1,
                      border: `1px solid ${sel ? '#B8996A' : 'rgba(200,200,200,0.08)'}`,
                      background: sel ? '#B8996A' : 'transparent',
                      color: sel ? '#0A0A0A' : 'rgba(240,237,232,0.6)',
                      fontWeight: sel ? 500 : 400,
                      cursor: 'pointer',
                      transition: 'all .18s',
                    }}
                  >
                    {t}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
