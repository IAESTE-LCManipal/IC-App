//api/models/intern.ts
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
  professorDetails: IProfessorDetails;
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
  professorDetails: { type: ProfessorDetailsSchema, required: true }
});

// Hash password before saving
InternSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await hash(this.password, 10);
  }
  next();
});

export default mongoose.models.Intern || mongoose.model<IIntern>('Intern', InternSchema);
