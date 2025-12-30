import mongoose, { Schema, model, models } from 'mongoose';

const AttendanceSchema = new Schema({
    date: { type: String, required: true }, // YYYY-MM-DD
    records: [{
        studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
        status: { type: String, enum: ['Present', 'Absent', 'Late'], required: true }
    }]
}, { timestamps: true });

// Compound index to ensure one attendance record per day
AttendanceSchema.index({ date: 1 }, { unique: true });

const Attendance = models.Attendance || model('Attendance', AttendanceSchema);

export default Attendance;
