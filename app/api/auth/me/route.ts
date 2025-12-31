import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        const user = await getUser(req);

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.json({ user });

    } catch (error: any) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
}
