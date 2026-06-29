import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "eventsync-dev-secret";

export async function POST(request: NextRequest) {
  let body: { username: string; password: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { username, password } = body;
  if (!username || !password) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = jwt.sign(
    { sub: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: "24h" }
  );

  return NextResponse.json({
    token,
    id: user.id,
    username: user.username,
    fullName: user.fullName ?? user.username,
    role: user.role,
  });
}