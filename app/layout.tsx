import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://luvidra.onwordistevn.chatgpt.site"),
  title: { default: "Luvidra — See further. Trade clearer.", template: "%s · Luvidra" },
  description: "Luvidra is an intelligent trading copilot for clearer plan review, risk understanding and decision journaling.",
  keywords: ["trading copilot", "risk management", "trading journal", "Deriv", "MT5"],
  other: { "codex-preview": "development" },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "Luvidra — See further. Trade clearer.",
    description: "Review your plan, understand the risk and learn from every trading decision.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
