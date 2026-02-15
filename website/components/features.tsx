"use client";
import React, { useRef, useState } from "react";
import { Zap, PackageOpen, Bot, TerminalSquare, CreditCard, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "One-command workflow",
    description: "Create a card, make a payment, and freeze it — all in a single elegant CLI pipeline.",
    colSpan: "md:col-span-2",
  },
  {
    icon: ShieldCheck,
    title: "Secure by default",
    description: "Tokens stored locally (0600). No cloud, no logs.",
    colSpan: "md:col-span-1",
  },
  {
    icon: PackageOpen,
    title: "Zero installation",
    description: "Run instantly with npx. No global pollutions or config files.",
    colSpan: "md:col-span-1",
  },
  {
    icon: Bot,
    title: "MCP Server Built-in",
    description: "Claude Code and other MCP-compatible tools can manage cards via natural language.",
    colSpan: "md:col-span-2",
  },
  {
    icon: TerminalSquare,
    title: "14 Powerful Commands",
    description: "Total lifecycle management right from your shell.",
    colSpan: "md:col-span-1",
  },
  {
    icon: CreditCard,
    title: "Burners & Subscriptions",
    description: "Single-use for safety, or recurring caps for APIs.",
    colSpan: "md:col-span-2",
  },
];

function FeatureCard({ feature }: { feature: typeof features[0] }) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden rounded-3xl border border-white/5 bg-[#0A0A0F] p-8 transition-colors hover:border-[var(--mp-violet)]/30 ${feature.colSpan}`}
    >
      {/* Spotlight Hover Effect */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 mix-blend-screen"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(139,92,246,0.1), transparent 40%)`,
        }}
      />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--mp-violet)]/10 border border-[var(--mp-violet)]/20 mb-6 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
          <feature.icon className="h-6 w-6 text-[var(--mp-violet)]" strokeWidth={1.5} />
        </div>
        <h3 className="font-sans text-xl font-semibold text-white mb-2">{feature.title}</h3>
        <p className="text-sm leading-relaxed text-slate-400 mt-auto">
          {feature.description}
        </p>
      </div>
    </div>
  );
}

export function Features() {
  return (
    <section id="features" className="px-6 py-24 md:py-32 relative bg-[var(--mp-bg-alt)] border-t border-[var(--mp-border)]">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-violet-400 mb-6">
            Features
          </div>
          <h2 className="font-sans text-3xl font-bold tracking-tight sm:text-4xl text-white">
            Built for developers. <br className="sm:hidden"/> <span className="text-slate-500">Secured by you.</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[250px]">
          {features.map((feature, i) => (
            <FeatureCard key={i} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
