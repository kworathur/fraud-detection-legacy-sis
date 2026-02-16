import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnLogin = req.nextUrl.pathname === "/login";
  const isAuthRoute = req.nextUrl.pathname.startsWith("/api/auth");

  // Allow auth API routes through
  if (isAuthRoute) {
    return NextResponse.next();
  }

  // Redirect authenticated users away from the login page
  if (isOnLogin && isLoggedIn) {
    return NextResponse.redirect(new URL("/experience", req.url));
  }

  // Redirect unauthenticated users to the login page
  if (!isLoggedIn && !isOnLogin) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|images|favicon.ico).*)"],
};
