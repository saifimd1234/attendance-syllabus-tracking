import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_jwt_key_123";

export async function POST(req: NextRequest) {
    try {
        await connect();
        const { email, password } = await req.json();

        // Find user and include password for comparison
        const user = await User.findOne({ email }).select("+password");

        if (!user || !(await user.comparePassword(password))) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Create token
        const token = jwt.sign(
            { id: user._id, admin: user.admin, studentId: user.studentId },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        const response = NextResponse.json({
            message: "Login successful",
            user: {
                id: user._id,
                email: user.email,
                admin: user.admin,
                studentId: user.studentId
            }
        });

        // Set cookie
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 86400, // 1 day
            path: "/"
        });

        return response;

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
