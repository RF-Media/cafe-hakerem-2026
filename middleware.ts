import { NextRequest, NextResponse } from "next/server";

// Pre-launch site gate. No-ops if BASIC_AUTH_USER/BASIC_AUTH_PASSWORD are
// unset, so removing the two env vars in Vercel is how this gets switched
// off at launch — no code change or redeploy needed.
export function middleware(req: NextRequest) {
  const user = process.env.BASIC_AUTH_USER;
  const pass = process.env.BASIC_AUTH_PASSWORD;

  if (!user || !pass) return NextResponse.next();

  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Basic ")) {
    const decoded = atob(auth.slice(6));
    const separatorIndex = decoded.indexOf(":");
    const inputUser = decoded.slice(0, separatorIndex);
    const inputPass = decoded.slice(separatorIndex + 1);
    if (inputUser === user && inputPass === pass) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Cafe Hakerem"' },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
