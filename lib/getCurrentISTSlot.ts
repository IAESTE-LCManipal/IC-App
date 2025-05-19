// lib/getCurrentISTSlot.ts
import Slot from '@/app/api/models/slot';

export async function getCurrentISTSlot(): Promise<number | null> {
  // Get current date in IST
  const nowUTC = new Date();
  // IST is UTC+5:30
  const nowIST = new Date(nowUTC.getTime() + (5.5 * 60 * 60 * 1000));
  const slots = await Slot.find({});
  for (const slot of slots) {
    if (nowIST >= slot.from && nowIST <= slot.to) {
      return slot.slotNumber;
    }
  }
  return null;
}
