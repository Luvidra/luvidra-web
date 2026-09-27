const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const defaultSupabaseUrl = "https://ofteiknckroosldvgvsi.supabase.co";
const defaultSupabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mdGVpa25ja3Jvb3NsZHZndnNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwODkzMjUsImV4cCI6MjEwNTY2NTMyNX0.lHdpPCEVA1az5Dita4HBc1PegPMQ_9mcgez0i362V8U";

function clean(value: unknown, max = 160) {
  return typeof value === "string" ? value.trim().slice(0, max) : null;
}

function json(message: string, status = 200) {
  return Response.json({ message }, { status });
}

async function requestFingerprint(request: Request, secret: string | undefined) {
  const forwardedFor =
    request.headers.get("x-vercel-forwarded-for") ??
    request.headers.get("x-forwarded-for") ??
    "";
  const ip = forwardedFor.split(",")[0]?.trim();
  if (!ip || !secret) throw new Error("Waitlist rate-limit configuration is missing.");

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(ip));
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function handleWaitlistRequest(
  request: Request,
  fetchRequest: typeof fetch = fetch,
) {
  try {
    const contentLength = Number(request.headers.get("content-length") ?? 0);
    if (contentLength > 10_000) return json("Request is too large.", 413);

    const body = (await request.json()) as Record<string, unknown>;
    const email = clean(body.email, 254)?.toLowerCase();
    if (clean(body.website)) return json("Unable to process signup.", 400);
    if (!email || !emailPattern.test(email)) return json("Enter a valid email address.", 400);

    const supabaseUrl = process.env.SUPABASE_URL ?? defaultSupabaseUrl;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY ?? defaultSupabaseAnonKey;
    const fingerprint = await requestFingerprint(request, process.env.WAITLIST_RATE_LIMIT_SECRET);

    const response = await fetchRequest(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/rpc/join_waitlist`, {
      method: "POST",
      headers: {
        apikey: supabaseAnonKey,
        authorization: `Bearer ${supabaseAnonKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        p_id: crypto.randomUUID(),
        p_email: email,
        p_fingerprint: fingerprint,
        p_placement: clean(body.placement, 24),
        p_source: clean(body.source),
        p_medium: clean(body.medium),
        p_campaign: clean(body.campaign),
        p_consented_at: new Date().toISOString(),
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Supabase waitlist insert failed", response.status, await response.text());
      return json("We couldn’t save your email. Please try again.", 503);
    }

    const result = (await response.json()) as unknown;
    if (result === "rate_limited") {
      return json("Too many attempts. Please try again in 15 minutes.", 429);
    }
    if (result !== "accepted") {
      console.error("Unexpected Supabase waitlist response", result);
      return json("We couldn’t save your email. Please try again.", 503);
    }

    return json("You’re on the early-access list.");
  } catch (error) {
    console.error("Waitlist signup failed", error);
    return json("We couldn’t save your email. Please try again.", 503);
  }
}
