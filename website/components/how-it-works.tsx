"use client";

import { Download, LogIn, CreditCard } from "lucide-react";
import { useState } from "react";

const steps = [
  {
    icon: Download,
    step: "01",
    title: "Install",
    command: "npx clawcard",
    description: "Run directly with npx — no global install required.",
  },
  {
    icon: LogIn,
    step: "02",
    title: "Login",
    command: "clawcard login",
    description: "Authenticate with your Privacy.com account via email.",
  },
  {
    icon: CreditCard,
    step: "03",
    title: "Create cards",
    command: 'clawcard burner 25 -m store.com',
    description: "Create burner or reusable cards in one command.",
  },
];

const tabs = [
  {
    label: "CLI",
    code: `$ clawcard burner 49.99 -m "store.com"
$ clawcard create -n "Spotify" -l 16 -c subscriptions

# Freeze after payment, unfreeze next month
$ clawcard done <card-id>
$ clawcard use <card-id>`,
  },
  {
    label: "MCP Config",
    code: `{
  "mcpServers": {
    "clawcard": {
      "command": "npx",
      "args": ["clawcard-mcp"]
    }
  }
}`,
  },
  {
    label: "Skill",
    code: `$ npx skills add kknd0/clawcard

# Then ask Claude:
# "Create a $20 burner for digitalocean.com"
# "Show my active cards"
# "Freeze the Netflix card"`,
  },
];

export function HowItWorks() {
  const [active, setActive] = useState(0);

  return (
    <section className="border-t border-[var(--mp-border)] px-6 py-20 md:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--mp-violet)]">
            How it works
          </p>
          <h2 className="mt-2 font-mono text-2xl font-bold tracking-tight sm:text-3xl">
            Up and running in 60 seconds
          </h2>
        </div>

        {/* 3 steps */}
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="relative">
              {/* Connector line (desktop) */}
              {i < steps.length - 1 && (
                <div className="absolute -right-3 top-10 z-10 hidden md:block">
                  <div className="h-px w-6 bg-gradient-to-r from-[var(--mp-violet)] to-[var(--mp-pink)]" />
                </div>
              )}

              <div className="rounded-2xl border border-[var(--mp-border)] p-6" style={{ background: "var(--mp-bg-card)" }}>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--mp-violet)]/20 to-[var(--mp-pink)]/20">
                    <s.icon className="h-5 w-5 text-[var(--mp-violet)]" strokeWidth={1.8} />
                  </div>
                  <span className="bg-gradient-to-r from-[var(--mp-violet)] to-[var(--mp-pink)] bg-clip-text font-mono text-[11px] font-bold text-transparent">
                    {s.step}
                  </span>
                </div>

                <h3 className="mt-4 font-mono text-sm font-semibold text-[var(--mp-text)]">
                  {s.title}
                </h3>

                <code className="mt-2 block rounded-lg px-3 py-2 font-mono text-[12px] text-[var(--mp-green)]" style={{ background: "var(--mp-bg)" }}>
                  $ {s.command}
                </code>

                <p className="mt-3 text-[13px] leading-relaxed text-[var(--mp-text-secondary)]">
                  {s.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabbed code block (absorbed from Quickstart) */}
        <div className="mt-10 overflow-hidden rounded-2xl border border-[var(--mp-border)] shadow-xl shadow-[var(--mp-violet)]/5" style={{ background: "var(--mp-bg-card)" }}>
          {/* Tab bar */}
          <div className="flex gap-px border-b border-[var(--mp-border)]" style={{ background: "var(--mp-bg-hover)" }}>
            {tabs.map((tab, i) => (
              <button
                key={tab.label}
                onClick={() => setActive(i)}
                className={`flex-1 px-4 py-2.5 font-mono text-[12px] font-medium transition ${
                  active === i
                    ? "text-[var(--mp-violet)] bg-[var(--mp-bg-card)]"
                    : "text-[var(--mp-text-muted)] hover:text-[var(--mp-text-secondary)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Code */}
          <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-[1.8] text-[var(--mp-text-secondary)]">
            {tabs[active].code}
          </pre>
        </div>
      </div>
    </section>
  );
}
