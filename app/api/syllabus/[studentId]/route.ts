import connect from "@/lib/db";
import Syllabus from "@/models/Syllabus";
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { studentId: string } }) {
    try {
        await connect();
        const syllabus = await Syllabus.findOne({ studentId: params.studentId });
        // Return empty structure if not found so frontend doesn't crash
        if (!syllabus) {
            return NextResponse.json({ studentId: params.studentId, subjects: [] });
        }
        return NextResponse.json(syllabus);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch syllabus" }, { status: 500 });
    }
}

export async function POST(req: NextRequest, { params }: { params: { studentId: string } }) {
    try {
        const user = await getUser(req);
        if (!user || (!user.admin && user.studentId?.toString() !== params.studentId)) {
            return NextResponse.json({ error: "Forbidden: Access denied" }, { status: 403 });
        }
        const { action, subjectName, chapterTitle, chapterStatus, startDate, endDate, subjectId, chapterId } = await req.json();
        await connect();

        let syllabus = await Syllabus.findOne({ studentId: params.studentId });
        if (!syllabus) {
            syllabus = await Syllabus.create({ studentId: params.studentId, subjects: [] });
        }

        if (action === 'ADD_SUBJECT') {
            syllabus.subjects.push({ name: subjectName, chapters: [] });
        } else if (action === 'ADD_CHAPTER') {
            const subject = syllabus.subjects.id(subjectId);
            if (subject) {
                subject.chapters.push({ title: chapterTitle, status: 'Incomplete' });
            }
        } else if (action === 'UPDATE_STATUS') {
            const subject = syllabus.subjects.id(subjectId);
            if (subject) {
                const chapter = subject.chapters.id(chapterId);
                if (chapter) {
                    if (chapterStatus) chapter.status = chapterStatus;
                    if (startDate) chapter.startDate = startDate;
                    if (endDate) chapter.endDate = endDate;

                    // Calculate timeTaken if both dates exist
                    if (chapter.startDate && chapter.endDate) {
                        const start = new Date(chapter.startDate);
                        const end = new Date(chapter.endDate);
                        const diffTime = Math.abs(end.getTime() - start.getTime());
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        chapter.timeTaken = diffDays;
                    }
                }
            }
        }

        await syllabus.save();
        return NextResponse.json(syllabus);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to update syllabus" }, { status: 500 });
    }
}
