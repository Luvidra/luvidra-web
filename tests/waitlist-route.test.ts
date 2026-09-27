import assert from "node:assert/strict";
import test from "node:test";

import { handleWaitlistRequest } from "../lib/waitlist-handler.ts";

process.env.WAITLIST_RATE_LIMIT_SECRET = "test-only-rate-limit-secret";

function request(body: Record<string, unknown>) {
  return new Request("http://localhost/api/waitlist", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-vercel-forwarded-for": "203.0.113.10",
    },
    body: JSON.stringify(body),
  });
}

async function withFetch(
  replacement: typeof fetch,
  run: () => Promise<void>,
) {
  const original = globalThis.fetch;
  globalThis.fetch = replacement;
  try {
    await run();
  } finally {
    globalThis.fetch = original;
  }
}

test("persists a normalized valid email before reporting success", async () => {
  await withFetch(async (_input, init) => {
    const row = JSON.parse(String(init?.body));
    assert.equal(row.p_email, "new.user@example.com");
    assert.match(row.p_fingerprint, /^[a-f0-9]{64}$/);
    assert.notEqual(row.p_fingerprint, "203.0.113.10");
    assert.match(String(_input), /\/rest\/v1\/rpc\/join_waitlist$/);
    return Response.json("accepted");
  }, async () => {
    const response = await handleWaitlistRequest(request({ email: " New.User@Example.com ", placement: "hero" }));
    assert.equal(response.status, 200);
    assert.equal((await response.json()).message, "You’re on the early-access list.");
  });
});

test("accepts a duplicate when the database function confirms success", async () => {
  await withFetch(async () => {
    return Response.json("accepted");
  }, async () => {
    const response = await handleWaitlistRequest(request({ email: "existing@example.com" }));
    assert.equal(response.status, 200);
  });
});

for (const [name, email] of [["empty", ""], ["malformed", "not-an-email"]] as const) {
  test(`rejects ${name} email without contacting the database`, async () => {
    await withFetch(async () => {
      throw new Error("fetch should not be called");
    }, async () => {
      const response = await handleWaitlistRequest(request({ email }));
      assert.equal(response.status, 400);
    });
  });
}

test("does not report honeypot submissions as successful", async () => {
  const response = await handleWaitlistRequest(request({ email: "bot@example.com", website: "spam" }));
  assert.equal(response.status, 400);
});

test("reports a database rejection as a failure", async () => {
  await withFetch(async () => new Response("policy rejected", { status: 403 }), async () => {
    const response = await handleWaitlistRequest(request({ email: "valid@example.com" }));
    assert.equal(response.status, 503);
  });
});

test("reports database rate limiting without claiming success", async () => {
  await withFetch(async () => Response.json("rate_limited"), async () => {
    const response = await handleWaitlistRequest(request({ email: "valid@example.com" }));
    assert.equal(response.status, 429);
    assert.match((await response.json()).message, /15 minutes/);
  });
});

test("reports a network failure as a failure", async () => {
  await withFetch(async () => {
    throw new TypeError("network unavailable");
  }, async () => {
    const response = await handleWaitlistRequest(request({ email: "valid@example.com" }));
    assert.equal(response.status, 503);
  });
});
