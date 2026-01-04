import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/models/User";
import Student from "@/models/Student";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_jwt_key_123";

// Simple middleware-like check inside the route for now
export async function POST(req: NextRequest) {
    try {
        await connect();
        const { name, email, password, admin, studentId } = await req.json();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        let linkStudentId = studentId;

        // Automatically create a student profile if not provided
        if (!admin && !linkStudentId) {
            const newStudent = await Student.create({
                name,
                class: 'Not Set',
                school: 'Not Set',
                status: 'Active'
            });
            linkStudentId = newStudent._id;
        }

        // Create user
        const newUser = await User.create({
            name,
            email,
            password,
            admin: admin || false,
            studentId: linkStudentId || undefined
        });

        return NextResponse.json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                email: newUser.email,
                admin: newUser.admin
            }
        }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
