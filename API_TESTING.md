# API Testing Guide

Complete reference for SprintFlow API endpoints with request/response examples and Postman collection setup.

---

## 🔐 Authentication

All endpoints (except login) require a JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

### Get JWT Token

**Endpoint:**
```
POST /api/auth/login
```

**Request:**
```json
{
  "email": "alice.johnson@sprintlens.dev",
  "password": "Password123!"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "email": "alice.johnson@sprintlens.dev",
    "name": "Alice Johnson"
  }
}
```

**Error (401):**
```json
{
  "error": "Invalid credentials"
}
```

---

## 📊 Metrics Endpoints

### 1. Get All Developers

**Endpoint:**
```
GET /api/metrics/developers
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "developers": [
    {
      "id": 1,
      "developer_id": "DEV-001",
      "name": "Alice Johnson",
      "email": "alice.johnson@sprintlens.dev",
      "team": "Backend",
      "manager": "Manager One",
      "level": "Senior Engineer"
    },
    {
      "id": 2,
      "developer_id": "DEV-002",
      "name": "Bob Smith",
      "email": "bob.smith@sprintlens.dev",
      "team": "Frontend",
      "manager": "Manager Two",
      "level": "Mid-Level Engineer"
    }
    // ... more developers
  ]
}
```

---

### 2. Get Single Developer Metrics + Recommendations

**Endpoint:**
```
GET /api/metrics/developers/:id
```

**Parameters:**
- `id` – Developer ID (numeric)

**Headers:**
```
Authorization: Bearer <token>
```

**Example Request:**
```
GET /api/metrics/developers/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200):**
```json
{
  "id": 1,
  "developer_id": "DEV-001",
  "name": "Alice Johnson",
  "email": "alice.johnson@sprintlens.dev",
  "team": "Backend",
  "manager": "Manager One",
  "level": "Senior Engineer",
  "metrics": {
    "cycle_time_days": 4.2,
    "lead_time_days": 5.8,
    "pr_throughput_per_month": 12,
    "pr_review_wait_hours": 8.3,
    "escaped_bugs": 1,
    "bug_rate": 0.08
  },
  "recommendations": [
    {
      "category": "performance",
      "status": "success",
      "title": "Cycle time is on track",
      "value": 4.2,
      "threshold": 5,
      "unit": "days",
      "action": "Continue maintaining current pace",
      "priority": "low"
    },
    {
      "category": "quality",
      "status": "warning",
      "title": "Bug rate elevated",
      "value": 1,
      "threshold": 0,
      "unit": "bugs",
      "action": "Implement pre-commit testing to catch issues before review",
      "priority": "high"
    },
    {
      "category": "collaboration",
      "status": "success",
      "title": "PR review time healthy",
      "value": 8.3,
      "threshold": 12,
      "unit": "hours",
      "action": "Keep up the review velocity",
      "priority": "low"
    }
  ]
}
```

---

### 3. Get Current User (Logged-In) Metrics + Recommendations

**Endpoint:**
```
GET /api/metrics/me
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
Same structure as `/api/metrics/developers/:id`

---

### 4. Get Manager's Team Metrics + Recommendations

**Endpoint:**
```
GET /api/metrics/managers/:id/metrics
```

**Parameters:**
- `id` – Manager ID (numeric)

**Headers:**
```
Authorization: Bearer <token>
```

**Example Request:**
```
GET /api/metrics/managers/1/metrics
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200):**
```json
{
  "id": 1,
  "name": "Manager One",
  "team": "Backend",
  "team_members": [
    {
      "id": 1,
      "name": "Alice Johnson",
      "developer_id": "DEV-001"
    },
    {
      "id": 3,
      "name": "Carol Davis",
      "developer_id": "DEV-003"
    }
  ],
  "metrics": {
    "team_size": 2,
    "avg_cycle_time_days": 4.5,
    "avg_lead_time_days": 6.2,
    "deployment_frequency_per_week": 2.1,
    "team_bug_rate": 0.12,
    "avg_pr_throughput_per_month": 11.5
  },
  "recommendations": [
    {
      "category": "velocity",
      "status": "success",
      "title": "Team cycle time is strong",
      "value": 4.5,
      "threshold": 6,
      "unit": "days",
      "action": "Maintain current sprint planning and estimation practices",
      "priority": "low"
    },
    {
      "category": "deployment",
      "status": "success",
      "title": "Deployment cadence healthy",
      "value": 2.1,
      "threshold": 1,
      "unit": "deploys/week",
      "action": "Continue current CI/CD pipeline efficiency",
      "priority": "low"
    },
    {
      "category": "quality",
      "status": "warning",
      "title": "Team bug rate trending up",
      "value": 0.12,
      "threshold": 0.08,
      "unit": "bugs/deploy",
      "action": "Increase testing rigor and code review standards",
      "priority": "high"
    }
  ]
}
```

---

### 5. Get Available Months for Filtering

**Endpoint:**
```
GET /api/metrics/months
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "months": [
    "2026-03",
    "2026-04",
    "2026-05"
  ]
}
```

---

### 6. Get Organization-Wide DORA Metrics by Month

**Endpoint:**
```
GET /api/metrics/summary
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "summary": [
    {
      "month": "2026-03",
      "lead_time_days": 5.6,
      "cycle_time_days": 4.1,
      "deployment_frequency_per_week": 2.3,
      "pr_throughput_per_month": 11.8,
      "bug_rate": 0.09
    },
    {
      "month": "2026-04",
      "lead_time_days": 6.2,
      "cycle_time_days": 4.5,
      "deployment_frequency_per_week": 2.1,
      "pr_throughput_per_month": 11.2,
      "bug_rate": 0.11
    }
  ]
}
```

---

## 🧪 Testing with cURL

### 1. Login and Get Token

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice.johnson@sprintlens.dev",
    "password": "Password123!"
  }'
```

Extract the `token` value from the response.

### 2. Get All Developers

```bash
curl -X GET http://localhost:5000/api/metrics/developers \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3. Get Single Developer Metrics

```bash
curl -X GET http://localhost:5000/api/metrics/developers/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Get Current User Metrics

```bash
curl -X GET http://localhost:5000/api/metrics/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 5. Get Team Metrics (Manager)

```bash
curl -X GET http://localhost:5000/api/metrics/managers/1/metrics \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 6. Get Available Months

```bash
curl -X GET http://localhost:5000/api/metrics/months \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 7. Get Organization Summary

```bash
curl -X GET http://localhost:5000/api/metrics/summary \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📮 Postman Collection

### Import Collection

1. Open Postman
2. Click **Import**
3. Select **Raw Text** tab
4. Paste the JSON below
5. Click **Import**

### Postman Collection JSON

```json
{
  "info": {
    "name": "SprintFlow API",
    "description": "API collection for SprintFlow agile sprint workspace",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"alice.johnson@sprintlens.dev\",\n  \"password\": \"Password123!\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/auth/login",
              "host": ["{{baseUrl}}"],
              "path": ["api", "auth", "login"]
            }
          }
        }
      ]
    },
    {
      "name": "Metrics - Developers",
      "item": [
        {
          "name": "Get All Developers",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/metrics/developers",
              "host": ["{{baseUrl}}"],
              "path": ["api", "metrics", "developers"]
            }
          }
        },
        {
          "name": "Get Single Developer",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/metrics/developers/1",
              "host": ["{{baseUrl}}"],
              "path": ["api", "metrics", "developers", "1"]
            }
          }
        },
        {
          "name": "Get Current User (Me)",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/metrics/me",
              "host": ["{{baseUrl}}"],
              "path": ["api", "metrics", "me"]
            }
          }
        }
      ]
    },
    {
      "name": "Metrics - Manager",
      "item": [
        {
          "name": "Get Team Metrics",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/metrics/managers/1/metrics",
              "host": ["{{baseUrl}}"],
              "path": ["api", "metrics", "managers", "1", "metrics"]
            }
          }
        }
      ]
    },
    {
      "name": "Metrics - Metadata",
      "item": [
        {
          "name": "Get Available Months",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/metrics/months",
              "host": ["{{baseUrl}}"],
              "path": ["api", "metrics", "months"]
            }
          }
        },
        {
          "name": "Get Organization Summary",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/metrics/summary",
              "host": ["{{baseUrl}}"],
              "path": ["api", "metrics", "summary"]
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000",
      "type": "string"
    },
    {
      "key": "token",
      "value": "",
      "type": "string"
    }
  ]
}
```

### Set Up Environment Variables

1. In Postman, click the **eye icon** (top-right) → **Globals** (or **Collections** tab)
2. Add these variables:
   - `baseUrl` = `http://localhost:5000` (or your deployed URL)
   - `token` = (leave empty initially; will populate after login)

### Testing Workflow

1. **Login First:**
   - Click **Auth** → **Login**
   - Send request
   - Copy the `token` value from the response
   - Paste into the `token` variable in Postman environment

2. **Test Developers Endpoints:**
   - Click **Metrics - Developers** folder
   - Try each endpoint

3. **Test Manager Endpoints:**
   - Click **Metrics - Manager** folder
   - Try team metrics

4. **Test Metadata:**
   - Click **Metrics - Metadata** folder
   - View months and summary data

---

## 🔍 Recommendation Status Codes

| Status | Color | Meaning |
|---|---|---|
| `success` | Green (#6fe7c8) | Metric is healthy; on target |
| `warning` | Orange (#ff9a76) | Metric is outside threshold; action needed |
| `info` | Blue (#8da2ff) | Metric is informational; may require attention |

---

## 📈 Recommendation Priority Levels

| Priority | Meaning |
|---|---|
| `high` | Critical issue requiring immediate attention |
| `medium` | Important improvement opportunity |
| `low` | Nice-to-have optimization |

---

## ⚠️ Common Issues

| Issue | Solution |
|---|---|
| **401 Unauthorized** | Check token is valid; copy token from login response exactly |
| **404 Not Found** | Verify endpoint URL; check developer/manager ID exists |
| **500 Server Error** | Check backend logs; ensure MONGO_URL is configured |
| **Empty recommendations** | Backend needs to generate metrics; ensure seed script ran |

---

## 📝 Test Accounts

All seeded accounts use password: `Password123!`

| Email | Role |
|---|---|
| alice.johnson@sprintlens.dev | Senior Engineer (Backend) |
| bob.smith@sprintlens.dev | Mid-Level Engineer (Frontend) |
| carol.davis@sprintlens.dev | Senior Engineer (Frontend) |
| diana.martinez@sprintlens.dev | Junior Engineer (Backend) |
| evan.patel@sprintlens.dev | Mid-Level Engineer (Backend) |
| fiona.lee@sprintlens.dev | Junior Engineer (Frontend) |
| george.wilson@sprintlens.dev | Senior Engineer (DevOps) |
| hannah.brown@sprintlens.dev | Mid-Level Engineer (DevOps) |

---

## 🚀 Production Testing

For production (deployed) endpoints:

1. Replace `{{baseUrl}}` with deployed URL:
   - Backend: `https://sprintlens-lg19.onrender.com`
   - Frontend: `https://sprint-lens.vercel.app`

2. Login to get token (same as local)

3. All endpoints work identically on production

---

## 📚 Additional Resources

- [README.md](README.md) – Full project overview
- [backend/utils/recommendations.js](backend/utils/recommendations.js) – Recommendation engine source
- [backend/routes/metrics.js](backend/routes/metrics.js) – API implementation

---
