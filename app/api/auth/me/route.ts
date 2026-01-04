import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        const user = await getUser(req);

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.json({
            user: {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                admin: user.admin,
                studentId: user.studentId ? user.studentId.toString() : undefined
            }
        });

    } catch (error: any) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
}
