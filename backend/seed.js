import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import Developer from './models/Developer.js';
import JiraIssue from './models/JiraIssue.js';
import PullRequest from './models/PullRequest.js';
import Deployment from './models/Deployment.js';
import BugReport from './models/BugReport.js';
import User from './models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/sprintlens';

// Sample data extracted from workbook
const developers = [
  { developer_id: 'DEV-001', developer_name: 'Alice Johnson', manager_id: 'MGR-001', manager_name: 'Sarah Chen', team_name: 'Payments API', service_type: 'Backend', level: 'Senior' },
  { developer_id: 'DEV-002', developer_name: 'Bob Smith', manager_id: 'MGR-001', manager_name: 'Sarah Chen', team_name: 'Payments API', service_type: 'Backend', level: 'Mid' },
  { developer_id: 'DEV-003', developer_name: 'Carol Davis', manager_id: 'MGR-001', manager_name: 'Sarah Chen', team_name: 'Payments API', service_type: 'Backend', level: 'Mid' },
  { developer_id: 'DEV-004', developer_name: 'David Brown', manager_id: 'MGR-002', manager_name: 'Marcus Lee', team_name: 'Checkout Web', service_type: 'Frontend', level: 'Senior' },
  { developer_id: 'DEV-005', developer_name: 'Emma Wilson', manager_id: 'MGR-002', manager_name: 'Marcus Lee', team_name: 'Checkout Web', service_type: 'Frontend', level: 'Mid' },
  { developer_id: 'DEV-006', developer_name: 'Frank Miller', manager_id: 'MGR-002', manager_name: 'Marcus Lee', team_name: 'Checkout Web', service_type: 'Frontend', level: 'Junior' },
  { developer_id: 'DEV-007', developer_name: 'Grace Taylor', manager_id: 'MGR-003', manager_name: 'Priya Patel', team_name: 'Mobile Growth', service_type: 'Mobile', level: 'Senior' },
  { developer_id: 'DEV-008', developer_name: 'Henry Martinez', manager_id: 'MGR-003', manager_name: 'Priya Patel', team_name: 'Mobile Growth', service_type: 'Mobile', level: 'Mid' }
];

const jiraIssues = [
  { issue_id: 'JIRA-1001', developer_id: 'DEV-001', cycle_time_days: 3, month_done: '2026-03', created_at: '2026-03-01', in_progress_at: '2026-03-02', done_at: '2026-03-04' },
  { issue_id: 'JIRA-1002', developer_id: 'DEV-002', cycle_time_days: 5, month_done: '2026-03', created_at: '2026-03-02', in_progress_at: '2026-03-03', done_at: '2026-03-07' },
  { issue_id: 'JIRA-1003', developer_id: 'DEV-003', cycle_time_days: 4, month_done: '2026-03', created_at: '2026-03-01', in_progress_at: '2026-03-03', done_at: '2026-03-05' },
  { issue_id: 'JIRA-1004', developer_id: 'DEV-004', cycle_time_days: 2, month_done: '2026-03', created_at: '2026-03-05', in_progress_at: '2026-03-06', done_at: '2026-03-07' },
  { issue_id: 'JIRA-1005', developer_id: 'DEV-005', cycle_time_days: 6, month_done: '2026-03', created_at: '2026-03-01', in_progress_at: '2026-03-02', done_at: '2026-03-07' },
  { issue_id: 'JIRA-2001', developer_id: 'DEV-001', cycle_time_days: 2, month_done: '2026-04', created_at: '2026-04-01', in_progress_at: '2026-04-02', done_at: '2026-04-03' },
  { issue_id: 'JIRA-2002', developer_id: 'DEV-002', cycle_time_days: 4, month_done: '2026-04', created_at: '2026-04-02', in_progress_at: '2026-04-03', done_at: '2026-04-06' },
  { issue_id: 'JIRA-2003', developer_id: 'DEV-006', cycle_time_days: 7, month_done: '2026-04', created_at: '2026-04-01', in_progress_at: '2026-04-02', done_at: '2026-04-08' },
  { issue_id: 'JIRA-2004', developer_id: 'DEV-007', cycle_time_days: 3, month_done: '2026-04', created_at: '2026-04-05', in_progress_at: '2026-04-06', done_at: '2026-04-08' },
  { issue_id: 'JIRA-2005', developer_id: 'DEV-008', cycle_time_days: 5, month_done: '2026-04', created_at: '2026-04-01', in_progress_at: '2026-04-03', done_at: '2026-04-06' }
];

const pullRequests = [
  { pr_id: 'PR-1001', developer_id: 'DEV-001', review_wait_hours: 2, merge_time_hours: 1, lines_changed: 250, review_rounds: 1, month_merged: '2026-03', merged_at: '2026-03-04' },
  { pr_id: 'PR-1002', developer_id: 'DEV-002', review_wait_hours: 4, merge_time_hours: 2, lines_changed: 180, review_rounds: 2, month_merged: '2026-03', merged_at: '2026-03-06' },
  { pr_id: 'PR-1003', developer_id: 'DEV-003', review_wait_hours: 1, merge_time_hours: 0.5, lines_changed: 120, review_rounds: 1, month_merged: '2026-03', merged_at: '2026-03-05' },
  { pr_id: 'PR-1004', developer_id: 'DEV-004', review_wait_hours: 3, merge_time_hours: 1.5, lines_changed: 350, review_rounds: 2, month_merged: '2026-03', merged_at: '2026-03-07' },
  { pr_id: 'PR-1005', developer_id: 'DEV-005', review_wait_hours: 5, merge_time_hours: 3, lines_changed: 420, review_rounds: 3, month_merged: '2026-03', merged_at: '2026-03-08' },
  { pr_id: 'PR-2001', developer_id: 'DEV-001', review_wait_hours: 1.5, merge_time_hours: 0.5, lines_changed: 200, review_rounds: 1, month_merged: '2026-04', merged_at: '2026-04-03' },
  { pr_id: 'PR-2002', developer_id: 'DEV-006', review_wait_hours: 6, merge_time_hours: 2, lines_changed: 500, review_rounds: 3, month_merged: '2026-04', merged_at: '2026-04-08' },
  { pr_id: 'PR-2003', developer_id: 'DEV-007', review_wait_hours: 2.5, merge_time_hours: 1, lines_changed: 300, review_rounds: 1, month_merged: '2026-04', merged_at: '2026-04-09' },
  { pr_id: 'PR-2004', developer_id: 'DEV-008', review_wait_hours: 3.5, merge_time_hours: 2, lines_changed: 275, review_rounds: 2, month_merged: '2026-04', merged_at: '2026-04-07' },
  { pr_id: 'PR-2005', developer_id: 'DEV-002', review_wait_hours: 4.5, merge_time_hours: 1.5, lines_changed: 380, review_rounds: 2, month_merged: '2026-04', merged_at: '2026-04-06' }
];

const deployments = [
  { deployment_id: 'DEPLOY-001', lead_time_days: 2, month_deployed: '2026-03', environment: 'production', status: 'success', deployed_at: '2026-03-05' },
  { deployment_id: 'DEPLOY-002', lead_time_days: 3, month_deployed: '2026-03', environment: 'production', status: 'success', deployed_at: '2026-03-08' },
  { deployment_id: 'DEPLOY-003', lead_time_days: 1, month_deployed: '2026-03', environment: 'staging', status: 'success', deployed_at: '2026-03-10' },
  { deployment_id: 'DEPLOY-004', lead_time_days: 4, month_deployed: '2026-03', environment: 'production', status: 'success', deployed_at: '2026-03-12' },
  { deployment_id: 'DEPLOY-005', lead_time_days: 2, month_deployed: '2026-03', environment: 'production', status: 'success', deployed_at: '2026-03-15' },
  { deployment_id: 'DEPLOY-006', lead_time_days: 3, month_deployed: '2026-03', environment: 'production', status: 'success', deployed_at: '2026-03-18' },
  { deployment_id: 'DEPLOY-007', lead_time_days: 1, month_deployed: '2026-04', environment: 'production', status: 'success', deployed_at: '2026-04-03' },
  { deployment_id: 'DEPLOY-008', lead_time_days: 2, month_deployed: '2026-04', environment: 'production', status: 'success', deployed_at: '2026-04-06' },
  { deployment_id: 'DEPLOY-009', lead_time_days: 5, month_deployed: '2026-04', environment: 'production', status: 'success', deployed_at: '2026-04-09' },
  { deployment_id: 'DEPLOY-010', lead_time_days: 2, month_deployed: '2026-04', environment: 'staging', status: 'success', deployed_at: '2026-04-10' },
  { deployment_id: 'DEPLOY-011', lead_time_days: 3, month_deployed: '2026-04', environment: 'production', status: 'success', deployed_at: '2026-04-12' },
  { deployment_id: 'DEPLOY-012', lead_time_days: 2, month_deployed: '2026-04', environment: 'production', status: 'success', deployed_at: '2026-04-15' }
];

const bugReports = [
  { bug_id: 'BUG-001', developer_id: 'DEV-002', escaped_to_prod: true, severity: 'high', month_found: '2026-03', found_at: '2026-03-10' },
  { bug_id: 'BUG-002', developer_id: 'DEV-005', escaped_to_prod: false, severity: 'medium', month_found: '2026-03', found_at: '2026-03-08' },
  { bug_id: 'BUG-003', developer_id: 'DEV-006', escaped_to_prod: true, severity: 'critical', month_found: '2026-03', found_at: '2026-03-12' },
  { bug_id: 'BUG-004', developer_id: 'DEV-001', escaped_to_prod: false, severity: 'low', month_found: '2026-04', found_at: '2026-04-05' },
  { bug_id: 'BUG-005', developer_id: 'DEV-004', escaped_to_prod: true, severity: 'high', month_found: '2026-04', found_at: '2026-04-07' },
  { bug_id: 'BUG-006', developer_id: 'DEV-007', escaped_to_prod: false, severity: 'medium', month_found: '2026-04', found_at: '2026-04-09' },
  { bug_id: 'BUG-007', developer_id: 'DEV-008', escaped_to_prod: true, severity: 'high', month_found: '2026-04', found_at: '2026-04-11' }
];

const seededUsers = [
  { name: 'Alice Johnson', email: 'alice.johnson@sprintlens.dev', password: 'Password123!', developer_id: 'DEV-001', role: 'developer' },
  { name: 'Bob Smith', email: 'bob.smith@sprintlens.dev', password: 'Password123!', developer_id: 'DEV-002', role: 'developer' },
  { name: 'Carol Davis', email: 'carol.davis@sprintlens.dev', password: 'Password123!', developer_id: 'DEV-003', role: 'developer' },
  { name: 'David Brown', email: 'david.brown@sprintlens.dev', password: 'Password123!', developer_id: 'DEV-004', role: 'developer' },
  { name: 'Emma Wilson', email: 'emma.wilson@sprintlens.dev', password: 'Password123!', developer_id: 'DEV-005', role: 'developer' },
  { name: 'Frank Miller', email: 'frank.miller@sprintlens.dev', password: 'Password123!', developer_id: 'DEV-006', role: 'developer' },
  { name: 'Grace Taylor', email: 'grace.taylor@sprintlens.dev', password: 'Password123!', developer_id: 'DEV-007', role: 'developer' },
  { name: 'Henry Martinez', email: 'henry.martinez@sprintlens.dev', password: 'Password123!', developer_id: 'DEV-008', role: 'developer' },
];

async function buildSeededUsers() {
  return Promise.all(
    seededUsers.map(async (user) => ({
      ...user,
      password: await bcrypt.hash(user.password, 10),
    }))
  );
}

async function seedDatabase() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('🗑️  Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Developer.deleteMany({}),
      JiraIssue.deleteMany({}),
      PullRequest.deleteMany({}),
      Deployment.deleteMany({}),
      BugReport.deleteMany({})
    ]);
    console.log('✅ Collections cleared');

    console.log('👤 Inserting developers...');
    await Developer.insertMany(developers);
    console.log(`✅ Inserted ${developers.length} developers`);

    console.log('🔐 Inserting seeded users...');
    const hashedUsers = await buildSeededUsers();
    await User.insertMany(hashedUsers);
    console.log(`✅ Inserted ${seededUsers.length} users`);

    console.log('📝 Inserting Jira issues...');
    await JiraIssue.insertMany(jiraIssues);
    console.log(`✅ Inserted ${jiraIssues.length} Jira issues`);

    console.log('🔀 Inserting pull requests...');
    await PullRequest.insertMany(pullRequests);
    console.log(`✅ Inserted ${pullRequests.length} pull requests`);

    console.log('🚀 Inserting deployments...');
    await Deployment.insertMany(deployments);
    console.log(`✅ Inserted ${deployments.length} deployments`);

    console.log('🐛 Inserting bug reports...');
    await BugReport.insertMany(bugReports);
    console.log(`✅ Inserted ${bugReports.length} bug reports`);

    console.log('✨ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
