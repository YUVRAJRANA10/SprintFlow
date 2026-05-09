import mongoose from 'mongoose';

const DeveloperSchema = new mongoose.Schema({
  developer_id: { type: String, required: true, unique: true, index: true },
  developer_name: { type: String, required: true },
  manager_id: { type: String, index: true },
  manager_name: String,
  team_name: { type: String, index: true },
  service_type: String,
  level: String,
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model('Developer', DeveloperSchema);
