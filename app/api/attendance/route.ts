import connect from "@/lib/db";
import Attendance from "@/models/Attendance";
import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const date = searchParams.get('date');
        await connect();

        if (date) {
            const record = await Attendance.findOne({ date });
            return NextResponse.json(record ? record.records : []);
        }

        return NextResponse.json([]);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch attendance" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        if (!(await isAdmin(req))) {
            return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
        }
        const { date, attendanceData } = await req.json();
        await connect();

        // attendanceData is [{ studentId, status }]
        // We upsert the document for that date

        await Attendance.findOneAndUpdate(
            { date },
            {
                date,
                records: attendanceData
            },
            { upsert: true, new: true }
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to save attendance" }, { status: 500 });
    }
}
