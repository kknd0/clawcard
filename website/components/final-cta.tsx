"use client";
import { ArrowRight, Copy, Check, Terminal } from "lucide-react";
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
    <section className="relative overflow-hidden border-t border-[var(--mp-border)] px-6 py-32 md:py-48 bg-[var(--mp-bg)]">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-[1000px] h-[80vw] max-h-[1000px] bg-gradient-to-r from-violet-600/20 via-fuchsia-600/10 to-cyan-600/20 rounded-full blur-[120px] pointer-events-none" style={{ animation: 'pulse-slow 6s infinite' }} />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <h2 className="font-sans text-5xl font-black tracking-tight sm:text-7xl text-white mb-6">
          Deploy in seconds.<br />
          <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent animate-text-gradient">
            Total control forever.
          </span>
        </h2>

        <p className="mx-auto max-w-xl text-lg text-slate-400 mb-10">
          Free, open-source, and ready to protect your AI&apos;s spending pipeline. Start managing virtual cards directly from your terminal today.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/docs"
            className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-bold text-black transition-all hover:bg-slate-200 hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            Read the Documentation
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <button
            onClick={handleCopy}
            className="group relative inline-flex items-center justify-center gap-3 rounded-xl border border-white/20 bg-black/60 backdrop-blur-md px-8 py-4 font-mono text-sm text-white transition-all hover:bg-white/10 hover:border-violet-500/50"
          >
            <Terminal className="h-4 w-4 text-violet-400 group-hover:text-white transition-colors" />
            <span>npx clawcard</span>
            {copied ? (
              <Check className="h-4 w-4 text-emerald-400" />
            ) : (
              <Copy className="h-4 w-4 text-slate-500 group-hover:text-white transition-colors" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
