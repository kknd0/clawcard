import {
  Zap,
  PackageOpen,
  Bot,
  TerminalSquare,
  CreditCard,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "One-command workflow",
    description:
      "Create a card, make a payment, and freeze it — all in a single pipeline.",
  },
  {
    icon: PackageOpen,
    title: "No installation needed",
    description:
      "Run directly with npx. No global install, no setup, no config files.",
  },
  {
    icon: Bot,
    title: "AI-ready with MCP",
    description:
      "Built-in MCP server lets Claude and other AI tools manage your cards.",
  },
  {
    icon: TerminalSquare,
    title: "14 CLI commands",
    description:
      "Full card lifecycle — create, list, show, update, freeze, unfreeze, and close.",
  },
  {
    icon: CreditCard,
    title: "Burner & reusable cards",
    description:
      "Single-use burners for one-time purchases, reusable cards for subscriptions.",
  },
  {
    icon: ShieldCheck,
    title: "Secure by default",
    description:
      "Tokens stored locally with 0600 permissions. No cloud, no env vars, no logs.",
  },
];

export function Features() {
  return (
    <section id="features" className="border-t border-[var(--mp-border)] px-6 py-20 md:py-24" style={{ background: "var(--mp-bg-alt)" }}>
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--mp-violet)]">
            Features
          </p>
          <h2 className="mt-2 font-mono text-2xl font-bold tracking-tight sm:text-3xl">
            Built for AI. Secured by you.
          </h2>
          <p className="mt-3 text-sm text-[var(--mp-text-secondary)]">
            Manage virtual cards the way developers work — from the terminal.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-[var(--mp-border)] p-6 transition duration-200 hover:border-[var(--mp-violet)]/30 hover:shadow-lg hover:shadow-[var(--mp-violet)]/5"
              style={{ background: "var(--mp-bg-card)" }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--mp-violet)]/10 transition group-hover:bg-[var(--mp-violet)]/20">
                <feature.icon className="h-5 w-5 text-[var(--mp-violet)]" strokeWidth={1.8} />
              </div>
              <h3 className="mt-4 font-mono text-sm font-semibold text-[var(--mp-text)]">
                {feature.title}
              </h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--mp-text-secondary)]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
