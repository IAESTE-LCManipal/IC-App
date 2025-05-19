// app/api/models/slot.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ISlot extends Document {
  slotNumber: number;
  from: Date;
  to: Date;
}

const SlotSchema = new Schema<ISlot>({
  slotNumber: { type: Number, required: true, unique: true },
  from: { type: Date, required: true },
  to: { type: Date, required: true },
});

export default mongoose.models.Slot || mongoose.model<ISlot>('Slot', SlotSchema);
