"use client";

import { Copy, Check } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

// Typewriter sequences
const TYPING_SPEED = 45;
const LINE_PAUSE = 600;
const RESTART_PAUSE = 4000;

interface TermLine {
  type: "cmd" | "out" | "success" | "blank";
  text: string;
}

const SCRIPT: TermLine[] = [
  { type: "cmd", text: 'clawcard burner 49.99 -m "amazon.com"' },
  { type: "blank", text: "" },
  { type: "success", text: "✓ Burner Card Created" },
  { type: "out", text: "  Number:   4242 8310 •••• 7291" },
  { type: "out", text: "  Merchant: amazon.com" },
  { type: "out", text: "  Limit:    $50.00" },
  { type: "out", text: "  Status:   active" },
];

function useTypewriter() {
  const [lines, setLines] = useState<{ type: TermLine["type"]; text: string }[]>([]);
  const [cursorVisible, setCursorVisible] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    let cancelled = false;

    async function sleep(ms: number) {
      return new Promise<void>((r) => {
        timeoutRef.current = setTimeout(r, ms);
      });
    }

    async function run() {
      while (!cancelled) {
        setLines([]);
        setCursorVisible(true);

        for (let i = 0; i < SCRIPT.length; i++) {
          if (cancelled) return;
          const line = SCRIPT[i];

          if (line.type === "cmd") {
            // Type command char by char
            for (let c = 0; c <= line.text.length; c++) {
              if (cancelled) return;
              setLines((prev) => {
                const next = [...prev];
                // Replace or add the current typing line
                if (next.length > i) {
                  next[i] = { type: "cmd", text: line.text.slice(0, c) };
                } else {
                  next.push({ type: "cmd", text: line.text.slice(0, c) });
                }
                return next;
              });
              await sleep(TYPING_SPEED);
            }
            setCursorVisible(false);
            await sleep(LINE_PAUSE);
          } else {
            // Output lines appear instantly
            setLines((prev) => [...prev, { type: line.type, text: line.text }]);
            await sleep(80);
          }
        }

        setCursorVisible(false);
        await sleep(RESTART_PAUSE);
      }
    }

    run();
    return () => {
      cancelled = true;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { lines, cursorVisible };
}

function formatCmd(text: string) {
  // Colorize: command name = white, flags = cyan, quoted strings = pink, numbers = green
  const parts: { text: string; color: string }[] = [];
  const regex = /"[^"]*"|--?\w+|[\d.]+|\S+/g;
  let match;
  let first = true;
  while ((match = regex.exec(text)) !== null) {
    const tok = match[0];
    let color = "var(--mp-text)";
    if (tok.startsWith('"')) color = "var(--mp-pink)";
    else if (tok.startsWith("-")) color = "var(--mp-cyan)";
    else if (/^\d/.test(tok)) color = "var(--mp-green)";
    else if (first) { color = "var(--mp-text)"; first = false; }
    parts.push({ text: tok, color });
  }
  return parts;
}

export function Hero() {
  const [copied, setCopied] = useState(false);
  const { lines, cursorVisible } = useTypewriter();

  const handleCopy = () => {
    navigator.clipboard.writeText("npx skills add https://github.com/kknd0/clawcard --skill clawcard");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-20 md:pb-28 md:pt-28">
      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0 glow-violet" />
      <div className="pointer-events-none absolute inset-0 glow-pink" />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — text */}
          <div className="text-center lg:text-left">
            {/* Eyebrow */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--mp-cyan)]/30 bg-[var(--mp-cyan)]/10 px-3 py-1">
              <div className="h-1.5 w-1.5 rounded-full bg-[var(--mp-cyan)]" />
              <span className="text-xs font-medium text-[var(--mp-cyan)]">
                Safe payments for AI agents
              </span>
            </div>

            <h1 className="font-mono text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
              Let AI pay.
              <br />
              <span className="bg-gradient-to-r from-[var(--mp-violet)] to-[var(--mp-pink)] bg-clip-text text-transparent">
                Stay in control.
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[var(--mp-text-secondary)] md:text-lg lg:mx-0">
              Give your AI assistant a virtual card with strict spending limits.
              One command to create. Auto-closes after use. Powered by Privacy.com.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start sm:justify-center">
              <button
                onClick={handleCopy}
                className="group flex items-center gap-3 rounded-xl border border-[var(--mp-border)] bg-[var(--mp-bg-card)] px-5 py-2.5 font-mono text-sm shadow-lg shadow-black/20 transition hover:border-[var(--mp-violet)]/30 hover:shadow-xl"
              >
                <span className="text-[var(--mp-text-muted)]">$</span>
                <span className="text-[var(--mp-text)]">npx skills add</span>
                <span className="text-[var(--mp-cyan)] hidden sm:inline">...clawcard</span>
                <span className="text-[var(--mp-pink)] hidden sm:inline">--skill</span>
                <span className="text-[var(--mp-green)] hidden sm:inline">clawcard</span>
                <span className="text-[var(--mp-cyan)] sm:hidden">...clawcard</span>
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-[var(--mp-green)]" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-[var(--mp-text-muted)] transition group-hover:text-[var(--mp-text-secondary)]" />
                )}
              </button>
            </div>
          </div>

          {/* Right — 3D card + floating terminal */}
          <div className="relative min-h-[420px] flex items-start justify-center lg:justify-end">
            {/* 3D Credit Card — top-left */}
            <div className="absolute left-0 top-0 animate-float" style={{ perspective: "1000px" }}>
              <div
                className="relative h-[220px] w-[360px] overflow-hidden rounded-2xl shadow-2xl shadow-[var(--mp-violet)]/20"
                style={{
                  background: "linear-gradient(135deg, #1A1A3A 0%, #12122A 40%, #0D0D22 100%)",
                  transform: "rotateY(-8deg) rotateX(6deg)",
                }}
              >
                {/* Shine effect */}
                <div
                  className="animate-card-shine pointer-events-none absolute inset-0"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
                    width: "60%",
                  }}
                />
                {/* Gradient border glow */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl"
                  style={{
                    border: "1px solid rgba(124, 58, 237, 0.3)",
                    background: "linear-gradient(135deg, rgba(124,58,237,0.1), transparent 50%, rgba(236,72,153,0.1))",
                  }}
                />

                {/* Card content */}
                <div className="relative flex h-full flex-col justify-between p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="bg-gradient-to-r from-[var(--mp-violet)] to-[var(--mp-pink)] bg-clip-text font-mono text-sm font-bold text-transparent">
                        ClawCard
                      </div>
                      <div className="mt-0.5 text-[11px] text-[var(--mp-text-muted)]">
                        Virtual Burner
                      </div>
                    </div>
                    <div
                      className="h-8 w-10 rounded-md"
                      style={{
                        background: "linear-gradient(135deg, #C9A94E 0%, #E8D48B 50%, #C9A94E 100%)",
                        opacity: 0.8,
                      }}
                    />
                  </div>

                  <div className="font-mono text-lg tracking-[0.2em] text-[var(--mp-text)]">
                    4242 8310 •••• 7291
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-[var(--mp-text-muted)]">
                        Limit
                      </div>
                      <div className="font-mono text-sm font-semibold text-[var(--mp-green)]">
                        $50.00
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-[var(--mp-text-muted)]">
                        Merchant
                      </div>
                      <div className="font-mono text-sm text-[var(--mp-text-secondary)]">
                        amazon.com
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] uppercase tracking-wider text-[var(--mp-text-muted)]">
                        Status
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-[var(--mp-green)]" />
                        <span className="text-xs font-medium text-[var(--mp-green)]">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Typewriter Terminal — floating below-right of card */}
            <div
              className="absolute bottom-0 right-0 z-10 w-[340px] overflow-hidden rounded-xl border border-[var(--mp-border)] shadow-2xl shadow-black/40 backdrop-blur-md sm:w-[370px]"
              style={{ background: "rgba(18, 18, 42, 0.85)" }}
            >
              {/* Title bar */}
              <div className="flex items-center gap-2 border-b border-[var(--mp-border)] px-3 py-2">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                </div>
                <span className="ml-1 font-mono text-[10px] text-[var(--mp-text-muted)]">
                  clawcard — zsh
                </span>
              </div>

              {/* Terminal body */}
              <div className="min-h-[160px] p-3.5 font-mono text-[12px] leading-[1.7]">
                {lines.map((line, i) => {
                  if (line.type === "blank") return <div key={i} className="h-2" />;
                  if (line.type === "success")
                    return (
                      <div key={i} className="font-semibold text-[var(--mp-green)]">
                        {line.text}
                      </div>
                    );
                  if (line.type === "out")
                    return (
                      <div key={i} className="text-[var(--mp-text-muted)]">
                        {line.text}
                      </div>
                    );
                  // cmd
                  const isTyping = i === lines.length - 1 && cursorVisible;
                  return (
                    <div key={i}>
                      <span className="text-[var(--mp-green)]">$ </span>
                      {formatCmd(line.text).map((part, j) => (
                        <span key={j} style={{ color: part.color }}>
                          {part.text}{" "}
                        </span>
                      ))}
                      {isTyping && (
                        <span className="animate-blink inline-block w-[7px] bg-[var(--mp-text)] align-baseline" style={{ height: "14px" }} />
                      )}
                    </div>
                  );
                })}
                {lines.length === 0 && (
                  <div>
                    <span className="text-[var(--mp-green)]">$ </span>
                    <span className="animate-blink inline-block w-[7px] bg-[var(--mp-text)] align-baseline" style={{ height: "14px" }} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
