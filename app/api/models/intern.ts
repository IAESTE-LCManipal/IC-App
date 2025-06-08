// api/models/intern.ts
import mongoose, { Schema, Document } from 'mongoose';
import { hash } from 'bcryptjs';

export interface IProfessorDetails {
  name: string;
  email: string;
  contact: string;
}

export interface IIntern extends Document {
  internID: string;
  password: string;
  fullName: string;
  photoUrl: string;
  startDate: Date;
  endDate: Date;
  sroSlot: string; // Added sroSlot field
  professorDetails: IProfessorDetails;
  role: 'intern';
  offerNumber: string; // New field
  passport: string; // New field
  countryOfOrigin: string; // New field
}

const ProfessorDetailsSchema = new Schema<IProfessorDetails>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  contact: { type: String, required: true }
});

const InternSchema = new Schema<IIntern>({
  internID: {
    type: String,
    required: true,
    unique: true,
    minlength: 8,
    maxlength: 8,
    match: /^[a-zA-Z0-9]{8}$/
  },
  password: {
    type: String,
    required: true
  },
  fullName: { type: String, required: true },
  photoUrl: { type: String, default: '' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  sroSlot: { type: String, match: /^[0-9]{2}$/, required: true },
  professorDetails: { type: ProfessorDetailsSchema, required: true },
  role: { type: String, enum: ['intern'], default: 'intern', required: true },
  offerNumber: { type: String, required: true }, // New field
  passport: { type: String, required: true }, // New field
  countryOfOrigin: { type: String, required: true } // New field
});

// Hash password before saving
InternSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await hash(this.password, 10);
  }
  next();
});

export default mongoose.models.Intern || mongoose.model<IIntern>('Intern', InternSchema);
