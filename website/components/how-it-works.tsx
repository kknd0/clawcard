"use client";
import { Download, LogIn, CreditCard } from "lucide-react";
import { useState } from "react";

const steps = [
  { icon: Download, step: "01", title: "Install", command: "npx clawcard", description: "Run directly with npx — zero global dependencies required." },
  { icon: LogIn, step: "02", title: "Login", command: "clawcard login", description: "Authenticate securely with your Privacy.com account via API." },
  { icon: CreditCard, step: "03", title: "Create Cards", command: 'clawcard burner 25 -m store.com', description: "Generate burner or reusable cards instantly from the CLI." },
];

const tabs = [
  {
    label: "CLI Workflows",
    code: `# One-time burner for a quick purchase
$ clawcard burner 49.99 -m "store.com"

# Monthly subscription card
$ clawcard create -n "Spotify" -l 16 -c subscriptions

# Freeze after payment, unfreeze next month
$ clawcard done <card-id>
$ clawcard use <card-id>`,
  },
  {
    label: "MCP Server Config",
    code: `{
  "mcpServers": {
    "clawcard": {
      "command": "npx",
      "args": ["-y", "clawcard-mcp"],
      "env": {
        "CLAWCARD_ENV": "production"
      }
    }
  }
}`,
  },
];

export function HowItWorks() {
  const [active, setActive] = useState(0);

  return (
    <section className="px-6 py-24 md:py-32 bg-[var(--mp-bg-alt)] border-t border-[var(--mp-border)] relative">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="font-sans text-3xl font-bold tracking-tight sm:text-4xl text-white">
            Up and running in 60 seconds
          </h2>
          <p className="mt-4 text-slate-400">From zero to secure AI payments.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 relative z-10">
          {steps.map((s, i) => (
            <div key={s.title} className="relative group">
              <div className="rounded-3xl border border-white/5 bg-[#0A0A0F] p-8 transition-all hover:bg-white/[0.02] hover:border-violet-500/30 h-full">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
                    <s.icon className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <span className="font-mono text-4xl font-black text-white/5 select-none">{s.step}</span>
                </div>

                <h3 className="font-sans text-lg font-bold text-white mb-3">{s.title}</h3>

                <code className="block rounded-xl px-4 py-2.5 font-mono text-[13px] text-emerald-400 bg-black/50 border border-white/5 mb-4">
                  $ {s.command}
                </code>

                <p className="text-sm leading-relaxed text-slate-400">{s.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 overflow-hidden rounded-2xl border border-white/10 bg-[#08080C] shadow-2xl">
          <div className="flex gap-1 border-b border-white/5 bg-white/[0.02] px-2 pt-2">
            {tabs.map((tab, i) => (
              <button
                key={tab.label}
                onClick={() => setActive(i)}
                className={`px-5 py-3 font-mono text-sm font-medium transition-all rounded-t-lg ${
                  active === i
                    ? "bg-[#08080C] text-violet-400 border-t border-l border-r border-white/10 relative top-[1px]"
                    : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6 overflow-x-auto">
            <pre className="font-mono text-[13px] leading-loose text-slate-300">
              <code>{tabs[active].code}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
