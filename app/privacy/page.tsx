import Link from "next/link";

export const metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <Link href="/" className="legal-back">← Back to Luvidra</Link>
      <p className="section-kicker">Privacy notice</p>
      <h1>Your information should stay understandable too.</h1>
      <p className="legal-date">Last updated 20 September 2026</p>
      <section><h2>What we collect</h2><p>When you join the waitlist, we collect your email address, the time you joined and limited campaign information such as the page placement or campaign source that brought you to Luvidra.</p></section>
      <section><h2>How we use it</h2><p>We use this information to manage early-access invitations, send relevant product updates and understand which launch campaigns are useful. The waitlist does not collect trading credentials, account balances or trading history.</p></section>
      <section><h2>Sharing and retention</h2><p>We do not sell waitlist information. We keep it only while it is needed for launch communication, security and legal obligations, and use service providers only where necessary to operate Luvidra.</p></section>
      <section><h2>Your choices</h2><p>You may unsubscribe from any update or ask for your waitlist information to be corrected or deleted through the contact method provided in a Luvidra message.</p></section>
      <aside>This pre-launch notice should be reviewed for each launch territory before public release.</aside>
    </main>
  );
}
