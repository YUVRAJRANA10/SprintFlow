import { useState, useEffect } from 'react';
import '../styles/dashboard.css';

export default function Dashboard() {
  const [view, setView] = useState('summary'); // 'summary', 'ic', 'manager'
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [developers, setDevelopers] = useState([]);
  const [selectedDev, setSelectedDev] = useState('');
  const [managers, setManagers] = useState([]);
  const [selectedMgr, setSelectedMgr] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchMonths();
    if (view === 'ic') fetchDevelopers();
    if (view === 'manager') fetchManagers();
  }, [view]);

  const fetchMonths = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/metrics/months', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const months = await res.json();
      setMonths(months);
      if (months.length) setSelectedMonth(months[months.length - 1]);
    } catch (err) {
      setError('Failed to fetch months');
    }
  };

  const fetchDevelopers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/metrics/developers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const devs = await res.json();
      setDevelopers(devs);
      if (devs.length) setSelectedDev(devs[0].developer_id);
    } catch (err) {
      setError('Failed to fetch developers');
    }
  };

  const fetchManagers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/metrics/developers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const devs = await res.json();
      const uniqueMgrs = [...new Map(devs.map(d => [d.manager_id, { id: d.manager_id, name: d.manager_name }])).values()];
      setManagers(uniqueMgrs);
      if (uniqueMgrs.length) setSelectedMgr(uniqueMgrs[0].id);
    } catch (err) {
      setError('Failed to fetch managers');
    }
  };

  const fetchSummary = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/metrics/summary', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const summary = await res.json();
      setData(summary);
    } catch (err) {
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchICMetrics = async () => {
    if (!selectedDev) return;
    setLoading(true);
    setError('');
    try {
      const url = `http://localhost:5000/api/metrics/developers/${selectedDev}?month=${selectedMonth}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const metrics = await res.json();
      setData(metrics);
    } catch (err) {
      setError('Failed to fetch IC metrics');
    } finally {
      setLoading(false);
    }
  };

  const fetchManagerMetrics = async () => {
    if (!selectedMgr) return;
    setLoading(true);
    setError('');
    try {
      const url = `http://localhost:5000/api/metrics/managers/${selectedMgr}/metrics?month=${selectedMonth}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const metrics = await res.json();
      setData(metrics);
    } catch (err) {
      setError('Failed to fetch manager metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (view === 'summary' && selectedMonth) fetchSummary();
    if (view === 'ic' && selectedDev && selectedMonth) fetchICMetrics();
    if (view === 'manager' && selectedMgr && selectedMonth) fetchManagerMetrics();
  }, [selectedMonth, selectedDev, selectedMgr, view]);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>📊 Developer Productivity Dashboard</h1>
        <button onClick={() => {
          localStorage.removeItem('token');
          window.location.reload();
        }} className="logout-btn">Logout</button>
      </header>

      <div className="dashboard-container">
        {/* View Selector */}
        <div className="view-selector">
          <button 
            className={view === 'summary' ? 'active' : ''}
            onClick={() => setView('summary')}
          >
            📈 Summary
          </button>
          <button 
            className={view === 'ic' ? 'active' : ''}
            onClick={() => setView('ic')}
          >
            👤 Individual Contributor
          </button>
          <button 
            className={view === 'manager' ? 'active' : ''}
            onClick={() => setView('manager')}
          >
            👥 Manager
          </button>
        </div>

        {/* Filters */}
        <div className="filters">
          <div className="filter-group">
            <label>Month:</label>
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
              {months.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          {view === 'ic' && (
            <div className="filter-group">
              <label>Developer:</label>
              <select value={selectedDev} onChange={(e) => setSelectedDev(e.target.value)}>
                {developers.map(d => (
                  <option key={d.developer_id} value={d.developer_id}>
                    {d.developer_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {view === 'manager' && (
            <div className="filter-group">
              <label>Manager:</label>
              <select value={selectedMgr} onChange={(e) => setSelectedMgr(e.target.value)}>
                {managers.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Error */}
        {error && <div className="error-message">{error}</div>}

        {/* Loading */}
        {loading && <div className="loading">Loading...</div>}

        {/* Content */}
        {!loading && data && (
          <div className="content">
            {view === 'summary' && <SummaryView data={data} />}
            {view === 'ic' && <ICView data={data} />}
            {view === 'manager' && <ManagerView data={data} />}
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryView({ data }) {
  return (
    <div className="summary-view">
      <h2>📊 DORA Metrics Summary</h2>
      <div className="metrics-grid">
        {data.map((month, idx) => (
          <div key={idx} className="month-card">
            <h3>{month.month}</h3>
            <div className="metric">
              <span className="label">Lead Time</span>
              <span className="value">{month.lead_time.toFixed(1)} days</span>
            </div>
            <div className="metric">
              <span className="label">Cycle Time</span>
              <span className="value">{month.cycle_time.toFixed(1)} days</span>
            </div>
            <div className="metric">
              <span className="label">Deployment Frequency</span>
              <span className="value">{month.deployment_frequency} deploys</span>
            </div>
            <div className="metric">
              <span className="label">PR Throughput</span>
              <span className="value">{month.pr_throughput} PRs</span>
            </div>
            <div className="metric">
              <span className="label">Bug Rate</span>
              <span className="value">{(month.bug_rate * 100).toFixed(2)}%</span>
            </div>
            <div className="metric">
              <span className="label">Issues Completed</span>
              <span className="value">{month.issues_completed}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ICView({ data }) {
  if (!data.metrics) return <div>No data</div>;
  return (
    <div className="ic-view">
      <h2>👤 Individual Metrics</h2>
      <div className="dev-header">
        <h3>{data.developer_name}</h3>
        <p className="team-info">{data.team_name} • {data.level}</p>
        <p className="manager-info">Manager: {data.manager_name}</p>
      </div>
      <div className="metrics-card">
        <div className="metric-row">
          <span className="label">Month:</span>
          <span className="value">{data.month}</span>
        </div>
        <div className="metric-row">
          <span className="label">Cycle Time</span>
          <span className="value">{data.metrics.cycle_time} days</span>
        </div>
        <div className="metric-row">
          <span className="label">PR Throughput</span>
          <span className="value">{data.metrics.pr_throughput} PRs</span>
        </div>
        <div className="metric-row">
          <span className="label">PR Review Wait Time</span>
          <span className="value">{data.metrics.pr_review_wait.toFixed(1)} hours</span>
        </div>
        <div className="metric-row">
          <span className="label">Escaped Bugs</span>
          <span className="value">{data.metrics.escaped_bugs}</span>
        </div>
        <div className="metric-row">
          <span className="label">Issues Completed</span>
          <span className="value">{data.metrics.issues_completed}</span>
        </div>
      </div>
    </div>
  );
}

function ManagerView({ data }) {
  if (!data.metrics) return <div>No data</div>;
  return (
    <div className="manager-view">
      <h2>👥 Team Metrics</h2>
      <div className="team-header">
        <h3>{data.manager_name}</h3>
        <p className="team-size">Team Size: {data.team_size} developers</p>
        <div className="team-members">
          {data.team_members.map((member, idx) => (
            <span key={idx} className="member-badge">{member}</span>
          ))}
        </div>
      </div>
      <div className="metrics-card">
        <div className="metric-row">
          <span className="label">Month:</span>
          <span className="value">{data.month}</span>
        </div>
        <div className="metric-row">
          <span className="label">Avg Cycle Time</span>
          <span className="value">{data.metrics.avg_cycle_time} days</span>
        </div>
        <div className="metric-row">
          <span className="label">Avg Lead Time</span>
          <span className="value">{data.metrics.avg_lead_time} days</span>
        </div>
        <div className="metric-row">
          <span className="label">Deployment Frequency</span>
          <span className="value">{data.metrics.deployment_frequency} deploys</span>
        </div>
        <div className="metric-row">
          <span className="label">PR Throughput</span>
          <span className="value">{data.metrics.pr_throughput} PRs</span>
        </div>
        <div className="metric-row">
          <span className="label">Bug Rate</span>
          <span className="value">{(data.metrics.bug_rate * 100).toFixed(2)}%</span>
        </div>
        <div className="metric-row">
          <span className="label">Issues Completed</span>
          <span className="value">{data.metrics.issues_completed}</span>
        </div>
      </div>
    </div>
  );
}
