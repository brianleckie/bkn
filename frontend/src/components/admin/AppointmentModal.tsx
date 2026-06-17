import { useState } from 'react'
import { cancelAppointment } from '../../lib/api'
import type { Appointment } from '../../lib/api'

const fmtTime = (iso: string) => iso.substring(11, 16)
const pad = (n: number) => String(n).padStart(2, '0')
const WK_SHORT = ['DOM','LUN','MAR','MIÉ','JUE','VIE','SÁB']
const MONTHS_SHORT = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC']

const fmtDateLabel = (iso: string) => {
  const d = new Date(iso)
  return `${WK_SHORT[d.getDay()]} ${pad(d.getDate())} ${MONTHS_SHORT[d.getMonth()]}`
}

const waLink = (phone: string, text: string) =>
  `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`

interface Props {
  appt: Appointment
  token: string
  onClose: () => void
  onCancelled: (id: string) => void
}

export default function AppointmentModal({ appt, token, onClose, onCancelled }: Props) {
  const [mode, setMode] = useState<'menu' | 'cancel_confirm'>('menu')

  const dateLabel = fmtDateLabel(appt.start_datetime)
  const time = fmtTime(appt.start_datetime)
  const price = appt.service_price ? parseFloat(appt.service_price).toLocaleString('es-PY') + ' Gs' : '—'
  const phone = appt.client_phone ?? ''
  const waReminder = waLink(phone, `Hola ${appt.client_name}, te recordamos tu turno en BKN Barbershop: ${dateLabel} a las ${time} hs. ¡Te esperamos!`)

  const doCancel = async () => {
    try {
      await cancelAppointment(token, appt.id)
      onCancelled(appt.id)
    } catch (e) {
      alert('Error al cancelar: ' + (e instanceof Error ? e.message : ''))
    }
  }

  const header = (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 20px',
        borderBottom: '1px solid rgba(200,200,200,0.08)',
        background: '#1A1A1A',
      }}
    >
      <div>
        <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 8, letterSpacing: 2, textTransform: 'uppercase', color: '#B8996A', marginBottom: 4 }}>
          {dateLabel}
        </div>
        <div style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 26, letterSpacing: 2, color: '#F0EDE8', lineHeight: 1 }}>
          {time} HS
        </div>
      </div>
      <button
        onClick={onClose}
        style={{
          width: 34,
          height: 34,
          border: '1px solid rgba(200,200,200,0.12)',
          background: 'transparent',
          color: '#999',
          cursor: 'pointer',
          fontSize: 16,
          lineHeight: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        ✕
      </button>
    </div>
  )

  return (
    <div
      className="anim-bkn-modal"
      style={{
        width: '100%',
        maxWidth: 420,
        background: '#111111',
        border: '1px solid rgba(200,200,200,0.12)',
        boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
        maxHeight: '92vh',
        overflow: 'auto',
      }}
      onClick={e => e.stopPropagation()}
    >
      {header}

      {mode === 'menu' && (
        <div style={{ padding: 20 }}>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 19, fontWeight: 500, color: '#F0EDE8', marginBottom: 16 }}>
            {appt.client_name}
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              background: 'rgba(200,200,200,0.06)',
              border: '1px solid rgba(200,200,200,0.06)',
              marginBottom: 22,
            }}
          >
            {[
              ['Servicio', appt.service_name ?? '—'],
              ['Barbero', appt.barber_name ?? '—'],
              ['WhatsApp', phone],
              ['Precio', price],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', background: '#0E0E0E' }}>
                <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 8.5, letterSpacing: 1.5, textTransform: 'uppercase', color: '#666' }}>{k}</span>
                <span style={{ fontSize: 12, fontWeight: 300, color: 'rgba(240,237,232,0.8)' }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              onClick={() => setMode('cancel_confirm')}
              style={{
                width: '100%',
                padding: 15,
                background: 'transparent',
                color: '#d4685f',
                fontFamily: '"DM Mono", monospace',
                fontSize: 10,
                letterSpacing: 2,
                textTransform: 'uppercase',
                border: '1px solid rgba(212,104,95,0.28)',
                cursor: 'pointer',
              }}
            >
              Cancelar turno
            </button>
            <a
              href={waReminder}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                width: '100%',
                padding: 15,
                background: 'transparent',
                color: '#25D366',
                fontFamily: '"DM Mono", monospace',
                fontSize: 10,
                letterSpacing: 2,
                textTransform: 'uppercase',
                border: '1px solid rgba(37,211,102,0.3)',
                textDecoration: 'none',
                textAlign: 'center',
              }}
            >
              Avisar por WhatsApp
            </a>
          </div>
        </div>
      )}

      {mode === 'cancel_confirm' && (
        <div style={{ padding: '28px 22px', textAlign: 'center' }}>
          <div style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 24, letterSpacing: 2, color: '#F0EDE8', marginBottom: 10 }}>
            ¿CANCELAR ESTE TURNO?
          </div>
          <div style={{ fontSize: 12, fontWeight: 300, color: 'rgba(240,237,232,0.5)', lineHeight: 1.7, maxWidth: 280, margin: '0 auto 24px' }}>
            Se libera la franja de{' '}
            <span style={{ color: '#B8996A' }}>{time} hs</span>{' '}
            de {appt.client_name}.
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setMode('menu')}
              style={{
                flex: 1,
                padding: 14,
                background: 'transparent',
                color: '#C8C8C8',
                fontFamily: '"DM Mono", monospace',
                fontSize: 9,
                letterSpacing: 2,
                textTransform: 'uppercase',
                border: '1px solid rgba(200,200,200,0.2)',
                cursor: 'pointer',
              }}
            >
              Volver
            </button>
            <button
              onClick={doCancel}
              style={{
                flex: 1,
                padding: 14,
                background: '#d4685f',
                color: '#0A0A0A',
                fontFamily: '"DM Mono", monospace',
                fontSize: 9,
                letterSpacing: 2,
                textTransform: 'uppercase',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              Sí, cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
