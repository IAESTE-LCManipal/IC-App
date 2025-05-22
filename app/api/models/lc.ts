// api/models/lc.ts
import mongoose, { Schema, Document } from 'mongoose';
import { hash } from 'bcryptjs';

export interface ILC extends Document {
  email: string;
  firstName: string;
  lastName: string;
  sroSlot: string;
  password: string;
  role: 'lc';

}

const LCSchema = new Schema<ILC>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  sroSlot: { type: String, required: true, match: /^[0-9]{2}$/ },
  password: {
    type: String,
    required: true
  },
  role: { type: String, enum: ['lc'], default: 'lc', required: true }

});

// Hash password before saving
LCSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await hash(this.password, 10);
  }
  next();
});

export default mongoose.models.LC || mongoose.model<ILC>('LC', LCSchema);
