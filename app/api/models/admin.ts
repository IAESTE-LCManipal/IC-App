// api/models/admin.ts

export interface IAdmin extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string; // <-- Add role field to interface
}

import mongoose, { Schema } from 'mongoose';

const AdminSchema = new Schema<IAdmin>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, enum: ["admin"], default: "admin", required: true }, // <-- Add role field to schema
});

export default (mongoose.models.Admin as mongoose.Model<IAdmin>) || mongoose.model<IAdmin>('Admin', AdminSchema);
