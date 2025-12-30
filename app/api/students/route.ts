import connect from "@/lib/db";
import Student from "@/models/Student";
import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";

export async function GET() {
    try {
        await connect();
        const students = await Student.find({}).sort({ createdAt: -1 });
        return NextResponse.json(students);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        if (!(await isAdmin(req))) {
            return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
        }
        const body = await req.json();
        await connect();

        const newStudent = await Student.create(body);
        return NextResponse.json(newStudent, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to add student" }, { status: 500 });
    }
}
