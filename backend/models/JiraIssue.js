import mongoose from 'mongoose';

const JiraIssueSchema = new mongoose.Schema({
  issue_id: { type: String, required: true, unique: true },
  developer_id: { type: String, required: true, index: true },
  cycle_time_days: { type: Number, required: true },
  month_done: { type: String, index: true },
  created_at: Date,
  in_progress_at: Date,
  done_at: Date
});

export default mongoose.model('JiraIssue', JiraIssueSchema);
