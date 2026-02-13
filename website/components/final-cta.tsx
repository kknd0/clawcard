"use client";

import { ArrowRight, Copy, Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function FinalCTA() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("npx clawcard");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative overflow-hidden px-6 py-24 md:py-32">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 glow-center" />

      <div className="relative mx-auto max-w-2xl text-center">
        <h2 className="font-mono text-3xl font-bold tracking-tight sm:text-4xl">
          Start in seconds.
          <br />
          <span className="bg-gradient-to-r from-[var(--mp-violet)] to-[var(--mp-pink)] bg-clip-text text-transparent">
            Stay in control.
          </span>
        </h2>

        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[var(--mp-text-secondary)]">
          Free, open-source, and ready to protect your AI&apos;s spending in one command.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/docs"
            className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--mp-violet)] to-[var(--mp-pink)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--mp-violet)]/25 transition hover:shadow-xl hover:shadow-[var(--mp-violet)]/30"
          >
            Get Started
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>

          <button
            onClick={handleCopy}
            className="group flex items-center gap-3 rounded-xl border border-[var(--mp-border)] bg-[var(--mp-bg-card)] px-5 py-3 font-mono text-sm shadow-lg shadow-black/20 transition hover:border-[var(--mp-violet)]/30"
          >
            <span className="text-[var(--mp-text-muted)]">$</span>
            <span className="text-[var(--mp-text)]">npx clawcard</span>
            {copied ? (
              <Check className="h-3.5 w-3.5 text-[var(--mp-green)]" />
            ) : (
              <Copy className="h-3.5 w-3.5 text-[var(--mp-text-muted)] transition group-hover:text-[var(--mp-text-secondary)]" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
