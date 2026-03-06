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

  // Role-based route protection
  if (isLoggedIn) {
    const groups = Array.isArray(req.auth?.user?.groups)
      ? (req.auth.user.groups as string[])
      : [];
    const isAdmin = groups.includes("advising-admin");
    const isAdvisor = groups.includes("advising-advisor");
    const isStudent = !isAdmin && !isAdvisor;
    const pathname = req.nextUrl.pathname;

    // Students cannot access advising-home or advising-configuration
    if (isStudent && (pathname.startsWith("/advising-home") || pathname.startsWith("/advising-configuration"))) {
      return NextResponse.redirect(new URL("/experience", req.url));
    }

    // Advisors cannot access advising-configuration
    if (isAdvisor && !isAdmin && pathname.startsWith("/advising-configuration")) {
      return NextResponse.redirect(new URL("/advising-home", req.url));
    }

    // Advisors and admins cannot access the book meeting form (student-facing)
    if ((isAdvisor || isAdmin) && pathname.startsWith("/advising-meetings/new")) {
      return NextResponse.redirect(new URL("/experience", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|images|favicon.ico).*)"],
};
