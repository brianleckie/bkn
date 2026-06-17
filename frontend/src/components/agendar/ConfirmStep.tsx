import { useState } from 'react'
import { createAppointment } from '../../lib/api'
import type { Barber, Service } from '../../lib/api'

const WK_SHORT = ['DOM','LUN','MAR','MIÉ','JUE','VIE','SÁB']
const MONTHS_SHORT = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC']
const pad = (n: number) => String(n).padStart(2, '0')

interface Props {
  barber: Barber
  selectedDate: string
  selectedTime: string
  service: Service
  clientName: string
  phone: string
  onNameChange: (v: string) => void
  onPhoneChange: (v: string) => void
  onDone: () => void
  isDemo: boolean
}

export default function ConfirmStep({
  barber,
  selectedDate,
  selectedTime,
  service,
  clientName,
  phone,
  onNameChange,
  onPhoneChange,
  onDone,
  isDemo,
}: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const d = new Date(selectedDate + 'T00:00:00')
  const dateLabel = `${WK_SHORT[d.getDay()]} ${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`
  const price = parseFloat(service.price).toLocaleString('es-PY') + ' Gs'
  const phoneOk = phone.replace(/\D/g, '').length >= 8
  const nameOk = clientName.trim().length > 0
  const canSubmit = phoneOk && nameOk && !loading

  const rows = [
    { k: 'Barbero',  v: barber.name,        vStyle: { fontSize: 13, fontWeight: 400, color: '#F0EDE8', textAlign: 'right' as const } },
    { k: 'Fecha',    v: dateLabel,           vStyle: { fontSize: 13, fontWeight: 400, color: '#F0EDE8', textAlign: 'right' as const } },
    { k: 'Hora',     v: selectedTime + ' hs', vStyle: { fontSize: 13, fontWeight: 400, color: '#F0EDE8', textAlign: 'right' as const } },
    { k: 'Servicio', v: service.name,        vStyle: { fontSize: 13, fontWeight: 400, color: '#F0EDE8', textAlign: 'right' as const } },
    { k: 'Precio',   v: price,               vStyle: { fontFamily: '"Bebas Neue", sans-serif', fontSize: 20, letterSpacing: 1, color: '#B8996A' } },
  ]

  const submit = async () => {
    if (!canSubmit) return
    setLoading(true)
    setError('')
    try {
      if (isDemo) {
        await new Promise(r => setTimeout(r, 800))
        onDone()
        return
      }
      const startISO = `${selectedDate}T${selectedTime}:00-04:00`
      const res = await createAppointment({
        barber_id: barber.id,
        service_id: service.id,
        client_name: clientName.trim(),
        client_phone: phone.trim(),
        start_datetime: startISO,
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error((err as { detail?: string }).detail ?? 'Error al reservar')
      }
      onDone()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al reservar. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="anim-bkn-fade">
      {/* Summary */}
      <div style={{ background: '#111111', border: '1px solid rgba(200,200,200,0.08)', marginBottom: 20 }}>
        <div
          style={{
            background: '#1A1A1A',
            padding: '14px 16px',
            borderBottom: '1px solid rgba(200,200,200,0.08)',
            fontFamily: '"Bebas Neue", sans-serif',
            fontSize: 17,
            letterSpacing: 3,
            color: '#F0EDE8',
          }}
        >
          RESUMEN DE TU TURNO
        </div>
        {rows.map(r => (
          <div
            key={r.k}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '14px 16px',
              borderBottom: '1px solid rgba(200,200,200,0.06)',
            }}
          >
            <span
              style={{
                fontFamily: '"DM Mono", monospace',
                fontSize: 8.5,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                color: '#666',
              }}
            >
              {r.k}
            </span>
            <span style={r.vStyle}>{r.v}</span>
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            marginBottom: 16,
            padding: 14,
            background: 'rgba(212,104,95,0.1)',
            border: '1px solid rgba(212,104,95,0.3)',
            fontFamily: '"DM Mono", monospace',
            fontSize: 9,
            letterSpacing: 1,
            color: '#d4685f',
          }}
        >
          {error}
        </div>
      )}

      {/* Name */}
      <div
        style={{
          marginBottom: 8,
          fontFamily: '"DM Mono", monospace',
          fontSize: 8.5,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          color: '#666',
        }}
      >
        Tu Nombre
      </div>
      <input
        value={clientName}
        onChange={e => onNameChange(e.target.value)}
        placeholder="Tu nombre completo"
        style={{
          width: '100%',
          padding: '15px 16px',
          background: '#0E0E0E',
          border: '1px solid rgba(200,200,200,0.12)',
          color: '#F0EDE8',
          fontFamily: '"DM Mono", monospace',
          fontSize: 16,
          letterSpacing: 1,
          marginBottom: 16,
        }}
      />

      {/* Phone */}
      <div
        style={{
          marginBottom: 8,
          fontFamily: '"DM Mono", monospace',
          fontSize: 8.5,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          color: '#666',
        }}
      >
        Tu WhatsApp
      </div>
      <input
        type="tel"
        inputMode="tel"
        value={phone}
        onChange={e => onPhoneChange(e.target.value)}
        placeholder="+595 9XX XXX XXX"
        style={{
          width: '100%',
          padding: '15px 16px',
          background: '#0E0E0E',
          border: '1px solid rgba(200,200,200,0.12)',
          color: '#F0EDE8',
          fontFamily: '"DM Mono", monospace',
          fontSize: 16,
          letterSpacing: 1,
          marginBottom: 6,
        }}
      />
      <div
        style={{
          fontSize: 11,
          fontWeight: 300,
          color: 'rgba(240,237,232,0.35)',
          lineHeight: 1.6,
          marginBottom: 20,
        }}
      >
        Lo usamos solo para confirmar el turno y avisarte si hay cambios.
      </div>

      {/* Submit */}
      <button
        onClick={submit}
        disabled={!canSubmit}
        style={{
          width: '100%',
          padding: 17,
          fontFamily: '"DM Mono", monospace',
          fontSize: 10,
          letterSpacing: 2.5,
          textTransform: 'uppercase',
          border: 'none',
          fontWeight: 500,
          transition: 'all .2s',
          background: canSubmit ? '#B8996A' : '#1A1A1A',
          color: canSubmit ? '#0A0A0A' : 'rgba(240,237,232,0.25)',
          cursor: canSubmit ? 'pointer' : 'not-allowed',
        }}
      >
        {loading ? 'Reservando...' : canSubmit ? 'Confirmar Reserva →' : 'Ingresá tu nombre y WhatsApp'}
      </button>
    </div>
  )
}
