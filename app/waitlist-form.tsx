"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

type State = "idle" | "submitting" | "success" | "error";

export function WaitlistForm({ placement }: { placement: "hero" | "footer" }) {
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const params = new URLSearchParams(window.location.search);
    setState("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          website: data.get("website"),
          placement,
          source: params.get("utm_source") ?? document.referrer ?? "direct",
          medium: params.get("utm_medium"),
          campaign: params.get("utm_campaign"),
        }),
      });
      const result = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(result.message || "Please try again.");
      setState("success");
      setMessage(result.message || "You’re on the list.");
      form.reset();
      window.dispatchEvent(new CustomEvent("luvidra:waitlist_joined", { detail: { placement } }));
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Please try again.");
    }
  }

  if (state === "success") {
    return (
      <div className="form-success" role="status">
        <CheckCircle2 size={22} aria-hidden="true" />
        <div><strong>{message}</strong><span>We’ll keep the updates useful and infrequent.</span></div>
      </div>
    );
  }

  return (
    <form className="waitlist-form" onSubmit={submit} noValidate>
      <div className="email-row">
        <label className="sr-only" htmlFor={`email-${placement}`}>Email address</label>
        <input id={`email-${placement}`} name="email" type="email" inputMode="email" autoComplete="email" placeholder="Enter your email address" maxLength={254} required disabled={state === "submitting"} />
        <input className="honeypot" name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <button type="submit" disabled={state === "submitting"}>
          {state === "submitting" ? "Joining…" : "Join the waitlist"}
          {state !== "submitting" && <ArrowRight size={17} aria-hidden="true" />}
        </button>
      </div>
      <p className={`form-message ${state === "error" ? "form-error" : ""}`} aria-live="polite">
        {message || (
          <>
            Product updates and beta invitations. Unsubscribe anytime. See our <a href="/privacy">Privacy Notice</a>.
          </>
        )}
      </p>
    </form>
  );
}
