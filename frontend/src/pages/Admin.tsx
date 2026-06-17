import { useEffect, useState, useCallback } from 'react'
import { getMe, getAdminBarbers, getAdminAppointments, type Barber, type Appointment } from '../lib/api'
import LoginScreen from '../components/admin/LoginScreen'
import KpiStrip from '../components/admin/KpiStrip'
import DayView from '../components/admin/DayView'
import WeekView from '../components/admin/WeekView'
import ListView from '../components/admin/ListView'
import AppointmentModal from '../components/admin/AppointmentModal'
import BlockSlotModal from '../components/admin/BlockSlotModal'

const pad = (n: number) => String(n).padStart(2, '0')
const WK_DAYS = ['DOM','LUN','MAR','MIÉ','JUE','VIE','SÁB']
const MONTHS = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC']

type AdminView = 'day' | 'week' | 'list'

export default function Admin() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('bkn_token'))
  const [checking, setChecking] = useState(!!localStorage.getItem('bkn_token'))
  const [adminView, setAdminView] = useState<AdminView>('day')
  const [barberFilter, setBarberFilter] = useState('all')
  const [barbers, setBarbers] = useState<Barber[]>([])
  const [appts, setAppts] = useState<Appointment[]>([])
  const [modalAppt, setModalAppt] = useState<Appointment | null>(null)
  const [showBlock, setShowBlock] = useState(false)
  const [clock, setClock] = useState({ date: '', time: '' })

  // Live clock
  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const dateStr = `${WK_DAYS[now.getDay()]} ${pad(now.getDate())} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`
      const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())} · EN VIVO`
      setClock({ date: dateStr, time: timeStr })
    }
    tick()
    const id = setInterval(tick, 30000)
    return () => clearInterval(id)
  }, [])

  const loadData = useCallback(async (tok: string) => {
    try {
      const [b, a] = await Promise.all([
        getAdminBarbers(tok),
        getAdminAppointments(tok, new Date().toISOString().split('T')[0]),
      ])
      setBarbers(Array.isArray(b) ? b : [])
      setAppts(Array.isArray(a) ? a : [])
    } catch {
      setBarbers([])
      setAppts([])
    }
  }, [])

  // Auto-login check
  useEffect(() => {
    const savedToken = localStorage.getItem('bkn_token')
    if (!savedToken) { setChecking(false); return }
    getMe(savedToken)
      .then(r => r.json())
      .then((user: { id?: string }) => {
        if (user.id) {
          setToken(savedToken)
          loadData(savedToken)
        } else {
          localStorage.removeItem('bkn_token')
          setToken(null)
        }
      })
      .catch(() => {
        localStorage.removeItem('bkn_token')
        setToken(null)
      })
      .finally(() => setChecking(false))
  }, [loadData])

  const handleLogin = (tok: string) => {
    setToken(tok)
    loadData(tok)
  }

  const handleLogout = () => {
    localStorage.removeItem('bkn_token')
    setToken(null)
    setAppts([])
    setBarbers([])
  }

  const openModal = (id: string) => {
    const appt = appts.find(a => a.id === id)
    if (appt) setModalAppt(appt)
  }

  const handleCancelled = (id: string) => {
    setAppts(prev => prev.filter(a => a.id !== id))
    setModalAppt(null)
  }

  // Loading state while checking saved token
  if (checking) {
    return (
      <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 9, letterSpacing: 2, color: '#666' }}>CARGANDO...</div>
      </div>
    )
  }

  if (!token) return <LoginScreen onLogin={handleLogin} />

  const TAB_STYLE = (active: boolean): React.CSSProperties => ({
    fontFamily: '"DM Mono", monospace',
    fontSize: 9.5,
    letterSpacing: 2,
    padding: '9px 15px',
    border: 'none',
    cursor: 'pointer',
    textTransform: 'uppercase',
    background: active ? '#B8996A' : 'transparent',
    color: active ? '#0A0A0A' : 'rgba(240,237,232,0.5)',
    fontWeight: active ? 500 : 400,
  })

  const CHIP_STYLE = (active: boolean): React.CSSProperties => ({
    fontFamily: '"DM Mono", monospace',
    fontSize: 8.5,
    letterSpacing: 1.5,
    padding: '8px 12px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all .2s',
    textTransform: 'uppercase',
    lineHeight: 1,
    background: active ? '#B8996A' : 'transparent',
    color: active ? '#0A0A0A' : 'rgba(240,237,232,0.45)',
    fontWeight: active ? 500 : 400,
  })

  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh', color: '#F0EDE8' }}>
      {/* Top bar */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 18px',
          background: 'rgba(10,10,10,0.92)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(200,200,200,0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/bkn-logo.jpg" alt="BKN" style={{ width: 30, height: 30, objectFit: 'contain', mixBlendMode: 'screen' }} />
          <span style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 20, letterSpacing: 5, color: '#F0EDE8', paddingLeft: 2 }}>BKN</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 9, letterSpacing: 1.5, color: '#666', textAlign: 'right' }}>
            {clock.date}
            <br />
            <span style={{ color: '#B8996A' }}>{clock.time}</span>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: 'transparent',
              border: '1px solid rgba(200,200,200,0.16)',
              color: 'rgba(240,237,232,0.5)',
              fontFamily: '"DM Mono", monospace',
              fontSize: 8,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              padding: '7px 12px',
              cursor: 'pointer',
            }}
          >
            Salir
          </button>
        </div>
      </div>

      <div style={{ padding: '28px 24px 0' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: '#B8996A', marginBottom: 8 }}>
              Panel de administración
            </div>
            <div style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 'clamp(38px,9vw,56px)', letterSpacing: 2, lineHeight: 0.9, color: '#F0EDE8' }}>
              AGENDA <span className="bkn-outline">BKN</span>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <KpiStrip appts={appts} />

        {/* Toolbar */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <div style={{ display: 'flex', border: '1px solid rgba(200,200,200,0.1)' }}>
            {(['day','week','list'] as AdminView[]).map(v => (
              <button key={v} onClick={() => setAdminView(v)} style={TAB_STYLE(adminView === v)}>
                {v === 'day' ? 'DÍA' : v === 'week' ? 'SEMANA' : 'LISTA'}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <span style={{ fontFamily: '"DM Mono", monospace', fontSize: 8, letterSpacing: 1.5, textTransform: 'uppercase', color: '#666' }}>Barbero</span>
            <div style={{ display: 'flex', border: '1px solid rgba(200,200,200,0.1)' }}>
              <button onClick={() => setBarberFilter('all')} style={CHIP_STYLE(barberFilter === 'all')}>TODOS</button>
              {barbers.map(b => (
                <button key={b.id} onClick={() => setBarberFilter(b.id)} style={CHIP_STYLE(barberFilter === b.id)}>
                  {b.name.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* View container */}
      <div style={{ padding: '18px 24px 80px' }}>
        {adminView === 'day' && <DayView appts={appts} barberFilter={barberFilter} onOpenModal={openModal} />}
        {adminView === 'week' && <WeekView appts={appts} barberFilter={barberFilter} onOpenModal={openModal} />}
        {adminView === 'list' && <ListView appts={appts} barberFilter={barberFilter} onOpenModal={openModal} />}
      </div>

      {/* Block slot FAB */}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 50 }}>
        <button
          onClick={() => setShowBlock(true)}
          style={{
            padding: '14px 20px',
            background: '#1A1A1A',
            border: '1px solid rgba(200,200,200,0.16)',
            color: 'rgba(240,237,232,0.6)',
            fontFamily: '"DM Mono", monospace',
            fontSize: 9,
            letterSpacing: 2,
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          + Bloquear franja
        </button>
      </div>

      {/* Appointment modal */}
      {modalAppt && (
        <div
          onClick={() => setModalAppt(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1500,
            background: 'rgba(0,0,0,0.74)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <AppointmentModal
            appt={modalAppt}
            token={token}
            onClose={() => setModalAppt(null)}
            onCancelled={handleCancelled}
          />
        </div>
      )}

      {/* Block slot modal */}
      {showBlock && (
        <div
          onClick={() => setShowBlock(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1500,
            background: 'rgba(0,0,0,0.74)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <BlockSlotModal
            barbers={barbers}
            token={token}
            onClose={() => setShowBlock(false)}
            onBlocked={() => { setShowBlock(false); loadData(token) }}
          />
        </div>
      )}
    </div>
  )
}
