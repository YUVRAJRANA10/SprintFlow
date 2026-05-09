# SprintLens Demo Video Script

## Intro (10 seconds)
**[Camera shows login screen]**

> "Welcome to SprintLens, a developer productivity platform built on industry-standard DORA metrics. SprintLens combines real seeded data with MongoDB persistence, JWT authentication, and intelligent rule-based recommendations to give developers and managers actionable insights into team performance."

---

## Section 1: Authentication & Identity (20 seconds)
**[Show login flow → Dashboard appears]**

> "First, notice how login is seamless. You authenticate with your developer account—like alice.johnson@sprintlens.dev. Once logged in, SprintLens knows who you are and immediately shows your personal profile with your team, manager, and role. This isn't a generic dashboard; it's yours."

**[Highlight "LOGGED IN AS Alice Johnson" in the sidebar]**

---

## Section 2: Profile & Personal Metrics (30 seconds)
**[Click on "01 My Profile"]**

> "The first view shows your profile. You see your Developer ID, team, manager, and the current month. Below that, there's a 'Why this matters' card that explains what these metrics mean—lead time shows delivery speed, PR throughput shows flow, and bug rate highlights quality risk."

**[Scroll down to show profile metadata and data model section]**

> "And notice the data model section at the bottom—SprintLens is built on five collections: developers, jira issues, pull requests, deployments, and bug reports. All of this is real, queryable data in MongoDB."

---

## Section 3: Monthly Summary with Recommendations (40 seconds)
**[Click on "02 Monthly Summary"]**

> "Now let's look at monthly DORA metrics across the team. You see lead time, cycle time, deployment frequency, PR throughput, and bug rate for each month. These are the exact metrics DevOps Research and Assessment uses to measure team performance."

**[Scroll down or navigate to show the raw metrics]**

> "But SprintLens doesn't stop at raw numbers. Let me show you what really sets this apart: intelligent recommendations."

**[If visible, highlight any recommendation cards that appear]**

> "SprintLens analyzes each metric against industry thresholds and generates actionable recommendations. If a metric is out of bounds, you get a clear recommendation—not just a warning, but specific steps to improve."

---

## Section 4: Individual Developer View (35 seconds)
**[Click on "03 Individual View"]**

> "In the individual view, a manager can drill into any developer's metrics for a specific month. You can see cycle time in days, PR throughput, review wait time in hours, and escaped bugs."

**[Select a developer from the dropdown]**

> "And here's the magic: each developer gets their own set of recommendations based on their actual metrics. Cycle time too high? You'll see a recommendation to break down features into smaller chunks. Review wait times slow? The system suggests increasing async communication or scheduling pair reviews."

**[Scroll to show recommendation cards with different statuses: success (green), warning (orange), info (blue)]**

> "Each recommendation shows current vs. target values, priority level, and concrete next steps. Developers see what to improve and why."

---

## Section 5: Team/Manager View (35 seconds)
**[Click on "04 Team View"]**

> "Finally, the team view shows manager-level aggregation. You can see team size, average cycle time across the team, average lead time, and the team's bug rate."

**[Select a manager]**

> "Just like the individual view, team metrics come with recommendations. If deployment frequency is low, the manager gets a recommendation to improve CI/CD automation. If the team bug rate is high, they see a suggestion to increase testing rigor."

**[Show team recommendations cards]**

> "This is how SprintLens scales from individual contributors to team leads to executives: consistent metrics, consistent recommendations, actionable insights at every level."

---

## Section 6: Data & Architecture (15 seconds)
**[Return to profile view, show the data model section]**

> "Behind the scenes, SprintLens uses a clean, scalable architecture: seeded industry-standard data in MongoDB, Express backend with JWT auth, React frontend with Vite, and a recommendation engine that generates insights based on proven DORA thresholds."

> "Everything is containerized and deployed on Render for the backend and Vercel for the frontend, so it's production-ready and scalable."

---

## Outro (10 seconds)
**[Return to dashboard, highlight "From raw metrics to clear developer actions" tagline]**

> "SprintLens transforms raw metrics into clear developer actions. Whether you're looking at your own performance, your team's velocity, or organizational trends, you get insights you can act on today."

> "That's SprintLens: your developer productivity platform. Built on data. Driven by action."

**[Fade to logo]**

---

## Demo Login Credentials

Use any seeded account to walk through the demo:

- **Email:** alice.johnson@sprintlens.dev  
- **Password:** Password123!

Other available accounts:
- bob.smith@sprintlens.dev
- carol.davis@sprintlens.dev
- diana.martinez@sprintlens.dev
- evan.patel@sprintlens.dev
- fiona.lee@sprintlens.dev
- george.wilson@sprintlens.dev
- hannah.brown@sprintlens.dev

All use the same password: `Password123!`

---

## Key Messaging Points

1. **Real Data:** SprintLens is seeded with industry-standard data, not synthetic or hardcoded values.
2. **Developer-Centric:** Every logged-in user sees *their* profile first, not a generic dashboard.
3. **Actionable:** Recommendations aren't just warnings—they include specific next steps.
4. **Scalable:** The same platform works for individual contributors, managers, and teams.
5. **Modern Stack:** MongoDB, Express, React, Vite, JWT—proven technologies deployed to Render and Vercel.

---

## Demo Flow Timing

- **Total:** ~3 minutes  
- **Intro:** 10 sec  
- **Auth & Identity:** 20 sec  
- **Profile:** 30 sec  
- **Summary:** 40 sec  
- **Individual View:** 35 sec  
- **Team View:** 35 sec  
- **Architecture:** 15 sec  
- **Outro:** 10 sec  

*Adjust timings based on how much you want to highlight and explore each section live.*

---

## Tips for Recording

1. **Start with a clean login:** Begin the video logged out, then perform the login to show the auth flow.
2. **Select different months:** Show how month filtering works and how metrics change across different time periods.
3. **Hover over recommendation cards:** Show the card hover effect and emphasize the status colors and action text.
4. **Click between views:** Navigate smoothly through all four sidebar views to show the full product experience.
5. **Pause on key details:** Take a moment to read aloud the recommendation action text so viewers understand the value.
6. **Show team members:** In the team view, mention the individual team members and how their metrics feed into the aggregation.

---
