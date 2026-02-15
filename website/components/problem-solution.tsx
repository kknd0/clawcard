import { ShieldAlert, ShieldCheck } from "lucide-react";

export function ProblemSolution() {
  return (
    <section className="px-6 py-24 md:py-32 relative bg-[var(--mp-bg)] overflow-hidden border-t border-[var(--mp-border)]">
      <div className="mx-auto max-w-5xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-sans text-3xl font-bold tracking-tight sm:text-4xl text-white">
            AI can code, deploy, and browse.
            <br />
            <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              But can it pay safely?
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-400 leading-relaxed">
            Giving AI your real credit card is like handing an unlocked wallet to a stranger.
            ClawCard puts a secure, programmatic airgap between your money and your agent.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl border border-red-500/20 bg-[#0A0505] p-8 shadow-[0_0_40px_rgba(239,68,68,0.05)] group">
            <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-500/20 rounded-full blur-[60px]" />

            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20">
                <ShieldAlert className="h-6 w-6 text-red-500" strokeWidth={1.5} />
              </div>
              <h3 className="font-sans text-xl font-bold text-red-100">Without ClawCard</h3>
            </div>

            <ul className="space-y-4 relative z-10">
              {[
                "Share your real card number directly with AI",
                "No hard spending limits — AI can hallucinate and overspend",
                "Card details permanently stored in API chat logs",
                "Forgotten recurring charges bleed your account"
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                  <span className="flex-shrink-0 mt-0.5 h-5 w-5 flex items-center justify-center rounded-full bg-red-500/10 text-red-400 text-xs border border-red-500/20 font-bold">✕</span>
                  <span className="leading-relaxed">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-[var(--mp-green)]/30 bg-[#050A08] p-8 shadow-[0_0_40px_rgba(16,185,129,0.05)] group">
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--mp-green)]/5 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
            <div className="scanline-effect opacity-50" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[var(--mp-green)]/20 rounded-full blur-[60px]" />

            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--mp-green)]/10 border border-[var(--mp-green)]/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <ShieldCheck className="h-6 w-6 text-[var(--mp-green)]" strokeWidth={1.5} />
              </div>
              <h3 className="font-sans text-xl font-bold text-emerald-100">With ClawCard</h3>
            </div>

            <ul className="space-y-4 relative z-10">
              {[
                "Disposable virtual card generated uniquely per purchase",
                "Strict dollar limits — physically impossible to overspend",
                "Card auto-closes and self-destructs after one use",
                "Merchant-locked — only works at the target store"
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                  <span className="flex-shrink-0 mt-0.5 h-5 w-5 flex items-center justify-center rounded-full bg-[var(--mp-green)]/10 text-[var(--mp-green)] text-xs border border-[var(--mp-green)]/20 font-bold">✓</span>
                  <span className="leading-relaxed">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
