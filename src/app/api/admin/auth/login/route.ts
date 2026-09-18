import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/validation";
import { db } from "@/lib/db";
import { verifyPassword, signAdminToken, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid credentials format" }, { status: 400 });
    }

    const { username, email, password } = parsed.data;
    const identifier = (username || email || "").trim();
    const user = await db.users.findByUsernameOrEmail(identifier);

    if (!user) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    const userUsername = user.username || (user.email ? user.email.split("@")[0] : "admin");

    const token = await signAdminToken({
      userId: user.id,
      username: userUsername,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        username: userUsername,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("[Login Error]", err);
    return NextResponse.json({ error: "Internal authentication error" }, { status: 500 });
  }
}
