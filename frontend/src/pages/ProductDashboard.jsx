import { useEffect, useMemo, useState } from 'react'
import '../styles/product-dashboard.css'

const API_BASE = import.meta.env.VITE_API_URL || 'https://sprintlens-lg19.onrender.com'

const viewLabels = {
  profile: '01 Workspace Profile',
  summary: '02 Sprint Pulse',
  board: '03 Sprint Board',
  ic: '04 Contributor Insights',
  manager: '05 Team Health',
}

const sprintBoard = [
  {
    title: 'Backlog',
    items: [
      { title: 'Refine API rate limits', owner: 'Backend', size: 'M' },
      { title: 'Finalize sprint goals', owner: 'Lead', size: 'S' },
      { title: 'Review workflow checklist', owner: 'QA', size: 'S' },
    ],
  },
  {
    title: 'In Progress',
    items: [
      { title: 'Implement PR review SLA', owner: 'Frontend', size: 'L' },
      { title: 'Reduce cycle time blockers', owner: 'Platform', size: 'M' },
    ],
  },
  {
    title: 'Review',
    items: [
      { title: 'Sprint retrospective notes', owner: 'Manager', size: 'S' },
      { title: 'Deployment checklist update', owner: 'DevOps', size: 'M' },
    ],
  },
  {
    title: 'Done',
    items: [
      { title: 'Release readiness audit', owner: 'QA', size: 'S' },
      { title: 'Bug triage cleanup', owner: 'Backend', size: 'S' },
    ],
  },
]

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
            <strong>SprintFlow</strong>
            <p>Agile sprint workspace</p>
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
            <span className="eyebrow">SprintFlow / {viewLabels[view]}</span>
            <h1>Agile delivery clarity and next steps.</h1>
            <p>
              Sprint pulse, contributor insights, and team health backed by MongoDB, JWT login, and action-focused recommendations.
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
              <span className="card-kicker">Workspace profile</span>
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

            <article className="feature-card">
              <span className="card-kicker">Sprint workflow stages</span>
              <ul className="insight-list">
                <li>Plan sprint scope and prioritize issues.</li>
                <li>Build and ship incremental work.</li>
                <li>Review PRs and unblock merges.</li>
                <li>Deploy and monitor quality signals.</li>
                <li>Capture retro actions for next sprint.</li>
              </ul>
            </article>
          </section>
        )}

        {view === 'summary' && (
          <section className="content-stack">
            <div className="section-head">
              <div>
                <span className="card-kicker">Sprint pulse</span>
                <h2>DORA signals by month</h2>
              </div>
              <p>Track delivery flow month over month and compare sprint health across periods.</p>
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

        {view === 'board' && (
          <section className="content-stack">
            <div className="section-head">
              <div>
                <span className="card-kicker">Sprint board</span>
                <h2>Active work by stage</h2>
              </div>
              <p>Lightweight, focused view of sprint execution aligned to contributor ownership.</p>
            </div>

            <div className="board-grid">
              {sprintBoard.map((column) => (
                <article key={column.title} className="board-column">
                  <div className="board-header">
                    <strong>{column.title}</strong>
                    <span>{column.items.length} items</span>
                  </div>
                  <div className="board-cards">
                    {column.items.map((item) => (
                      <div key={item.title} className="board-card">
                        <h4>{item.title}</h4>
                        <div className="board-meta">
                          <span>{item.owner}</span>
                          <span className="board-pill">{item.size}</span>
                        </div>
                      </div>
                    ))}
                  </div>
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
              <div className="content-stack">
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

                {developerMetrics.recommendations && (
                  <div className="recommendations-section">
                    <h3 className="section-title">Recommendations</h3>
                    <div className="recommendations-grid">
                      {developerMetrics.recommendations
                        .sort((a, b) => {
                          const priorityOrder = { high: 0, medium: 1, low: 2 };
                          return priorityOrder[a.priority] - priorityOrder[b.priority];
                        })
                        .map((rec, idx) => (
                          <article key={idx} className={`recommendation-card rec-${rec.status}`}>
                            <div className="rec-header">
                              <span className={`rec-status rec-status-${rec.status}`}>{rec.status.toUpperCase()}</span>
                              <span className="rec-priority">{rec.priority}</span>
                            </div>
                            <h4>{rec.title}</h4>
                            <p className="rec-value">Current: <strong>{rec.value}</strong> | Target: <strong>{rec.threshold}</strong></p>
                            <p className="rec-action">{rec.action}</p>
                          </article>
                        ))}
                    </div>
                  </div>
                )}
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
              <div className="content-stack">
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

                {managerMetrics.recommendations && (
                  <div className="recommendations-section">
                    <h3 className="section-title">Team Recommendations</h3>
                    <div className="recommendations-grid">
                      {managerMetrics.recommendations
                        .sort((a, b) => {
                          const priorityOrder = { high: 0, medium: 1, low: 2 };
                          return priorityOrder[a.priority] - priorityOrder[b.priority];
                        })
                        .map((rec, idx) => (
                          <article key={idx} className={`recommendation-card rec-${rec.status}`}>
                            <div className="rec-header">
                              <span className={`rec-status rec-status-${rec.status}`}>{rec.status.toUpperCase()}</span>
                              <span className="rec-priority">{rec.priority}</span>
                            </div>
                            <h4>{rec.title}</h4>
                            <p className="rec-value">Current: <strong>{rec.value}</strong> | Target: <strong>{rec.threshold}</strong></p>
                            <p className="rec-action">{rec.action}</p>
                          </article>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  )
}
