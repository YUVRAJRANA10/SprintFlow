const metricCards = [
  {
    label: 'Lead Time for Changes',
    value: '2.4 days',
    change: '-0.6 days vs last month',
    tone: 'good',
    note: 'Average time from PR opened to successful production deployment.',
  },
  {
    label: 'Cycle Time',
    value: '1.8 days',
    change: '-0.4 days vs last month',
    tone: 'good',
    note: 'Average time from in-progress to done for active work items.',
  },
  {
    label: 'Bug Rate',
    value: '4.1%',
    change: '-1.2% vs last month',
    tone: 'good',
    note: 'Escaped production bugs divided by issues completed in the month.',
  },
  {
    label: 'Deployment Frequency',
    value: '12',
    change: '3 more deployments this month',
    tone: 'warn',
    note: 'Count of successful production deployments in the month.',
  },
  {
    label: 'PR Throughput',
    value: '28',
    change: '+6 merged PRs vs last month',
    tone: 'good',
    note: 'Count of merged pull requests in the month.',
  },
]

const nextSteps = [
  'Reduce time in review by batching small PRs and using a clearer reviewer rotation.',
  'Pair deployment spikes with a release checklist to keep bug rate from climbing.',
  'Focus one IC on high-leverage work so cycle time keeps improving without losing throughput.',
]

const sourceMap = [
  'Developer dimension table for team member / role context',
  'Issue table for work item lifecycle and timestamps',
  'PR table for merge throughput and review timing',
  'Deployment table for release cadence and lead time',
  'Bug table for escaped defect tracking and quality signal',
]

function App() {
  return (
    <div className="page-shell">
      <div className="glow glow-a" />
      <div className="glow glow-b" />

      <main className="dashboard">
        <section className="hero-card">
          <div className="hero-copy">
            <span className="eyebrow">Developer Productivity MVP</span>
            <h1>SprintLens turns raw delivery data into a clear story.</h1>
            <p>
              A focused individual-contributor view that explains what the metrics mean,
              what is improving, and what to do next.
            </p>
          </div>

          <div className="hero-panel">
            <div>
              <span className="panel-label">Focus journey</span>
              <strong>IC workflow interpretation</strong>
            </div>
            <div className="hero-stats">
              <div>
                <span>Current state</span>
                <strong>Healthy, improving</strong>
              </div>
              <div>
                <span>Action focus</span>
                <strong>Review speed + release quality</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="section-head">
          <div>
            <span className="eyebrow">Core metrics</span>
            <h2>One screen, five signals, one interpretation.</h2>
          </div>
          <p>
            These are simplified from the assignment workbook so the MVP stays explainable
            and interview-ready.
          </p>
        </section>

        <section className="metrics-grid">
          {metricCards.map((metric) => (
            <article className={`metric-card ${metric.tone}`} key={metric.label}>
              <span className="metric-label">{metric.label}</span>
              <strong className="metric-value">{metric.value}</strong>
              <span className="metric-change">{metric.change}</span>
              <p>{metric.note}</p>
            </article>
          ))}
        </section>

        <section className="content-grid">
          <article className="story-card">
            <span className="eyebrow">What the story says</span>
            <h3>The team is shipping more often, but review speed is the next bottleneck.</h3>
            <p>
              The signal pattern suggests a team that is already delivering steadily and is
              now close to an efficiency ceiling. The strongest next move is to shorten the
              path between PR open and merge, because that reduces lead time without
              compromising release quality.
            </p>
          </article>

          <article className="story-card alt">
            <span className="eyebrow">Recommended next steps</span>
            <ul className="step-list">
              {nextSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </article>
        </section>

        <section className="source-card">
          <div className="section-head compact">
            <div>
              <span className="eyebrow">Source data mapped</span>
              <h2>Small, believable backend shape.</h2>
            </div>
            <p>
              The workbook source tables can be mapped to a simple backend or mock API later,
              but this MVP already shows the product logic.
            </p>
          </div>

          <div className="source-list">
            {sourceMap.map((source) => (
              <div className="source-item" key={source}>
                {source}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
