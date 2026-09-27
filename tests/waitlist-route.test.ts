import assert from "node:assert/strict";
import test from "node:test";

import { handleWaitlistRequest } from "../lib/waitlist-handler.ts";

function request(body: Record<string, unknown>) {
  return new Request("http://localhost/api/waitlist", {
    method: "POST",
    headers: { "content-type": "application/json" },
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
    assert.equal(row.email, "new.user@example.com");
    assert.equal(row.status, "subscribed");
    return new Response(null, { status: 201 });
  }, async () => {
    const response = await handleWaitlistRequest(request({ email: " New.User@Example.com ", placement: "hero" }));
    assert.equal(response.status, 200);
    assert.equal((await response.json()).message, "You’re on the early-access list.");
  });
});

test("accepts a duplicate when the database confirms conflict-ignore success", async () => {
  await withFetch(async (_input, init) => {
    assert.match(String(new Headers(init?.headers).get("prefer")), /resolution=ignore-duplicates/);
    return new Response(null, { status: 201 });
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

test("reports a network failure as a failure", async () => {
  await withFetch(async () => {
    throw new TypeError("network unavailable");
  }, async () => {
    const response = await handleWaitlistRequest(request({ email: "valid@example.com" }));
    assert.equal(response.status, 503);
  });
});
