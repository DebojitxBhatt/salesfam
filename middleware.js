import { NextResponse } from "next/server"

export { default } from "next-auth/middleware"

export function middleware(req) {
  const path = req.nextUrl.pathname
  const isPublicPath = path === "/" || path === "/login" || path === "/signup"
  if (path.startsWith("/api/auth")) {
    return
  }
  if (
    path === "/api/signup" ||
    path === "/api/signin" ||
    path === "/api/login" ||
    path === "/api/upload" ||
    path === "/api/userExists"
  ) {
    return
  }

  const token =
    req.cookies.get("next-auth.session-token")?.value ||
    req.cookies.get("__Secure-next-auth.session-token")?.value ||
    ""

  if (isPublicPath) {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl))
    }
  } else {
    if (!token) {
      return NextResponse.redirect(new URL("/", req.nextUrl))
    }
  }
}

export const config = {
  matcher: [
    "/dashboard",
    "/login",
    "/signup",
    "/project",
    "/settings",
    "/training",
    "/contracts",
    "/project/:path*",
    "/user/:path*",
    "/client/:path*",
    "/company/:path*",
    "/add-project",
    "/sales/:path*",
    "/settings/:path*",
    "/[[...slug]]",
    "/reset-password",
    "/api/:path*",
  ],
}
