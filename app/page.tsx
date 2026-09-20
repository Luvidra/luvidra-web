import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Check,
  Eye,
  LockKeyhole,
  ScanSearch,
  ShieldCheck,
} from "lucide-react";
import { WaitlistForm } from "./waitlist-form";

const principles = [
  ["Evidence-linked", "Trace insight back to what changed."],
  ["Risk-first", "See exposure before making a decision."],
  ["Behaviour-aware", "Review your process, not only P&L."],
  ["Trader-controlled", "Luvidra observes. You decide."],
];

const features = [
  {
    icon: ScanSearch,
    eyebrow: "01 · REVIEW",
    title: "Bring your plan into view",
    body: "Explain your setup in your own words. Luvidra organises the plan around direction, entry, stop and invalidation.",
  },
  {
    icon: Eye,
    eyebrow: "02 · ASSESS",
    title: "See the evidence clearly",
    body: "Compare your thesis with current market structure, including what supports it, what contradicts it and what remains uncertain.",
  },
  {
    icon: ShieldCheck,
    eyebrow: "03 · UNDERSTAND",
    title: "Know the risk before acting",
    body: "Turn lot size, entry and stop into an understandable estimate of loss, percentage risk and total exposure.",
  },
  {
    icon: BookOpen,
    eyebrow: "04 · LEARN",
    title: "Build a decision record",
    body: "Save the plan, evidence, risk assessment and your final choice in a journal designed for honest review.",
  },
];

function Logo() {
  return (
    <span className="brand-lockup" aria-label="Luvidra">
      <span aria-hidden="true" className="brand-mark"><span /></span>
      <span className="brand-name">LUVIDRA</span>
    </span>
  );
}

export default function Home() {
  return (
    <main>
      <nav className="nav-shell" aria-label="Primary navigation">
        <Link href="#top" className="logo-link" aria-label="Luvidra home"><Logo /></Link>
        <div className="nav-links" aria-label="Page sections">
          <Link href="#product">Product</Link>
          <Link href="#how-it-works">How it works</Link>
          <Link href="#trust">Trust</Link>
        </div>
        <Link href="#join" className="nav-cta">Join the waitlist <ArrowRight size={16} aria-hidden="true" /></Link>
      </nav>

      <section className="hero" id="top">
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-copy">
          <div className="status-pill"><span aria-hidden="true" /> Private beta in development</div>
          <h1>See the risk.<br /><em>Trade clearer.</em></h1>
          <p className="hero-lead">
            Luvidra is an intelligent trading copilot that helps self-directed
            traders review their plan, understand risk and learn from every
            decision—without placing the trade for them.
          </p>
          <div id="join" className="form-anchor"><WaitlistForm placement="hero" /></div>
          <p className="hero-note">Early access will begin with Boom 1000 and Crash 1000 on Deriv MT5.</p>
        </div>

        <div className="product-stage" aria-label="Luvidra mobile product preview">
          <div className="stage-orbit orbit-one" aria-hidden="true" />
          <div className="stage-orbit orbit-two" aria-hidden="true" />
          <div className="prototype-label">Product prototype</div>
          <div className="phone-shell">
            <div className="phone-speaker" aria-hidden="true" />
            <Image
              src="/luvidra-home.png"
              alt="Luvidra home screen prototype showing account status, risk context and a review insight"
              width={852}
              height={1792}
              priority
              sizes="(max-width: 900px) 74vw, 390px"
            />
          </div>
          <div className="clarity-card clarity-card-top"><span>Mode</span><strong>Trader controlled</strong></div>
          <div className="clarity-card clarity-card-bottom"><span>Focus</span><strong>Evidence + risk</strong></div>
        </div>
      </section>

      <section className="principles" aria-label="Luvidra product principles">
        {principles.map(([title, body], index) => (
          <article key={title}><span>0{index + 1}</span><div><h2>{title}</h2><p>{body}</p></div></article>
        ))}
      </section>

      <section className="problem-section" id="product">
        <div className="section-kicker">Clarity, not prediction</div>
        <div className="problem-grid">
          <h2>Charts show movement. Luvidra helps you understand what it means for your plan.</h2>
          <div className="problem-copy">
            <p>Most trading tools stop at price, balance and profit or loss. The harder questions remain: Is the thesis supported? What would the stop cost? Is total exposure still within the limit?</p>
            <p>Luvidra connects market evidence, deterministic risk calculations and decision journaling in one calm review flow.</p>
          </div>
        </div>
      </section>

      <section className="workflow-section" id="how-it-works">
        <div className="section-heading">
          <div><span className="section-kicker">One deliberate workflow</span><h2>From idea to informed decision.</h2></div>
          <p>Luvidra keeps analysis, risk and reflection connected—while every trading action remains in your hands.</p>
        </div>
        <div className="feature-grid">
          {features.map(({ icon: Icon, eyebrow, title, body }) => (
            <article className="feature-card" key={title}>
              <div className="feature-topline"><Icon size={24} strokeWidth={1.6} aria-hidden="true" /><span>{eyebrow}</span></div>
              <h3>{title}</h3><p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="trust-section" id="trust">
        <div className="trust-visual" aria-hidden="true">
          <div className="aperture-core" /><div className="beam beam-one" /><div className="beam beam-two" /><div className="beam beam-three" />
        </div>
        <div className="trust-copy">
          <span className="section-kicker">Designed around your control</span>
          <h2>Support for the decision. Never control of the account.</h2>
          <div className="trust-list">
            <div><LockKeyhole size={22} aria-hidden="true" /><p><strong>Read-only account connection</strong>Luvidra is being designed around MT5 investor access, separate from the password used to trade.</p></div>
            <div><Check size={22} aria-hidden="true" /><p><strong>No automated execution</strong>Luvidra cannot place, modify or close a trade. Decisions and execution stay with you.</p></div>
            <div><ShieldCheck size={22} aria-hidden="true" /><p><strong>Honest data states</strong>Estimates, synchronized information, stale data and uncertainty are labelled instead of being presented as certainty.</p></div>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <div><span className="section-kicker">Before you join</span><h2>Good questions deserve direct answers.</h2></div>
        <div className="faq-list">
          <details><summary>Is Luvidra a signal service?</summary><p>No. Luvidra helps you examine your own plan, current evidence and risk. It does not tell you what to trade or promise an outcome.</p></details>
          <details><summary>Will Luvidra execute trades?</summary><p>No. Luvidra is a decision-support and journaling product. Trades remain manually controlled and executed by you in MT5.</p></details>
          <details><summary>Which markets are included first?</summary><p>The initial controlled beta is focused on Boom 1000 and Crash 1000 synthetic indices through Deriv and MT5.</p></details>
          <details><summary>When will early access begin?</summary><p>Access will open in small groups after technical, security and product-safety checks. Waitlist members will receive progress and invitation updates.</p></details>
        </div>
      </section>

      <section className="final-cta">
        <div><span className="section-kicker">Possibility begins with vision</span><h2>Build a clearer trading process.</h2><p>Join the waitlist for product updates and controlled beta access.</p></div>
        <WaitlistForm placement="footer" />
      </section>

      <footer>
        <Logo />
        <p>Luvidra provides analytical and educational decision support. It is not financial advice and does not guarantee trading outcomes.</p>
        <div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><span>© 2026 Luvidra</span></div>
      </footer>
    </main>
  );
}
