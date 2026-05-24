import { useState, useEffect } from 'react'
import './styles.css'
import ProductDashboard from './pages/ProductDashboard'

const API_BASE = import.meta.env.VITE_API_URL || 'https://sprintlens-lg19.onrender.com'

function App() {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [developerId, setDeveloperId] = useState('')
  const [role, setRole] = useState('developer')
  const [token, setToken] = useState(() => localStorage.getItem('token') || '')
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sprintflow_user')
    return saved ? JSON.parse(saved) : null
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const isAuthed = Boolean(token)

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
    }
  }, [token])

  async function request(path, options = {}) {
    try {
      const response = await fetch(`${API_BASE}${path}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(options.headers || {}),
        },
        ...options,
      })

      const payload = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(payload.message || payload.error || `HTTP ${response.status}`)
      }

      return payload
    } catch (err) {
      throw new Error(err.message || 'Request failed')
    }
  }

  async function handleRegister(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const result = await request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          password,
          developer_id: developerId || undefined,
          role,
        }),
      })

      if (result.token) {
        setToken(result.token)
        setUser(result.user)
        localStorage.setItem('sprintflow_user', JSON.stringify(result.user))
        setMessage('Registration successful!')
        setName('')
        setEmail('')
        setPassword('')
        setDeveloperId('')
        setRole('developer')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const result = await request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })

      if (result.token) {
        setToken(result.token)
        setUser(result.user)
        localStorage.setItem('sprintflow_user', JSON.stringify(result.user))
        setMessage('Login successful!')
        setEmail('')
        setPassword('')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    setToken('')
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('sprintflow_user')
    setName('')
    setEmail('')
    setPassword('')
    setDeveloperId('')
    setRole('developer')
    setMode('login')
  }

  if (isAuthed) {
    return <ProductDashboard currentUser={user} onLogout={handleLogout} token={token} />
  }

  return (
    <div className="app">
      <div className="auth-container">
        <div className="auth-card">
          <h1>🚀 SprintFlow</h1>
          <p className="subtitle">Agile Sprint Workspace</p>

          {error && <div className="error">{error}</div>}
          {message && <div className="success">{message}</div>}

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="auth-form">
              <h2>Login</h2>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
              <p className="toggle-mode">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register')
                    setError('')
                    setMessage('')
                  }}
                  className="link-button"
                >
                  Register
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="auth-form">
              <h2>Register</h2>
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label className="select-label">
                Seeded Developer ID (demo)
                <select value={developerId} onChange={(e) => setDeveloperId(e.target.value)}>
                  <option value="">Select a developer ID</option>
                  <option value="DEV-001">DEV-001 — Alice Johnson</option>
                  <option value="DEV-002">DEV-002 — Bob Smith</option>
                  <option value="DEV-003">DEV-003 — Carol Davis</option>
                  <option value="DEV-004">DEV-004 — David Brown</option>
                  <option value="DEV-005">DEV-005 — Emma Wilson</option>
                  <option value="DEV-006">DEV-006 — Frank Miller</option>
                  <option value="DEV-007">DEV-007 — Grace Taylor</option>
                  <option value="DEV-008">DEV-008 — Henry Martinez</option>
                </select>
              </label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="developer">Developer</option>
                <option value="manager">Manager</option>
                <option value="user">Observer</option>
              </select>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="helper-text">
                Metrics are linked to seeded developer IDs. Use a demo account for full data or enter a valid ID.
              </p>
              <button type="submit" disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </button>
              <p className="toggle-mode">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login')
                    setError('')
                    setMessage('')
                  }}
                  className="link-button"
                >
                  Login
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
