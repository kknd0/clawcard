import { ShieldAlert, ShieldCheck } from "lucide-react";

export function ProblemSolution() {
  return (
    <section className="px-6 py-20 md:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <h2 className="font-mono text-2xl font-bold tracking-tight sm:text-3xl">
            AI can code, deploy, and browse for you.
            <br />
            <span className="text-[var(--mp-text-secondary)]">
              But can it pay safely?
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[var(--mp-text-secondary)]">
            Giving AI your real credit card is like handing your wallet to a stranger. ClawCard gives it a disposable one instead.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {/* Without ClawCard */}
          <div className="rounded-2xl border border-red-500/20 p-6" style={{ background: "rgba(239, 68, 68, 0.05)" }}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
                <ShieldAlert className="h-5 w-5 text-red-400" strokeWidth={1.8} />
              </div>
              <h3 className="font-mono text-sm font-semibold text-red-400">
                Without ClawCard
              </h3>
            </div>
            <ul className="mt-4 space-y-2.5 text-[13px] leading-relaxed text-[var(--mp-text-secondary)]">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-red-400">✕</span>
                Share your real card number with AI
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-red-400">✕</span>
                No spending limits — AI could overspend
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-red-400">✕</span>
                Card details stored in chat logs
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-red-400">✕</span>
                Recurring charges you forgot about
              </li>
            </ul>
          </div>

          {/* With ClawCard */}
          <div className="rounded-2xl border border-[var(--mp-green)]/20 p-6" style={{ background: "rgba(16, 185, 129, 0.05)" }}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--mp-green)]/10">
                <ShieldCheck className="h-5 w-5 text-[var(--mp-green)]" strokeWidth={1.8} />
              </div>
              <h3 className="font-mono text-sm font-semibold text-[var(--mp-green)]">
                With ClawCard
              </h3>
            </div>
            <ul className="mt-4 space-y-2.5 text-[13px] leading-relaxed text-[var(--mp-text-secondary)]">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-[var(--mp-green)]">✓</span>
                Disposable virtual card for each purchase
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-[var(--mp-green)]">✓</span>
                Strict dollar limits — AI can&apos;t overspend
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-[var(--mp-green)]">✓</span>
                Card auto-closes after one use
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-[var(--mp-green)]">✓</span>
                Merchant-locked — only works at one store
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
