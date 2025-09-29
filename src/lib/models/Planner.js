import mongoose from 'mongoose';

const plannerSchema = new mongoose.Schema({
	userId: String,
	planner: Object, // Store planner JSON directly
});

export default mongoose.models.Planner || mongoose.model('Planner', plannerSchema);
