import connect from "@/lib/db";
import Student from "@/models/Student";
import Attendance from "@/models/Attendance";
import { NextRequest, NextResponse } from "next/server";
import { isAdmin, getUser } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await getUser(req);
        const { id } = await params;

        // Only admins or the student themselves can access the profile
        if (!user || (!user.admin && user.studentId !== id)) {
            return NextResponse.json({ error: "Forbidden: Access denied" }, { status: 403 });
        }

        await connect();

        const student = await Student.findById(id);
        if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

        // Fetch attendance history where this student is involed
        // Since our Attendance model is by Date containing an array of records, we need to query specifically.
        // However, looking at the Attendance Model: { date: String, records: [{ studentId: ObjectId, status: String }] }
        // We can find all docs where records.studentId match.

        const attendanceDocs = await Attendance.find({ "records.studentId": id });

        const history = attendanceDocs.map(doc => {
            const record = doc.records.find((r: any) => r.studentId.toString() === id);
            return {
                date: doc.date,
                status: record ? record.status : 'N/A'
            };
        }).sort((a, b) => b.date.localeCompare(a.date));

        // Stats
        const total = history.length;
        const present = history.filter(h => h.status === 'Present').length;
        const percentage = total ? Math.round((present / total) * 100) : 0;

        return NextResponse.json({
            student,
            history,
            stats: { total, present, absent: total - present, percentage }
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch details" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await getUser(req);
        const { id } = await params;

        // Only admins or the student themselves can update the profile
        if (!user || (!user.admin && user.studentId !== id)) {
            return NextResponse.json({ error: "Forbidden: Access denied" }, { status: 403 });
        }

        const body = await req.json();
        await connect();
        const updated = await Student.findByIdAndUpdate(id, body, { new: true });
        if (!updated) return NextResponse.json({ error: "Student not found" }, { status: 404 });
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        if (!(await isAdmin(req))) {
            return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
        }
        const { id } = await params;
        await connect();
        const deleted = await Student.findByIdAndDelete(id);
        if (!deleted) return NextResponse.json({ error: "Student not found" }, { status: 404 });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}
