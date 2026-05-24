# SprintFlow

> Agile sprint workspace powered by DORA metrics, real-time recommendations, and actionable insights.

SprintFlow transforms raw delivery metrics into clear next steps. Built on industry-standard DORA frameworks (cycle time, lead time, deployment frequency, bug rate), SprintFlow provides **rule-based recommendations** that help contributors and teams improve their sprint flow.

Inspired by agile workflows from tools like Jira and GoodDay Work, this project is fully implemented from scratch with a custom UX and data model.

---

## ✅ Problem Statement

Teams often have delivery data but lack clarity on *what to do next*. SprintFlow closes the gap by turning sprint metrics into actionable recommendations across contributors and teams.

---

## 🧭 Module Alignment

**Selected Module:** Agile Workflow & Sprint Management System (Inspired by Jira and GoodDay Work)

This aligns with sprint tracking, contributor workflow visibility, and team-level productivity insights.

---

## ✨ Features

- **Agile Workspace** – Sprint pulse, contributor insights, and team health in one view
- **Role-Aware Views** – Personal workspace profile, contributor insights, and team health
- **Rule-Based Recommendations** – Intelligent analysis of metrics with specific, actionable next steps
- **Real Data** – Seeded with industry-standard test data; works with live MongoDB
- **JWT Authentication** – Secure user sessions with token-based auth
- **Modern Tech Stack** – MongoDB, Express, React, Vite; deployed on Render & Vercel

---

## 🌐 Live Demo (No Setup Required)

You can access the live app directly without local setup:

- **Frontend (Vercel):** https://sprint-lens.vercel.app
- **Backend (Render):** https://sprintlens-lg19.onrender.com

**Test Login**
- **Email:** alice.johnson@sprintlens.dev
- **Password:** Password123!

---

## 📋 Data Model

SprintFlow manages five collections:

| Collection     | Purpose |
|---|---|
| **Developers** | Developer profiles with team/manager/level |
| **JiraIssues** | Sprint work items with cycle metrics |
| **PullRequests** | Code review data with review times |
| **Deployments** | Deployment records with lead time |
| **BugReports** | Quality metrics and escaped bugs |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- MongoDB Atlas account (or local MongoDB instance)

### 1. Clone & Install

```bash
git clone https://github.com/YUVRAJRANA10/SprintLens.git
cd SprintLens

# Install backend
cd backend
npm install

# Install frontend (in new terminal)
cd frontend
npm install
```

### 2. Set Up Environment Variables

**Backend** – Create `backend/.env`:
```env
MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/sprintlens?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-here
PORT=5000
NODE_ENV=development
```

**Frontend** – Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
```

### 3. Seed Database

```bash
cd backend
npm run seed
```

This creates test accounts with password `Password123!`:
- alice.johnson@sprintlens.dev
- bob.smith@sprintlens.dev
- carol.davis@sprintlens.dev
- diana.martinez@sprintlens.dev
- evan.patel@sprintlens.dev
- fiona.lee@sprintlens.dev
- george.wilson@sprintlens.dev
- hannah.brown@sprintlens.dev

### 4. Run Locally

**Backend:**
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

**Frontend** (new terminal):
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

### 5. Login & Explore

Navigate to http://localhost:5173, log in with any seeded account, and explore:
- **Workspace Profile** – Identity, team, role, and context
- **Sprint Pulse** – DORA signals by month
- **Contributor Insights** – Individual metrics + recommendations
- **Team Health** – Manager-level aggregation + recommendations

---

## 📊 API Endpoints

All endpoints require JWT authorization header:
```
Authorization: Bearer <token>
```

### Authentication
- **POST** `/api/auth/login` – Login with email/password → returns JWT token

### Metrics (Developer)
- **GET** `/api/metrics/developers` – List all developers
- **GET** `/api/metrics/developers/:id` – Single developer metrics + recommendations
- **GET** `/api/metrics/me` – Logged-in user's metrics + recommendations

### Metrics (Team)
- **GET** `/api/metrics/managers/:id/metrics` – Team aggregation for manager + recommendations

### Metadata
- **GET** `/api/metrics/months` – Available months for filtering
- **GET** `/api/metrics/summary` – Organization-wide DORA metrics by month

See [API_TESTING.md](API_TESTING.md) for complete endpoint reference with request/response examples and Postman collection.

---

## 🎯 Recommendation Engine

SprintFlow applies **rule-based thresholds** to generate actionable recommendations:

### Developer Metrics
| Metric | Threshold | Action |
|---|---|---|
| **Cycle Time** | > 5 days | "Break down features into smaller chunks" |
| **PR Review Wait** | > 12 hours | "Increase code review frequency" |
| **Escaped Bugs** | > 0 | "Implement pre-commit testing" |
| **PR Throughput** | 0 per month | "Increase contribution frequency" |

### Team Metrics
| Metric | Threshold | Action |
|---|---|---|
| **Avg Cycle Time** | > 6 days | "Improve sprint planning and estimation" |
| **Deployment Frequency** | < 1/week | "Improve CI/CD automation" |
| **Bug Rate** | > 0.5 bugs/deploy | "Increase testing rigor" |

Each recommendation includes:
- **Status** – success (green), warning (orange), info (blue)
- **Priority** – high, medium, low
- **Current vs. Target** – concrete values for transparency
- **Action** – specific next steps

---

## 🏗️ Architecture

```
SprintFlow
├── backend/
│   ├── server.js                 # Express entry point
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT validation
│   ├── models/
│   │   ├── Developer.js
│   │   ├── JiraIssue.js
│   │   ├── PullRequest.js
│   │   ├── Deployment.js
│   │   └── BugReport.js
│   ├── routes/
│   │   ├── auth.js              # Login endpoint
│   │   └── metrics.js           # Metrics + recommendations API
│   ├── utils/
│   │   └── recommendations.js   # Rule-based recommendation logic
│   ├── seed.js                  # Database seeding script
│   └── package.json
│
├── frontend/
│   ├── index.html
│   ├── src/
│   │   ├── App.jsx              # Router setup
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   └── ProductDashboard.jsx  # 4-view dashboard
│   │   └── styles/
│   │       └── product-dashboard.css
│   ├── vite.config.js
│   └── package.json
│
├── render.yaml                  # Render deployment config
├── vercel.json                  # Vercel deployment config
└── API_TESTING.md              # API reference & Postman guide
```

**Tech Stack:**
- **Backend:** Node.js 18+, Express.js, Mongoose 9.6.1, MongoDB Atlas, JWT
- **Frontend:** React 18, Vite 5.4.21, modern CSS Grid/Flexbox
- **Deployment:** Render (backend), Vercel (frontend)

---

## 🔐 Security

- ✅ Passwords hashed with bcryptjs before storage
- ✅ JWT tokens with configurable expiry
- ✅ Auth middleware protects all metrics endpoints
- ✅ `.env` files excluded from git (.gitignore)
- ✅ CORS enabled for frontend domain
- ✅ No sensitive data hardcoded in repository

---

## 📦 Build & Deployment

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
# Output: dist/ (optimized ~156KB JS, 14KB CSS after gzip)
```

**Backend:**
```bash
cd backend
npm install
npm run seed
# Ready for deployment
```

### Deploy to Render (Backend)

1. Connect GitHub repo to Render
2. Set environment variables (MONGO_URL, JWT_SECRET)
3. Build command: `npm install && npm run seed && npm start`
4. Start command: `npm start`

### Deploy to Vercel (Frontend)

1. Connect GitHub repo to Vercel
2. Set environment variable: `VITE_API_URL=https://<render-backend-url>`
3. Build command: `npm run build`
4. Output directory: `dist`

---

## 🧪 Testing

### Manual Testing

See [API_TESTING.md](API_TESTING.md) for:
- Complete endpoint reference
- Request/response examples
- Postman collection JSON
- cURL commands for all endpoints

### Quick Test

```bash
# Get available months
curl http://localhost:5000/api/metrics/months \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get single developer metrics + recommendations
curl http://localhost:5000/api/metrics/developers/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📝 Environment Variables

### Backend

| Variable | Description | Example |
|---|---|---|
| `MONGO_URL` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Secret for signing JWT tokens | `your-secret-key` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` or `production` |

### Frontend

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000` or `https://api.sprintflow.com` |

---

## 🐛 Troubleshooting

| Issue | Solution |
|---|---|
| MongoDB connection fails | Check MONGO_URL format; ensure IP whitelist includes your IP |
| Login returns 401 | Verify email/password; check seed script ran; inspect console for JWT errors |
| Recommendations not showing | Check backend logs for errors; verify GET /metrics endpoints return recommendations array |
| CORS errors in frontend | Check VITE_API_URL matches backend URL; ensure backend CORS middleware is enabled |
| Build fails on Vercel | Check frontend/package.json has all dependencies; verify VITE_API_URL env var is set |

---

## 📚 Key Files

| File | Purpose |
|---|---|
| [backend/utils/recommendations.js](backend/utils/recommendations.js) | Rule-based recommendation engine (160 lines) |
| [backend/routes/metrics.js](backend/routes/metrics.js) | Metrics API with integrated recommendations |
| [frontend/src/pages/ProductDashboard.jsx](frontend/src/pages/ProductDashboard.jsx) | 4-view dashboard with recommendations rendering |
| [API_TESTING.md](API_TESTING.md) | Complete API reference and Postman guide |

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and test locally
3. Commit with clear message: `git commit -m "Add feature X"`
4. Push: `git push origin feature/your-feature`
5. Open a pull request

---

## 📄 License

MIT

---

## 🎯 Next Steps

- [ ] Deploy backend to Render
- [ ] Deploy frontend to Vercel
- [ ] Test all endpoints with [API_TESTING.md](API_TESTING.md)

---

## 📞 Support

For issues or questions:
1. Check [API_TESTING.md](API_TESTING.md) for endpoint reference
2. Review environment variable setup
3. Check backend logs: `npm run dev` with output visible
4. Verify database seed: `npm run seed` in backend

---

**Built with ❤️ by Yuvraj**
