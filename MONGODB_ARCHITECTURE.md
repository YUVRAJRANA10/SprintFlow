# MongoDB Data Architecture

This document explains the transition from hardcoded mock data to MongoDB-backed persistence.

## Architecture Overview

**Before**: Mock data hardcoded in frontend  
**Now**: MongoDB → Backend API → Frontend Dashboard

### Data Model

#### Collections

1. **Developers** (Dim_Developers)
   - `developer_id`: Unique identifier (DEV-001, etc.)
   - `developer_name`: Full name
   - `manager_id`, `manager_name`: Management relationship
   - `team_name`: Team assignment
   - `service_type`: Backend/Frontend/Mobile
   - `level`: Senior/Mid/Junior

2. **JiraIssues** (Fact_Jira_Issues)
   - `issue_id`: Unique issue identifier
   - `developer_id`: Assigned developer
   - `cycle_time_days`: Days from creation to done
   - `month_done`: Month completed (YYYY-MM)
   - `created_at`, `in_progress_at`, `done_at`: Timestamps

3. **PullRequests** (Fact_Pull_Requests)
   - `pr_id`: Unique PR identifier
   - `developer_id`: Author
   - `review_wait_hours`: Time waiting for review
   - `merge_time_hours`: Time from first review to merge
   - `lines_changed`, `review_rounds`: Code metrics
   - `month_merged`: Month merged (YYYY-MM)

4. **Deployments** (Fact_CI_Deployments)
   - `deployment_id`: Unique deployment ID
   - `lead_time_days`: Days from commit to production
   - `month_deployed`: Month deployed (YYYY-MM)
   - `environment`: production/staging
   - `status`: success/failed

5. **BugReports** (Fact_Bug_Reports)
   - `bug_id`: Unique bug identifier
   - `developer_id`: Who introduced the bug
   - `escaped_to_prod`: Boolean - did it reach production?
   - `severity`: critical/high/medium/low
   - `month_found`: Month discovered (YYYY-MM)

## Backend API Endpoints

All endpoints require JWT authentication (Bearer token in Authorization header).

### Developer Endpoints

```bash
# List all developers
GET /api/metrics/developers

# Get IC metrics for a developer (for a specific month)
GET /api/metrics/developers/:id?month=2026-03
Response: {
  developer_id, developer_name, manager_name, team_name,
  month, metrics: {
    cycle_time, pr_throughput, pr_review_wait,
    escaped_bugs, issues_completed
  }
}
```

### Manager Endpoints

```bash
# Get team metrics (manager view)
GET /api/metrics/managers/:manager_id/metrics?month=2026-03
Response: {
  manager_id, manager_name, team_size, month,
  metrics: {
    avg_cycle_time, avg_lead_time, deployment_frequency,
    bug_rate, pr_throughput, issues_completed
  },
  team_members: [...]
}
```

### Dashboard Endpoints

```bash
# Get DORA metrics by month (for dashboard charts)
GET /api/metrics/summary
Response: [
  {
    month: "2026-03",
    lead_time, cycle_time, deployment_frequency,
    pr_throughput, bug_rate, issues_completed
  }, ...
]

# Get available months for filtering
GET /api/metrics/months
Response: ["2026-03", "2026-04", ...]
```

## Seeding Data

### Local Development

1. Ensure MongoDB is running locally:
   ```bash
   # macOS with Homebrew
   brew services start mongodb-community
   
   # Or Docker
   docker run -d -p 27017:27017 mongo
   ```

2. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Create `.env` file:
   ```
   MONGODB_URI=mongodb://localhost:27017/sprintlens
   JWT_SECRET=your_secret_key
   PORT=5000
   ```

4. Run seed script:
   ```bash
   npm run seed
   ```

   Output:
   ```
   🔗 Connecting to MongoDB...
   ✅ Connected to MongoDB
   🗑️  Clearing existing collections...
   ✅ Collections cleared
   👤 Inserting developers...
   ✅ Inserted 8 developers
   ...
   ✨ Database seeded successfully!
   ```

### Production Deployment (Render)

1. MongoDB URI is already set in Render environment variables
2. Deploy code:
   ```bash
   git push origin main
   ```
3. After deployment, run seed in Render dashboard:
   - Connect to Render shell
   - Run: `npm run seed`
   - Or trigger via manual deployment with seed in startup script

## Testing the API

### 1. Get Authentication Token

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

Copy the returned `token`.

### 2. Query Metrics

```bash
# Get all developers
curl -X GET http://localhost:5000/api/metrics/developers \
  -H "Authorization: Bearer <your_token>"

# Get developer metrics
curl -X GET "http://localhost:5000/api/metrics/developers/DEV-001?month=2026-03" \
  -H "Authorization: Bearer <your_token>"

# Get team metrics
curl -X GET "http://localhost:5000/api/metrics/managers/MGR-001/metrics?month=2026-03" \
  -H "Authorization: Bearer <your_token>"

# Get dashboard summary
curl -X GET http://localhost:5000/api/metrics/summary \
  -H "Authorization: Bearer <your_token>"
```

## Frontend Integration

The React frontend will:

1. **On login**: Store JWT token from `/api/auth/login`
2. **On dashboard load**: 
   - Fetch months: `GET /api/metrics/months`
   - Fetch summary: `GET /api/metrics/summary`
3. **On IC view**: Query specific developer with month filter
4. **On manager view**: Query team metrics for their manager_id
5. **On filter change**: Re-fetch data with new month query param

## Sample Data

The seed script includes:
- **8 Developers** across 3 teams
- **10 Jira Issues** (5 in March 2026, 5 in April 2026)
- **10 Pull Requests** with realistic review/merge metrics
- **12 Deployments** (6 per month to production/staging)
- **7 Bug Reports** with severity and production escape tracking

All data is linked via `developer_id` and organized by `month_done`/`month_merged`/`month_deployed`/`month_found` for historical analysis.

## DORA Metrics Calculated

1. **Lead Time**: Average `lead_time_days` from Deployments
2. **Cycle Time**: Average `cycle_time_days` from JiraIssues
3. **PR Throughput**: Count of merged PRs
4. **Deployment Frequency**: Count of production deployments
5. **Bug Rate**: Escaped bugs / issues completed (percentage)

These are calculated on-the-fly by the backend based on the month filter.
