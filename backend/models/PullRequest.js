import mongoose from 'mongoose';

const PullRequestSchema = new mongoose.Schema({
  pr_id: { type: String, required: true, unique: true },
  developer_id: { type: String, required: true, index: true },
  review_wait_hours: Number,
  merge_time_hours: Number,
  lines_changed: Number,
  review_rounds: Number,
  month_merged: { type: String, index: true },
  merged_at: Date
});

export default mongoose.model('PullRequest', PullRequestSchema);
