import mongoose, { Schema, model, models } from 'mongoose';

const ChapterSchema = new Schema({
    title: { type: String, required: true },
    status: {
        type: String,
        enum: ['Incomplete', 'Ongoing', 'Completed', 'Revised Once', 'Revised Twice'],
        default: 'Incomplete'
    },
    startDate: { type: String },
    endDate: { type: String },
    timeTaken: { type: Number, default: 0 }
});

const SubjectSchema = new Schema({
    name: { type: String, required: true },
    chapters: [ChapterSchema]
});

const SyllabusSchema = new Schema({
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true, unique: true },
    subjects: [SubjectSchema]
}, { timestamps: true });

const Syllabus = models.Syllabus || model('Syllabus', SyllabusSchema);

export default Syllabus;
