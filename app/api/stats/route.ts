import connect from "@/lib/db";
import Student from "@/models/Student";
import Attendance from "@/models/Attendance";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connect();
        const totalStudents = await Student.countDocuments();

        // Aggregation for attendance stats
        // We want all records to build the heatmap and recent activity
        const attendanceDocs = await Attendance.find({}).sort({ date: -1 });

        let allRecords: any[] = [];
        attendanceDocs.forEach(doc => {
            doc.records.forEach((r: any) => {
                allRecords.push({
                    date: doc.date,
                    studentId: r.studentId, // This might be ObjectId, frontend might treat as string
                    status: r.status
                });
            });
        });

        return NextResponse.json({
            totalStudents,
            attendance: allRecords
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
