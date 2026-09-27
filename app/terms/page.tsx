import Link from "next/link";

export const metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <main className="legal-page">
      <Link href="/" className="legal-back">← Back to Luvidra</Link>
      <p className="section-kicker">Early-access terms</p>
      <h1>Clear expectations for early access.</h1>
      <p className="legal-date">Last updated 20 September 2026</p>
      <section><h2>Waitlist access</h2><p>Joining the waitlist records your interest but does not guarantee an invitation, launch date, market availability or continued access. Controlled beta invitations may be limited by device, location and testing requirements.</p></section>
      <section><h2>Decision support only</h2><p>Luvidra is being developed as an analytical, educational and journaling tool. It is not financial advice, a signal service, a broker or an automated trading system. Luvidra does not place, modify or close trades.</p></section>
      <section><h2>Trading risk</h2><p>Trading involves substantial risk and losses may exceed expectations. Estimates can differ from actual execution because prices, spreads, slippage and account conditions change. You remain responsible for every trading decision.</p></section>
      <section><h2>Product changes</h2><p>Features, visuals and descriptions may change as technical, security, compliance and user testing continues.</p></section>
    </main>
  );
}
