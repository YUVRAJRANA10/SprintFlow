import mongoose from 'mongoose';

const DeploymentSchema = new mongoose.Schema({
  deployment_id: { type: String, required: true, unique: true },
  lead_time_days: { type: Number, required: true },
  month_deployed: { type: String, index: true },
  environment: String,
  status: String,
  deployed_at: Date
});

export default mongoose.model('Deployment', DeploymentSchema);
