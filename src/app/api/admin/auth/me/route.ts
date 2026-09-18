import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ authenticated: false, error: "Not authenticated" }, { status: 401 });
  }

  const user = await db.users.findById(admin.userId);
  return NextResponse.json({
    authenticated: true,
    user: {
      id: admin.userId,
      name: user?.name || admin.name,
      username: user?.username || admin.username || "admin",
      email: admin.email,
      role: user?.role || admin.role,
    },
  });
}
