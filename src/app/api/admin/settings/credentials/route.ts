import { NextResponse } from "next/server";
import { requireAdmin, verifyPassword, signAdminToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { db } from "@/lib/db";
import { credentialsUpdateSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET() {
  const authCheck = await requireAdmin();
  if (!authCheck.success) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  const user = await db.users.findById(authCheck.admin.userId);
  if (!user) {
    return NextResponse.json({ error: "User account not found" }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    username: user.username || (user.email ? user.email.split("@")[0] : "admin"),
    email: user.email,
    name: user.name,
    role: user.role,
  });
}

export async function POST(request: Request) {
  const authCheck = await requireAdmin();
  if (!authCheck.success) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
  }

  try {
    const body = await request.json();
    const parsed = credentialsUpdateSchema.safeParse(body);

    if (!parsed.success) {
      const errorMsg = parsed.error.issues[0]?.message || "Invalid input data";
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { currentPassword, newUsername, newPassword } = parsed.data;

    const user = await db.users.findById(authCheck.admin.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify current password
    const isCurrentValid = await verifyPassword(currentPassword, user.passwordHash);
    if (!isCurrentValid) {
      return NextResponse.json(
        { error: "Current password does not match. Please verify your current password." },
        { status: 400 }
      );
    }

    if (!newUsername && !newPassword) {
      return NextResponse.json(
        { error: "Please provide a new username or a new password to update." },
        { status: 400 }
      );
    }

    const updates: { username?: string; password?: string } = {};

    // Validate and check new username
    if (newUsername && newUsername.trim().length > 0) {
      const cleanUsername = newUsername.trim().toLowerCase();
      if (cleanUsername !== (user.username || "").toLowerCase()) {
        const existing = await db.users.findByUsername(cleanUsername);
        if (existing && existing.id !== user.id) {
          return NextResponse.json(
            { error: "Username '" + cleanUsername + "' is already taken. Please choose another." },
            { status: 400 }
          );
        }
        updates.username = cleanUsername;
      }
    }

    // Validate new password
    if (newPassword && newPassword.trim().length > 0) {
      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: "New password must be at least 6 characters in length." },
          { status: 400 }
        );
      }
      updates.password = newPassword;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({
        success: true,
        message: "No changes were detected.",
        username: user.username || "admin",
      });
    }

    const updated = await db.users.update(user.id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Failed to update credentials in repository." }, { status: 500 });
    }

    const finalUsername = updated.username || updates.username || "admin";

    // Issue updated JWT token
    const token = await signAdminToken({
      userId: updated.id,
      username: finalUsername,
      email: updated.email,
      name: updated.name,
      role: updated.role,
    });

    const response = NextResponse.json({
      success: true,
      message: "Admin credentials successfully updated.",
      username: finalUsername,
      user: {
        id: updated.id,
        name: updated.name,
        username: finalUsername,
        email: updated.email,
        role: updated.role,
      },
    });

    // Refresh HTTP-only cookie with new claims
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("[Settings Credentials Error]", err);
    return NextResponse.json({ error: "Failed to update admin credentials." }, { status: 500 });
  }
}
