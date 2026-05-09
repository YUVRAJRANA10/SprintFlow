import express from 'express';
import Developer from '../models/Developer.js';
import JiraIssue from '../models/JiraIssue.js';
import PullRequest from '../models/PullRequest.js';
import Deployment from '../models/Deployment.js';
import BugReport from '../models/BugReport.js';
import User from '../models/User.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

async function buildDeveloperMetrics(developerId, month) {
  const developer = await Developer.findOne({ developer_id: developerId }).lean();
  if (!developer) return null;

  const jiraFilter = { developer_id: developerId };
  if (month) jiraFilter.month_done = month;

  const jiraIssues = await JiraIssue.find(jiraFilter).lean();
  const prs = await PullRequest.find({
    developer_id: developerId,
    ...(month ? { month_merged: month } : {}),
  }).lean();

  const bugFilter = { developer_id: developerId };
  if (month) bugFilter.month_found = month;
  const bugs = await BugReport.find(bugFilter).lean();

  const cycleTime = jiraIssues.length > 0
    ? Number((jiraIssues.reduce((sum, issue) => sum + issue.cycle_time_days, 0) / jiraIssues.length).toFixed(2))
    : 0;

  const prReviewTime = prs.length > 0
    ? Number((prs.reduce((sum, pr) => sum + (pr.review_wait_hours || 0), 0) / prs.length).toFixed(2))
    : 0;

  return {
    ...developer,
    month: month || 'all-time',
    metrics: {
      cycle_time: cycleTime,
      pr_throughput: prs.length,
      pr_review_wait: prReviewTime,
      escaped_bugs: bugs.filter((bug) => bug.escaped_to_prod).length,
      issues_completed: jiraIssues.length,
    },
  };
}

// Get all developers
router.get('/developers', authMiddleware, async (req, res) => {
  try {
    const developers = await Developer.find().lean();
    res.json(developers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single developer with IC metrics for a specific month
router.get('/developers/:id', authMiddleware, async (req, res) => {
  try {
    const { month } = req.query;
    const payload = await buildDeveloperMetrics(req.params.id, month);
    if (!payload) return res.status(404).json({ error: 'Developer not found' });

    res.json({
      ...payload,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!user.developer_id) return res.status(400).json({ error: 'User is not linked to a developer profile' });

    const { month } = req.query;
    const payload = await buildDeveloperMetrics(user.developer_id, month);
    if (!payload) return res.status(404).json({ error: 'Developer not found' });

    res.json({
      ...payload,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        developer_id: user.developer_id,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get manager view with team metrics
router.get('/managers/:id/metrics', authMiddleware, async (req, res) => {
  try {
    const { month } = req.query;

    // Get all developers on this manager's team
    const teamMembers = await Developer.find({ manager_id: req.params.id }).lean();
    
    if (!teamMembers.length) {
      return res.status(404).json({ error: 'No team members found' });
    }

    const devIds = teamMembers.map(dev => dev.developer_id);

    // Calculate team metrics
    let jiraFilter = { developer_id: { $in: devIds } };
    let prFilter = { developer_id: { $in: devIds } };
    let bugFilter = { developer_id: { $in: devIds } };

    if (month) {
      jiraFilter.month_done = month;
      prFilter.month_merged = month;
      bugFilter.month_found = month;
    }

    const [jiraIssues, prs, bugs, deployments] = await Promise.all([
      JiraIssue.find(jiraFilter).lean(),
      PullRequest.find(prFilter).lean(),
      BugReport.find(bugFilter).lean(),
      Deployment.find(month ? { month_deployed: month } : {}).lean()
    ]);

    const avgCycleTime = jiraIssues.length > 0
      ? (jiraIssues.reduce((sum, issue) => sum + issue.cycle_time_days, 0) / jiraIssues.length).toFixed(2)
      : 0;

    const avgLeadTime = deployments.length > 0
      ? (deployments.reduce((sum, d) => sum + d.lead_time_days, 0) / deployments.length).toFixed(2)
      : 0;

    const deploymentFreq = deployments.length;
    const bugRate = jiraIssues.length > 0
      ? (bugs.filter(b => b.escaped_to_prod).length / jiraIssues.length).toFixed(4)
      : 0;

    res.json({
      manager_id: req.params.id,
      manager_name: teamMembers[0].manager_name,
      team_size: teamMembers.length,
      month: month || 'all-time',
      metrics: {
        avg_cycle_time: parseFloat(avgCycleTime),
        avg_lead_time: parseFloat(avgLeadTime),
        deployment_frequency: deploymentFreq,
        bug_rate: parseFloat(bugRate),
        pr_throughput: prs.length,
        issues_completed: jiraIssues.length
      },
      team_members: teamMembers.map(m => m.developer_name)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get dashboard summary (DORA metrics by month)
router.get('/summary', authMiddleware, async (req, res) => {
  try {
    // Get all distinct months
    const months = new Set();
    const [jira, prs, deployments, bugs] = await Promise.all([
      JiraIssue.find().distinct('month_done'),
      PullRequest.find().distinct('month_merged'),
      Deployment.find().distinct('month_deployed'),
      BugReport.find().distinct('month_found')
    ]);

    [jira, prs, deployments, bugs].forEach(arr => arr.forEach(m => m && months.add(m)));

    const monthlyMetrics = [];

    for (const month of Array.from(months).sort()) {
      const jiraData = await JiraIssue.find({ month_done: month }).lean();
      const prData = await PullRequest.find({ month_merged: month }).lean();
      const deployData = await Deployment.find({ month_deployed: month }).lean();
      const bugData = await BugReport.find({ month_found: month }).lean();

      const cycleTime = jiraData.length > 0
        ? (jiraData.reduce((sum, i) => sum + i.cycle_time_days, 0) / jiraData.length).toFixed(2)
        : 0;

      const leadTime = deployData.length > 0
        ? (deployData.reduce((sum, d) => sum + d.lead_time_days, 0) / deployData.length).toFixed(2)
        : 0;

      const bugRate = jiraData.length > 0
        ? (bugData.filter(b => b.escaped_to_prod).length / jiraData.length).toFixed(4)
        : 0;

      monthlyMetrics.push({
        month,
        lead_time: parseFloat(leadTime),
        cycle_time: parseFloat(cycleTime),
        deployment_frequency: deployData.length,
        pr_throughput: prData.length,
        bug_rate: parseFloat(bugRate),
        issues_completed: jiraData.length
      });
    }

    res.json(monthlyMetrics.sort((a, b) => a.month.localeCompare(b.month)));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get available months for filtering
router.get('/months', authMiddleware, async (req, res) => {
  try {
    const months = new Set();
    const [jira, prs, deployments, bugs] = await Promise.all([
      JiraIssue.find().distinct('month_done'),
      PullRequest.find().distinct('month_merged'),
      Deployment.find().distinct('month_deployed'),
      BugReport.find().distinct('month_found')
    ]);

    [jira, prs, deployments, bugs].forEach(arr => arr.forEach(m => m && months.add(m)));

    res.json(Array.from(months).sort());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
