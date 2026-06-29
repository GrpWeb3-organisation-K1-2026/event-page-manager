import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "eventsync-dev-secret";
const WRITE_METHODS = ["POST", "PATCH", "PUT", "DELETE"];

const PUBLIC_WRITE_ROUTES = [
  "/api/auth",
  "/api/sessions",
  "/api/questions",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const needsAuth =
    WRITE_METHODS.includes(request.method) &&
    pathname.startsWith("/api/") &&
    !PUBLIC_WRITE_ROUTES.some((r) => pathname.startsWith(r));

  if (!needsAuth) return NextResponse.next();

  const auth = request.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    jwt.verify(token, JWT_SECRET);
    return NextResponse.next();
  } catch {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: ["/api/:path*"],
};