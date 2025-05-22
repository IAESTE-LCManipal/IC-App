import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISROChecklist extends Document {
  internID: string; // Reference to Intern's internID
  checklist: Record<string, boolean>; // Specify checklist as a record of boolean values
  updatedAt: Date;
}

const SROChecklistSchema = new Schema<ISROChecklist>({
  internID: { type: String, required: true, ref: 'Intern', unique: true },
  checklist: { type: Schema.Types.Mixed, required: true },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.SROChecklist || mongoose.model<ISROChecklist>('SROChecklist', SROChecklistSchema);
