import { Code2, HardDrive, CreditCard } from "lucide-react";

const signals = [
  {
    icon: Code2,
    title: "100% Open Source",
    description:
      "MIT licensed. Every line of code is auditable on GitHub. No hidden telemetry, no data collection.",
  },
  {
    icon: HardDrive,
    title: "Local-Only Storage",
    description:
      "Your API token stays on your machine with strict file permissions. Nothing leaves your terminal.",
  },
  {
    icon: CreditCard,
    title: "Powered by Privacy.com",
    description:
      "Built on Privacy.com's trusted API. Your real card details are never shared with merchants.",
  },
];

export function TrustSignals() {
  return (
    <section className="border-t border-[var(--mp-border)] px-6 py-20 md:py-24" style={{ background: "var(--mp-bg-alt)" }}>
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--mp-violet)]">
            Trust
          </p>
          <h2 className="mt-2 font-mono text-2xl font-bold tracking-tight sm:text-3xl">
            Security you can verify
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {signals.map((signal) => (
            <div
              key={signal.title}
              className="rounded-2xl border border-[var(--mp-border)] p-6 text-center"
              style={{ background: "var(--mp-bg-card)" }}
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--mp-violet)]/10">
                <signal.icon className="h-6 w-6 text-[var(--mp-violet)]" strokeWidth={1.5} />
              </div>
              <h3 className="mt-4 font-mono text-sm font-semibold text-[var(--mp-text)]">
                {signal.title}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-[var(--mp-text-secondary)]">
                {signal.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
