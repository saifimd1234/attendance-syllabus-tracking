import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_jwt_key_123";

export async function getUser(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) return null;

        const decoded: any = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        return null;
    }
}

export async function isAdmin(req: NextRequest) {
    const user = await getUser(req);
    return user?.admin === true;
}
