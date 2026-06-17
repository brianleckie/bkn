import { useState } from 'react'
import { createBlockedSlot } from '../../lib/api'
import type { Barber } from '../../lib/api'

interface Props {
  barbers: Barber[]
  token: string
  onClose: () => void
  onBlocked: () => void
}

export default function BlockSlotModal({ barbers, token, onClose, onBlocked }: Props) {
  const [barberId, setBarberId] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!start || !end) {
      setError('Completá fechas de inicio y fin')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await createBlockedSlot(token, {
        barber_id: barberId || null,
        start_datetime: new Date(start).toISOString(),
        end_datetime: new Date(end).toISOString(),
        reason: reason.trim() || null,
      })
      if (!res.ok) throw new Error('Error al bloquear')
      onBlocked()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al bloquear')
    } finally {
      setLoading(false)
    }
  }

  const labelStyle: React.CSSProperties = {
    marginBottom: 8,
    fontFamily: '"DM Mono", monospace',
    fontSize: 8.5,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: '#666',
  }
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    background: '#0E0E0E',
    border: '1px solid rgba(200,200,200,0.12)',
    color: '#F0EDE8',
    fontFamily: '"DM Mono", monospace',
    fontSize: 12,
    marginBottom: 16,
  }

  return (
    <div
      className="anim-bkn-modal"
      style={{
        width: '100%',
        maxWidth: 420,
        background: '#111111',
        border: '1px solid rgba(200,200,200,0.12)',
        boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
        padding: 24,
      }}
      onClick={e => e.stopPropagation()}
    >
      <div style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 22, letterSpacing: 2, color: '#F0EDE8', marginBottom: 20 }}>
        BLOQUEAR FRANJA
      </div>

      <div style={labelStyle}>Barbero (vacío = toda la barbería)</div>
      <select
        value={barberId}
        onChange={e => setBarberId(e.target.value)}
        style={{ ...inputStyle, appearance: 'none' }}
      >
        <option value="">Toda la barbería</option>
        {barbers.map(b => (
          <option key={b.id} value={b.id}>{b.name}</option>
        ))}
      </select>

      <div style={labelStyle}>Desde</div>
      <input
        type="datetime-local"
        value={start}
        onChange={e => setStart(e.target.value)}
        style={{ ...inputStyle, colorScheme: 'dark' }}
      />

      <div style={labelStyle}>Hasta</div>
      <input
        type="datetime-local"
        value={end}
        onChange={e => setEnd(e.target.value)}
        style={{ ...inputStyle, colorScheme: 'dark' }}
      />

      <div style={labelStyle}>Motivo (opcional)</div>
      <input
        type="text"
        value={reason}
        onChange={e => setReason(e.target.value)}
        placeholder="Ej: Vacaciones, mantenimiento..."
        style={inputStyle}
      />

      {error && (
        <div
          style={{
            marginBottom: 16,
            padding: 12,
            background: 'rgba(212,104,95,0.1)',
            border: '1px solid rgba(212,104,95,0.3)',
            fontFamily: '"DM Mono", monospace',
            fontSize: 9,
            color: '#d4685f',
          }}
        >
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={onClose}
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
          Cancelar
        </button>
        <button
          onClick={submit}
          disabled={loading}
          style={{
            flex: 1,
            padding: 14,
            background: '#B8996A',
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
          {loading ? 'Bloqueando...' : 'Bloquear'}
        </button>
      </div>
    </div>
  )
}
