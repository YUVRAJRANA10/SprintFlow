import { useState, useEffect } from 'react'
import './styles.css'
import ProductDashboard from './pages/ProductDashboard'

const API_BASE = import.meta.env.VITE_API_URL || 'https://sprintlens-lg19.onrender.com'

function App() {
  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState(() => localStorage.getItem('token') || '')
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sprintlens_user')
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

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      return await response.json()
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
        body: JSON.stringify({ username, email, password }),
      })

      if (result.token) {
        setToken(result.token)
        setUser(result.user)
        localStorage.setItem('sprintlens_user', JSON.stringify(result.user))
        setMessage('Registration successful!')
        setUsername('')
        setEmail('')
        setPassword('')
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
        localStorage.setItem('sprintlens_user', JSON.stringify(result.user))
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
    localStorage.removeItem('sprintlens_user')
    setUsername('')
    setEmail('')
    setPassword('')
    setMode('login')
  }

  if (isAuthed) {
    return <ProductDashboard currentUser={user} onLogout={handleLogout} token={token} />
  }

  return (
    <div className="app">
      <div className="auth-container">
        <div className="auth-card">
          <h1>🚀 SprintLens</h1>
          <p className="subtitle">Developer Productivity Dashboard</p>

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
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
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
