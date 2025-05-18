import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// This part handles unauthenticated users
export default withAuth({
  pages: {
    signIn: "/signin",
  },
});

// role-based protection
export async function middleware(request: any) {
  // This gets the JWT token (works for both secure and non-secure cookies)
  const token =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;

  // Root path redirect logic (updated)
  if (request.nextUrl.pathname === "/") {
    if (!token) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
    // Get the decoded JWT to access the user's role
    const session = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!session) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
    if (session.role === "intern") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (session.role === "lc") {
      return NextResponse.redirect(new URL("/lc-dashboard", request.url));
    }
    // Default fallback
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // If not authenticated, let withAuth handle redirect
  if (!token) {
    return NextResponse.next();
  }

  // Get the decoded JWT to access the user's role
  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // If for some reason session is missing, let withAuth handle redirect
  if (!session) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  // Role-based page protection
  // Interns: allow only dashboard, profile, essentials, emergencies, nearby, discounts, calendar
  if (
    session.role === "intern" &&
    !(
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/profile") ||
      pathname.startsWith("/essentials") ||
      pathname.startsWith("/emergencies") ||
      pathname.startsWith("/nearby") ||
      pathname.startsWith("/discounts") ||
      pathname.startsWith("/calendar")
    )
  ) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // LCs: allow only lc-dashboard and their related pages (customize as needed)
  if (
    session.role === "lc" &&
    !(
      pathname.startsWith("/lc-dashboard") ||
      pathname.startsWith("/profile") // If LCs have profile, keep this
      // Add more LC-specific pages as needed
    )
  ) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // Admins: allow only admin-dashboard and their related pages (customize as needed)
  if (
    session.role === "admin" &&
    !(
      pathname.startsWith("/admin-dashboard")
      // Add more admin-specific pages as needed
    )
  ) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/lc-dashboard/:path*",
    "/profile/:path*",
    "/essentials/:path*",
    "/emergencies/:path*",
    "/nearby/:path*",
    "/discounts/:path*",
    "/calendar/:path*",
    "/admin-dashboard/:path*", // Add admin dashboard to matcher
  ],
};
