import { NextResponse } from "next/server";

// Auth temporarily disabled: dashboard is fully public.
export function middleware() {
  return NextResponse.next();
}
