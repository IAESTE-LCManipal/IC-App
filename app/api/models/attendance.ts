import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  internId: { type: mongoose.Schema.Types.ObjectId, ref: "Intern" },
  fileUrl: String,
  uploadedAt: { type: Date, default: Date.now },
  slotId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Slot",
        required: false 
    },
});

export default mongoose.models.Attendance ||
  mongoose.model("Attendance", attendanceSchema);