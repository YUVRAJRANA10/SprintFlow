import { useEffect, useMemo, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || 'https://sprintlens-lg19.onrender.com'

const emptyAuth = {
  name: '',
  email: '',
  password: '',
}

const emptyTask = {
  title: '',
  description: '',
  priority: 'medium',
}

function App() {
  const [mode, setMode] = useState('login')
  const [authForm, setAuthForm] = useState(emptyAuth)
  const [taskForm, setTaskForm] = useState(emptyTask)
  const [token, setToken] = useState(() => localStorage.getItem('sprintlens_token') || '')
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sprintlens_user')
    return saved ? JSON.parse(saved) : null
  })
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const isAuthed = Boolean(token)

  const taskSummary = useMemo(() => {
    const total = tasks.length
    const done = tasks.filter((task) => task.status === 'done').length
    const open = total - done

    return { total, done, open }
  }, [tasks])

  useEffect(() => {
    if (token) {
      fetchTasks(token)
    }
  }, [token])

  async function request(path, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new Error(data.message || 'Request failed')
    }

    return data
  }

  async function fetchTasks(activeToken = token) {
    if (!activeToken) return

    try {
      setLoading(true)
      const response = await fetch(`${API_BASE}/api/tasks`, {
        headers: {
          Authorization: `Bearer ${activeToken}`,
        },
      })

      const data = await response.json().catch(() => [])

      if (!response.ok) {
        throw new Error(data.message || 'Unable to load tasks')
      }

      setTasks(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleAuthSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('')

    const endpoint = mode === 'register' ? '/api/auth/register' : '/api/auth/login'
    const payload =
      mode === 'register'
        ? authForm
        : { email: authForm.email, password: authForm.password }

    try {
      setLoading(true)
      const data = await request(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload),
      })

      setToken(data.token)
      setUser(data.user || { email: authForm.email, name: authForm.name || authForm.email })
      localStorage.setItem('sprintlens_token', data.token)
      localStorage.setItem('sprintlens_user', JSON.stringify(data.user || {}))
      setMessage(mode === 'register' ? 'Account created.' : 'Logged in.')
      setAuthForm(emptyAuth)
      await fetchTasks(data.token)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleTaskSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('')

    try {
      setLoading(true)
      await request('/api/tasks', {
        method: 'POST',
        body: JSON.stringify(taskForm),
      })

      setTaskForm(emptyTask)
      setMessage('Task saved.')
      await fetchTasks()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function updateTaskStatus(taskId, status) {
    try {
      await request(`/api/tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      })

      await fetchTasks()
    } catch (err) {
      setError(err.message)
    }
  }

  async function removeTask(taskId) {
    try {
      await request(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      })

      await fetchTasks()
    } catch (err) {
      setError(err.message)
    }
  }

  function handleLogout() {
    localStorage.removeItem('sprintlens_token')
    localStorage.removeItem('sprintlens_user')
    setToken('')
    setUser(null)
    setTasks([])
    setMessage('Logged out.')
    setError('')
  }

  return (
    <div className="page-shell">
      <div className="glow glow-a" />
      <div className="glow glow-b" />

      <main className="dashboard">
        <section className="hero-card">
          <div className="hero-copy">
            <span className="eyebrow">SprintLens workspace</span>
            <h1>Simple auth, tasks, and profile in one place.</h1>
            <p>
              This is the minimal frontend for your current backend: register, login,
              logout, profile, and task CRUD.
            </p>
          </div>

          <div className="hero-panel">
            <div>
              <span className="panel-label">Backend status</span>
              <strong>{isAuthed ? 'Authenticated session' : 'Ready to sign in'}</strong>
            </div>
            <div className="hero-stats">
              <div>
                <span>Profile</span>
                <strong>{user?.name || user?.email || 'Not signed in'}</strong>
              </div>
              <div>
                <span>Open tasks</span>
                <strong>{isAuthed ? taskSummary.open : 'Sign in first'}</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="content-grid auth-grid">
          <article className="story-card auth-card">
            <div className="auth-tabs">
              <button className={mode === 'login' ? 'tab active' : 'tab'} onClick={() => setMode('login')} type="button">
                Login
              </button>
              <button className={mode === 'register' ? 'tab active' : 'tab'} onClick={() => setMode('register')} type="button">
                Register
              </button>
            </div>

            <form className="form-stack" onSubmit={handleAuthSubmit}>
              {mode === 'register' && (
                <label>
                  Name
                  <input
                    type="text"
                    value={authForm.name}
                    onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                    placeholder="Your name"
                  />
                </label>
              )}
              <label>
                Email
                <input
                  type="email"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  placeholder="name@example.com"
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  placeholder="••••••••"
                />
              </label>
              <button className="primary-btn" type="submit" disabled={loading}>
                {loading ? 'Working...' : mode === 'register' ? 'Create account' : 'Login'}
              </button>
            </form>

            <p className="helper-copy">
              Use the same backend you already built. JWT and task access will update
              immediately after login.
            </p>
          </article>

          <article className="story-card auth-card">
            <div className="section-head compact">
              <div>
                <span className="eyebrow">Session</span>
                <h2>{isAuthed ? 'Profile and tasks' : 'Sign in to see your workspace'}</h2>
              </div>
            </div>

            {isAuthed ? (
              <>
                <div className="profile-box">
                  <div>
                    <span className="mini-label">Name</span>
                    <strong>{user?.name || 'User'}</strong>
                  </div>
                  <div>
                    <span className="mini-label">Email</span>
                    <strong>{user?.email || 'Not available'}</strong>
                  </div>
                  <div>
                    <span className="mini-label">Role</span>
                    <strong>{user?.role || 'user'}</strong>
                  </div>
                </div>

                <button className="secondary-btn" type="button" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <p className="helper-copy">
                Register a new account or log in with your existing one to continue.
              </p>
            )}
          </article>
        </section>

        {message && <div className="notice success">{message}</div>}
        {error && <div className="notice error">{error}</div>}

        {isAuthed && (
          <>
            <section className="metrics-grid compact-metrics">
              <article className="metric-card good">
                <span className="metric-label">Total tasks</span>
                <strong className="metric-value">{taskSummary.total}</strong>
                <span className="metric-change">All tasks loaded from the backend</span>
              </article>
              <article className="metric-card good">
                <span className="metric-label">Open tasks</span>
                <strong className="metric-value">{taskSummary.open}</strong>
                <span className="metric-change">Tasks still in progress or todo</span>
              </article>
              <article className="metric-card warn">
                <span className="metric-label">Completed</span>
                <strong className="metric-value">{taskSummary.done}</strong>
                <span className="metric-change">Tasks marked as done</span>
              </article>
            </section>

            <section className="content-grid">
              <article className="story-card alt">
                <span className="eyebrow">Create task</span>
                <form className="form-stack" onSubmit={handleTaskSubmit}>
                  <label>
                    Title
                    <input
                      type="text"
                      value={taskForm.title}
                      onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                      placeholder="Task title"
                    />
                  </label>
                  <label>
                    Description
                    <textarea
                      value={taskForm.description}
                      onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                      placeholder="What should be done?"
                      rows="4"
                    />
                  </label>
                  <label>
                    Priority
                    <select
                      value={taskForm.priority}
                      onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </label>
                  <button className="primary-btn" type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save task'}
                  </button>
                </form>
              </article>

              <article className="story-card">
                <span className="eyebrow">Workspace tasks</span>
                <div className="task-list">
                  {loading && !tasks.length ? (
                    <p className="helper-copy">Loading tasks...</p>
                  ) : tasks.length ? (
                    tasks.map((task) => (
                      <div className="task-item" key={task._id}>
                        <div className="task-main">
                          <strong>{task.title}</strong>
                          <p>{task.description || 'No description added.'}</p>
                          <div className="task-meta">
                            <span>{task.priority}</span>
                            <span>{task.status}</span>
                          </div>
                        </div>
                        <div className="task-actions">
                          <button type="button" onClick={() => updateTaskStatus(task._id, 'todo')}>Todo</button>
                          <button type="button" onClick={() => updateTaskStatus(task._id, 'in-progress')}>Doing</button>
                          <button type="button" onClick={() => updateTaskStatus(task._id, 'done')}>Done</button>
                          <button type="button" className="danger-btn" onClick={() => removeTask(task._id)}>Delete</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="helper-copy">No tasks yet. Create one to test the backend flow.</p>
                  )}
                </div>
              </article>
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export default App
