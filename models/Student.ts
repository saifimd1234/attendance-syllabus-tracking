import mongoose, { Schema, model, models } from 'mongoose';

const StudentSchema = new Schema({
    name: { type: String, required: true },
    class: { type: String, required: true },
    school: { type: String, required: true },
    status: { type: String, default: 'Active' },
}, { timestamps: true });

const Student = models.Student || model('Student', StudentSchema);

export default Student;
