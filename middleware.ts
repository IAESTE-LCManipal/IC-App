import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth({
  pages: {
    signIn: "/signin", // Redirecting unauthenticated users
  },
});

export function middleware(request) {
    const token = request.cookies.get("next-auth.session-token") || request.cookies.get("__Secure-next-auth.session-token");

    if (request.nextUrl.pathname === "/") {
      if (token) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } else {
        return NextResponse.redirect(new URL("/signin", request.url));
      }
    }

    return NextResponse.next();
  }


export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/profile/:path*",
    "/essentials/:path*",
    "/emergencies/:path*",
    "/nearby/:path*",
    "/profile/:path*",
    "/discounts/:path*",
    "/calendar/:path*",
  ],
};
