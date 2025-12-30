import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_jwt_key_123";

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decoded: any = jwt.verify(token, JWT_SECRET);
        return NextResponse.json({ user: decoded });

    } catch (error: any) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
}
