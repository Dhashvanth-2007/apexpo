import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "apexpo_production_jwt_secret_key_change_in_production_2027";
const secretKey = new TextEncoder().encode(JWT_SECRET);
export const AUTH_COOKIE_NAME = "apexpo_admin_token";

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export interface AdminPayload {
  userId: string;
  username?: string;
  email: string;
  name: string;
  role: string;
}

export async function signAdminToken(payload: AdminPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
}

export async function verifyAdminToken(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as unknown as AdminPayload;
  } catch {
    return null;
  }
}

export async function getCurrentAdmin(): Promise<AdminPayload | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyAdminToken(token);
  } catch {
    return null;
  }
}

export async function requireAdmin(allowedRoles?: string[]): Promise<
  { success: true; admin: AdminPayload } | { success: false; status: number; error: string }
> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { success: false, status: 401, error: "Unauthorized: Please log in as an administrator." };
  }
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(admin.role)) {
    return { success: false, status: 403, error: `Forbidden: Requires ${allowedRoles.join(" or ")} privilege.` };
  }
  return { success: true, admin };
}

