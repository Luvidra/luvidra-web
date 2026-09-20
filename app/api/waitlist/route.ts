import { NextRequest, NextResponse } from "next/server";
import { getDb } from "../../../db";
import { waitlistEntries } from "../../../db/schema";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown, max = 160) {
  return typeof value === "string" ? value.trim().slice(0, max) : null;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const email = clean(body.email, 254)?.toLowerCase();
    if (clean(body.website)) return NextResponse.json({ message: "You’re on the list." });
    if (!email || !emailPattern.test(email)) {
      return NextResponse.json({ message: "Enter a valid email address." }, { status: 400 });
    }

    const now = new Date();
    await getDb().insert(waitlistEntries).values({
      id: crypto.randomUUID(),
      email,
      placement: clean(body.placement, 24),
      source: clean(body.source),
      medium: clean(body.medium),
      campaign: clean(body.campaign),
      consentedAt: now,
      createdAt: now,
    }).onConflictDoNothing({ target: waitlistEntries.email });

    return NextResponse.json({ message: "You’re on the early-access list." });
  } catch (error) {
    console.error("Waitlist signup failed", error);
    return NextResponse.json({ message: "We couldn’t save your email. Please try again." }, { status: 503 });
  }
}
