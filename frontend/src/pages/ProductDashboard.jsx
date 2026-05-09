import { useEffect, useMemo, useState } from 'react'
import '../styles/product-dashboard.css'

const API_BASE = import.meta.env.VITE_API_URL || 'https://sprintlens-lg19.onrender.com'

const viewLabels = {
  profile: '01 My Profile',
  summary: '02 Monthly Summary',
  ic: '03 Individual View',
  manager: '04 Team View',
}

function fetchJSON(path, token) {
  return fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(async (response) => {
    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      throw new Error(data.error || data.message || `HTTP ${response.status}`)
    }
    return data
  })
}

export default function ProductDashboard({ currentUser, onLogout, token }) {
  const [view, setView] = useState('profile')
  const [months, setMonths] = useState([])
  const [selectedMonth, setSelectedMonth] = useState('')
  const [summary, setSummary] = useState([])
  const [profile, setProfile] = useState(null)
  const [developers, setDevelopers] = useState([])
  const [selectedDeveloper, setSelectedDeveloper] = useState('')
  const [managerOptions, setManagerOptions] = useState([])
  const [selectedManager, setSelectedManager] = useState('')
  const [developerMetrics, setDeveloperMetrics] = useState(null)
  const [managerMetrics, setManagerMetrics] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const currentDeveloperId = currentUser?.developer_id || ''

  const latestMonth = useMemo(() => months[months.length - 1] || '', [months])

  useEffect(() => {
    let active = true

    async function loadShellData() {
      try {
        const [monthsData, developerData] = await Promise.all([
          fetchJSON('/api/metrics/months', token),
          fetchJSON('/api/metrics/developers', token),
        ])

        if (!active) return

        setMonths(monthsData)
        setSelectedMonth((current) => current || monthsData[monthsData.length - 1] || '')
        setDevelopers(developerData)
        setSelectedDeveloper((current) => current || currentDeveloperId || developerData[0]?.developer_id || '')
        const uniqueManagers = Array.from(
          new Map(
            developerData
              .filter((developer) => developer.manager_id)
              .map((developer) => [developer.manager_id, { id: developer.manager_id, name: developer.manager_name }])
          ).values()
        )
        setManagerOptions(uniqueManagers)
        setSelectedManager((current) => current || uniqueManagers[0]?.id || '')
      } catch (err) {
        if (!active) return
        setError(err.message)
      }
    }

    loadShellData()
    return () => {
      active = false
    }
  }, [token, currentDeveloperId])

  useEffect(() => {
    if (!selectedMonth) return

    let active = true
    setLoading(true)
    setError('')

    async function loadPrimaryData() {
      try {
        if (view === 'profile') {
          const data = await fetchJSON(`/api/metrics/me?month=${selectedMonth}`, token)
          if (!active) return
          setProfile(data)
        }

        if (view === 'summary') {
          const data = await fetchJSON('/api/metrics/summary', token)
          if (!active) return
          setSummary(data)
        }

        if (view === 'ic' && selectedDeveloper) {
          const data = await fetchJSON(`/api/metrics/developers/${selectedDeveloper}?month=${selectedMonth}`, token)
          if (!active) return
          setDeveloperMetrics(data)
        }

        if (view === 'manager' && selectedManager) {
          const data = await fetchJSON(`/api/metrics/managers/${selectedManager}/metrics?month=${selectedMonth}`, token)
          if (!active) return
          setManagerMetrics(data)
        }
      } catch (err) {
        if (!active) return
        setError(err.message)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadPrimaryData()
    return () => {
      active = false
    }
  }, [view, selectedMonth, selectedDeveloper, selectedManager, token])

  const profileData = profile || {
    user: currentUser,
    month: selectedMonth || latestMonth || 'all-time',
    metrics: null,
  }

  return (
    <div className="product-shell">
      <aside className="product-sidebar">
        <div className="brand-block">
          <span className="brand-mark" />
          <div>
            <strong>SprintLens</strong>
            <p>Developer productivity platform</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {Object.entries(viewLabels).map(([key, label]) => (
            <button
              key={key}
              className={view === key ? 'sidebar-link active' : 'sidebar-link'}
              onClick={() => setView(key)}
              type="button"
            >
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-panel">
          <span className="sidebar-kicker">Logged in as</span>
          <strong>{currentUser?.name || currentUser?.email || 'Developer'}</strong>
          <p>{currentUser?.role || 'developer'}</p>
          <button className="logout-link" type="button" onClick={onLogout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="product-main">
        <header className="product-topbar">
          <div>
            <span className="eyebrow">SprintLens / {viewLabels[view]}</span>
            <h1>From raw metrics to clear developer actions.</h1>
            <p>
              Seeded industry-style data, MongoDB persistence, JWT login, and a profile-first view for the signed-in developer.
            </p>
          </div>

          <div className="topbar-controls">
            <label>
              Month
              <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </header>

        {error && <div className="banner error">{error}</div>}
        {loading && <div className="banner loading">Loading data...</div>}

        {view === 'profile' && (
          <section className="feature-grid">
            <article className="feature-card hero">
              <span className="card-kicker">My Profile</span>
              <h2>{profileData.user?.name || 'Developer profile'}</h2>
              <p>
                {profileData.user?.developer_id ? `Developer ID ${profileData.user.developer_id}` : 'Linked developer profile from the seeded user account.'}
              </p>
              <div className="profile-meta">
                <div>
                  <span>Team</span>
                  <strong>{profileData.team_name || 'TBD'}</strong>
                </div>
                <div>
                  <span>Manager</span>
                  <strong>{profileData.manager_name || 'TBD'}</strong>
                </div>
                <div>
                  <span>Level</span>
                  <strong>{profileData.level || 'TBD'}</strong>
                </div>
                <div>
                  <span>Month</span>
                  <strong>{profileData.month}</strong>
                </div>
              </div>
            </article>

            <article className="feature-card">
              <span className="card-kicker">Why this matters</span>
              <ul className="insight-list">
                <li>Lead time and cycle time show delivery speed.</li>
                <li>PR throughput and deployment frequency show flow.</li>
                <li>Bug rate highlights quality and production risk.</li>
              </ul>
            </article>

            <article className="feature-card compact">
              <span className="card-kicker">Data model</span>
              <div className="collection-list">
                <span>developers</span>
                <span>jiraissues</span>
                <span>pullrequests</span>
                <span>deployments</span>
                <span>bugreports</span>
              </div>
            </article>
          </section>
        )}

        {view === 'summary' && (
          <section className="content-stack">
            <div className="section-head">
              <div>
                <span className="card-kicker">Monthly summary</span>
                <h2>DORA metrics by month</h2>
              </div>
              <p>Simple thresholds and concise explanations can sit on top later. The raw data is already real and queryable.</p>
            </div>

            <div className="summary-grid">
              {summary.map((month) => (
                <article key={month.month} className="summary-card">
                  <strong>{month.month}</strong>
                  <div><span>Lead time</span><b>{month.lead_time.toFixed(1)}d</b></div>
                  <div><span>Cycle time</span><b>{month.cycle_time.toFixed(1)}d</b></div>
                  <div><span>Deploys</span><b>{month.deployment_frequency}</b></div>
                  <div><span>PRs</span><b>{month.pr_throughput}</b></div>
                  <div><span>Bug rate</span><b>{(month.bug_rate * 100).toFixed(2)}%</b></div>
                </article>
              ))}
            </div>
          </section>
        )}

        {view === 'ic' && (
          <section className="content-stack">
            <div className="section-head">
              <div>
                <span className="card-kicker">Individual view</span>
                <h2>Developer-specific metrics</h2>
              </div>
              <label>
                Developer
                <select value={selectedDeveloper} onChange={(e) => setSelectedDeveloper(e.target.value)}>
                  {developers.map((developer) => (
                    <option key={developer.developer_id} value={developer.developer_id}>
                      {developer.developer_name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {developerMetrics && (
              <div className="metrics-grid">
                <article className="metric-card">
                  <span>Cycle time</span>
                  <strong>{developerMetrics.metrics.cycle_time} days</strong>
                </article>
                <article className="metric-card">
                  <span>PR throughput</span>
                  <strong>{developerMetrics.metrics.pr_throughput}</strong>
                </article>
                <article className="metric-card">
                  <span>Review wait</span>
                  <strong>{developerMetrics.metrics.pr_review_wait} hrs</strong>
                </article>
                <article className="metric-card">
                  <span>Escaped bugs</span>
                  <strong>{developerMetrics.metrics.escaped_bugs}</strong>
                </article>
              </div>
            )}
          </section>
        )}

        {view === 'manager' && (
          <section className="content-stack">
            <div className="section-head">
              <div>
                <span className="card-kicker">Team view</span>
                <h2>Manager-level aggregation</h2>
              </div>
              <label>
                Manager
                <select value={selectedManager} onChange={(e) => setSelectedManager(e.target.value)}>
                  {managerOptions.map((manager) => (
                    <option key={manager.id} value={manager.id}>
                      {manager.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {managerMetrics && (
              <div className="metrics-grid">
                <article className="metric-card">
                  <span>Team size</span>
                  <strong>{managerMetrics.team_size}</strong>
                </article>
                <article className="metric-card">
                  <span>Avg cycle time</span>
                  <strong>{managerMetrics.metrics.avg_cycle_time} days</strong>
                </article>
                <article className="metric-card">
                  <span>Avg lead time</span>
                  <strong>{managerMetrics.metrics.avg_lead_time} days</strong>
                </article>
                <article className="metric-card">
                  <span>Bug rate</span>
                  <strong>{(managerMetrics.metrics.bug_rate * 100).toFixed(2)}%</strong>
                </article>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  )
}
