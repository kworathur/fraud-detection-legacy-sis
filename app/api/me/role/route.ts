import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  });

  const groups = Array.isArray(token?.groups)
    ? (token?.groups as string[])
    : [];

  return NextResponse.json({
    groups,
    isAdmin: groups.includes("advising-admin"),
  });
}
