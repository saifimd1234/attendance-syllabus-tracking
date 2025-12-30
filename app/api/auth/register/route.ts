import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_jwt_key_123";

// Simple middleware-like check inside the route for now
export async function POST(req: NextRequest) {
    try {
        await connect();
        const { email, password, admin, studentId } = await req.json();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        // Create user
        const newUser = await User.create({
            email,
            password,
            admin: admin || false,
            studentId: studentId || undefined
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
