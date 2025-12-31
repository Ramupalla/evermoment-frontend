// // import { NextResponse } from "next/server";
// // import type { NextRequest } from "next/server";

// // export function middleware(req: NextRequest) {
// //   const { pathname, searchParams } = req.nextUrl;

// //   // 🔐 Protect admin routes
// //   if (pathname.startsWith("/admin")) {
// //     const secret = searchParams.get("secret");

// //     if (secret !== process.env.NEXT_PUBLIC_ADMIN_SECRET) {
// //       // ❌ Invalid or missing secret → kick to home
// //       return NextResponse.redirect(new URL("/", req.url));
// //     }
// //   }

// //   // ✅ Allow everything else
// //   return NextResponse.next();
// // }

// // export const config = {
// //   matcher: ["/admin/:path*"],
// // };


// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   // Protect all admin routes
//   if (pathname.startsWith("/admin")) {
//     const secret = req.cookies.get("admin_auth")?.value;

//     if (secret !== process.env.NEXT_PUBLIC_ADMIN_SECRET) {
//       return NextResponse.redirect(new URL("/", req.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/admin/:path*"],
// };


import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ❌ DO NOT block admin routes
  return NextResponse.next();
}
