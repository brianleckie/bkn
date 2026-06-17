import { useState } from 'react'
import { Link } from 'react-router-dom'
import { login } from '../../lib/api'

interface Props {
  onLogin: (token: string) => void
}

export default function LoginScreen({ onLogin }: Props) {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const doLogin = async () => {
    setLoading(true)
    setError('')
    try {
      const token = await login(email.trim(), pass)
      localStorage.setItem('bkn_token', token)
      onLogin(token)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        background: '#0A0A0A',
      }}
    >
      <div style={{ width: '100%', maxWidth: 360 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <img
            src="/bkn-logo.jpg"
            alt="BKN"
            style={{ width: 60, height: 60, objectFit: 'contain', mixBlendMode: 'screen', margin: '0 auto 16px', display: 'block' }}
          />
          <div style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: 32, letterSpacing: 8, color: '#F0EDE8', marginBottom: 4, paddingLeft: 8 }}>BKN</div>
          <div style={{ fontFamily: '"DM Mono", monospace', fontSize: 8, letterSpacing: 3, textTransform: 'uppercase', color: '#666' }}>Panel de Administración</div>
        </div>

        {error && (
          <div
            style={{
              marginBottom: 16,
              padding: '12px 14px',
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

        <div style={{ marginBottom: 8, fontFamily: '"DM Mono", monospace', fontSize: 8.5, letterSpacing: 1.5, textTransform: 'uppercase', color: '#666' }}>Email</div>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="admin@bknbarbershop.com"
          style={{ width: '100%', padding: '14px 16px', background: '#0E0E0E', border: '1px solid rgba(200,200,200,0.12)', color: '#F0EDE8', fontFamily: '"DM Mono", monospace', fontSize: 13, marginBottom: 16 }}
        />

        <div style={{ marginBottom: 8, fontFamily: '"DM Mono", monospace', fontSize: 8.5, letterSpacing: 1.5, textTransform: 'uppercase', color: '#666' }}>Contraseña</div>
        <input
          type="password"
          value={pass}
          onChange={e => setPass(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') doLogin() }}
          placeholder="••••••••"
          style={{ width: '100%', padding: '14px 16px', background: '#0E0E0E', border: '1px solid rgba(200,200,200,0.12)', color: '#F0EDE8', fontFamily: '"DM Mono", monospace', fontSize: 13, marginBottom: 24 }}
        />

        <button
          onClick={doLogin}
          disabled={loading}
          style={{ width: '100%', padding: 16, background: '#B8996A', color: '#0A0A0A', fontFamily: '"DM Mono", monospace', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', border: 'none', cursor: 'pointer', fontWeight: 500 }}
        >
          {loading ? 'Ingresando...' : 'Ingresar →'}
        </button>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link
            to="/"
            style={{ fontFamily: '"DM Mono", monospace', fontSize: 8, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(240,237,232,0.3)', textDecoration: 'none' }}
          >
            ‹ Volver al sitio
          </Link>
        </div>
      </div>
    </div>
  )
}
