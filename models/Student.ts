import mongoose, { Schema, model, models } from 'mongoose';

const StudentSchema = new Schema({
    name: { type: String, required: true },
    class: { type: String, default: 'Not Set' },
    school: { type: String, default: 'Not Set' },
    status: { type: String, default: 'Active' },
    joiningDate: { type: Date, required: false },
}, { timestamps: true });

const Student = models.Student || model('Student', StudentSchema);

export default Student;
