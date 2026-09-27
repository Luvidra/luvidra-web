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

    const response = await fetchRequest(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/waitlist_entries`, {
      method: "POST",
      headers: {
        apikey: supabaseAnonKey,
        authorization: `Bearer ${supabaseAnonKey}`,
        "content-type": "application/json",
        prefer: "resolution=ignore-duplicates,return=minimal",
      },
      body: JSON.stringify({
        id: crypto.randomUUID(),
        email,
        status: "subscribed",
        placement: clean(body.placement, 24),
        source: clean(body.source),
        medium: clean(body.medium),
        campaign: clean(body.campaign),
        consented_at: new Date().toISOString(),
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Supabase waitlist insert failed", response.status, await response.text());
      return json("We couldn’t save your email. Please try again.", 503);
    }

    return json("You’re on the early-access list.");
  } catch (error) {
    console.error("Waitlist signup failed", error);
    return json("We couldn’t save your email. Please try again.", 503);
  }
}
