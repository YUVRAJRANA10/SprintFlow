# SprintLens Deployment Guide

## Current Deployment Status

- **Backend (Render):** https://sprintlens-lg19.onrender.com
- **Frontend (Vercel):** https://sprint-lens.vercel.app

---

## Deploying Latest Commit to Render (Backend)

The Render deployment is already connected to the `main` branch. When you push to GitHub, Render automatically redeploys.

### Manual Redeploy (if needed):
1. Go to https://dashboard.render.com
2. Find the **SprintLens** web service
3. Click **Manual Deploy** → **Deploy latest commit**
4. Wait for the build to complete (typically 2-3 minutes)
5. Verify at https://sprintlens-lg19.onrender.com/api/metrics/months (should return a 200 with months list)

### Verify Backend is Running:
```bash
curl https://sprintlens-lg19.onrender.com/api/metrics/months \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Deploying Latest Commit to Vercel (Frontend)

The Vercel deployment is connected to the `main` branch as well. Pushing to GitHub triggers automatic redeployment.

### Manual Redeploy (if needed):
1. Go to https://vercel.com/dashboard
2. Find the **SprintLens** project
3. Click **Deployments**
4. Find the latest deployment and click **Redeploy**
5. Wait for the build to complete (typically 1-2 minutes)
6. Verify at https://sprint-lens.vercel.app

### Environment Variables to Check:
Make sure `VITE_API_URL` is set to `https://sprintlens-lg19.onrender.com` in Vercel project settings.

---

## Local Testing Before Deploy

Before pushing to production, test locally:

### Backend:
```bash
cd backend
npm install
npm run seed
npm run dev
# Backend should be running on http://localhost:5000
```

### Frontend:
```bash
cd frontend
npm install
npm run dev
# Frontend should be running on http://localhost:5173
```

### Test Login:
Navigate to http://localhost:5173 and log in with:
- **Email:** alice.johnson@sprintlens.dev
- **Password:** Password123!

Verify all four views render correctly and recommendations appear.

---

## Git Workflow for Deployment

1. **Make changes locally**
2. **Build and test:**
   ```bash
   cd frontend
   npm run build
   # Should complete without errors
   ```
3. **Commit with a clear message:**
   ```bash
   git add .
   git commit -m "Feature: Add new metric view"
   ```
4. **Push to main:**
   ```bash
   git push origin main
   ```
5. **Monitor deployments:**
   - Render: https://dashboard.render.com (check logs)
   - Vercel: https://vercel.com/dashboard (check deployments)

---

## Troubleshooting

### Backend Issues:
- **MongoDB connection fails:** Check `MONGO_URL` env var in Render settings
- **Seed script doesn't run:** Manually run `npm run seed` in Render shell, or trigger a manual deploy
- **Metrics endpoint returns 401:** Ensure JWT token is being sent in the Authorization header

### Frontend Issues:
- **API calls fail:** Check `VITE_API_URL` in Vercel environment variables
- **Styles not loading:** Clear browser cache and hard refresh (Ctrl+Shift+R)
- **Build fails on deploy:** Check build logs in Vercel and fix syntax errors locally

### General:
- **After merge, deployment doesn't update:** Wait 1-2 minutes for automatic redeploy. If still not updated, manually trigger a redeploy.

---

## What to Check After Deployment

1. **Login works:**
   - Navigate to the frontend URL
   - Log in with alice.johnson@sprintlens.dev / Password123!
   - Should see the dashboard

2. **Metrics load:**
   - Check that the profile view shows developer data
   - Navigate to each view (Profile → Summary → Individual → Team)
   - Verify metrics display correctly

3. **Recommendations show:**
   - Go to Individual View or Team View
   - Scroll down to see recommendation cards
   - Verify each card shows status, priority, current vs. target, and action

4. **Network requests succeed:**
   - Open browser DevTools (F12)
   - Check Network tab for API calls to `/api/metrics/*`
   - All calls should return 200 with data

---

## Rollback Plan

If deployment breaks production:

1. **Identify the problematic commit:**
   ```bash
   git log --oneline | head -5
   ```

2. **Revert to previous stable commit:**
   ```bash
   git revert <commit-hash>
   git push origin main
   ```

3. **Monitor Render and Vercel:**
   - They will auto-redeploy with the reverted code
   - Should be live within 2-3 minutes

---

## Environment Variables Reference

### Render (Backend):
- `MONGO_URL` – MongoDB Atlas connection string
- `JWT_SECRET` – Secret key for JWT signing
- `NODE_ENV` – Set to `production`

### Vercel (Frontend):
- `VITE_API_URL` – Backend API URL (e.g., `https://sprintlens-lg19.onrender.com`)

---
