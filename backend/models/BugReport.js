import mongoose from 'mongoose';

const BugReportSchema = new mongoose.Schema({
  bug_id: { type: String, required: true, unique: true },
  developer_id: { type: String, index: true },
  escaped_to_prod: Boolean,
  severity: String,
  month_found: { type: String, index: true },
  found_at: Date
});

export default mongoose.model('BugReport', BugReportSchema);
