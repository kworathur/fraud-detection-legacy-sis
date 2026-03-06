import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const groups = Array.isArray(token?.groups)
    ? (token?.groups as string[])
    : [];

  return NextResponse.json({
    sub: token?.sub ?? null,
    name: (token?.name as string) ?? null,
    email: (token?.email as string) ?? null,
    groups,
    isAdmin: groups.includes("advising-admin"),
  });
}
