import { NextResponse } from "next/server";

const buckets = new Map<string, { start: number; count: number }>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;

export async function POST(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const key = forwarded || "unknown";
  const now = Date.now();
  const bucket = buckets.get(key);
  if (bucket && now - bucket.start < WINDOW_MS && bucket.count >= MAX_REQUESTS) {
    return NextResponse.json({ error: "Please wait a minute before sending another enquiry." }, { status: 429 });
  }
  if (!bucket || now - bucket.start >= WINDOW_MS) buckets.set(key, { start: now, count: 1 });
  else bucket.count += 1;

  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request body." }, { status: 400 }); }
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Please provide your contact details." }, { status: 400 });
  const { name, email, message } = body as Record<string, unknown>;
  if (typeof name !== "string" || name.trim().length < 2 || name.length > 100 ||
      typeof email !== "string" || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      typeof message !== "string" || message.trim().length < 10 || message.length > 2000) {
    return NextResponse.json({ error: "Enter a valid name, email, and message (10–2,000 characters)." }, { status: 400 });
  }
  // Explicit demo behavior: no database or email provider is configured, so never claim this was delivered.
  return NextResponse.json({
    mode: "demo",
    message: "Your form passed validation, but this demo is not connected to an inbox. Configure a backend email/database provider before using this form for real enquiries."
  }, { status: 202 });
}
