"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Copy, Check, Terminal, Shield, Sparkles, ChevronRight } from "lucide-react";

// --- Configuration ---
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
      return new Promise<void>((r) => { timeoutRef.current = setTimeout(r, ms); });
    }
    async function run() {
      while (!cancelled) {
        setLines([]);
        setCursorVisible(true);
        await sleep(500);

        for (let i = 0; i < SCRIPT.length; i++) {
          if (cancelled) return;
          const line = SCRIPT[i];

          if (line.type === "cmd") {
            for (let c = 0; c <= line.text.length; c++) {
              if (cancelled) return;
              setLines((prev) => {
                const next = [...prev];
                if (next.length > i) next[i] = { type: "cmd", text: line.text.slice(0, c) };
                else next.push({ type: "cmd", text: line.text.slice(0, c) });
                return next;
              });
              await sleep(TYPING_SPEED);
            }
            setCursorVisible(false);
            await sleep(LINE_PAUSE);
          } else {
            setLines((prev) => [...prev, { type: line.type, text: line.text }]);
            await sleep(80);
          }
        }
        setCursorVisible(false);
        await sleep(RESTART_PAUSE);
      }
    }
    run();
    return () => { cancelled = true; clearTimeout(timeoutRef.current!); };
  }, []);
  return { lines, cursorVisible };
}

function formatCmd(text: string) {
  const parts: { text: string; color: string }[] = [];
  const regex = /"[^"]*"|--?\w+|[\d.]+|\S+/g;
  let match;
  let first = true;
  while ((match = regex.exec(text)) !== null) {
    const tok = match[0];
    let color = "#e2e8f0";
    if (tok.startsWith('"')) color = "var(--mp-pink)";
    else if (tok.startsWith("-")) color = "var(--mp-cyan)";
    else if (/^\d/.test(tok)) color = "var(--mp-green)";
    else if (first) { color = "var(--mp-violet)"; first = false; }
    parts.push({ text: tok, color });
  }
  return parts;
}

export function Hero() {
  const [copied, setCopied] = useState(false);
  const { lines, cursorVisible } = useTypewriter();
  const containerRef = useRef<HTMLDivElement>(null);

  // 3D Rotation & Glare State
  const [rotate, setRotate] = useState({ x: 8, y: -12 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("npx skills add https://github.com/kknd0/clawcard --skill clawcard");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotate({ x: ((y - centerY) / centerY) * -15, y: ((x - centerX) / centerX) * 15 });
    setGlare({ x: (x / rect.width) * 100, y: (y / rect.height) * 100, opacity: 1 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setRotate({ x: 8, y: -12 });
    setGlare(prev => ({ ...prev, opacity: 0 }));
  }, []);

  return (
    <section className="relative overflow-hidden bg-[var(--mp-bg)] px-6 pb-20 pt-32 md:pb-32 md:pt-40 min-h-[95vh] flex items-center">
      <div className="absolute inset-0 bg-grid-pattern opacity-50 pointer-events-none" />
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-r from-violet-600/50 via-cyan-600/30 to-pink-600/40 rounded-full blur-[120px] mix-blend-screen pointer-events-none" style={{ animation: 'pulse-slow 8s infinite' }} />

      <div className="relative mx-auto max-w-7xl w-full z-10">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-8">

          <div className="text-center lg:text-left z-10">
            <div className="group mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--mp-violet)]/30 bg-[var(--mp-violet)]/10 px-4 py-1.5 backdrop-blur-md transition-all hover:bg-[var(--mp-violet)]/20 hover:border-[var(--mp-violet)]/50 cursor-pointer">
              <Shield className="h-4 w-4 text-violet-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold tracking-wide text-violet-300 uppercase">
                Safe payments for AI agents
              </span>
              <ChevronRight className="h-3 w-3 text-violet-400 opacity-50 group-hover:opacity-100 transition-all translate-x-[-4px] group-hover:translate-x-0" />
            </div>

            <h1 className="font-sans text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
              Let AI pay.<br />
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-sm animate-text-gradient">
                Stay in control.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-400 lg:mx-0 font-medium">
              Give your AI assistant a virtual card with strict spending limits.
              One command to create. Auto-closes after use. Powered by <span className="text-slate-200 border-b border-dashed border-slate-500">Privacy.com</span>.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start sm:justify-center">
              <div className="relative group w-full sm:w-auto">
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 opacity-30 blur-lg transition duration-500 group-hover:opacity-70 group-hover:duration-200" />
                <button
                  onClick={handleCopy}
                  className="relative flex w-full items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/50 backdrop-blur-xl px-5 py-3.5 font-mono text-sm shadow-2xl transition-all hover:bg-black/70 ring-1 ring-white/5"
                >
                  <div className="flex items-center gap-3">
                    <Terminal className="h-4 w-4 text-violet-400 shrink-0" />
                    <div className="flex flex-wrap items-center gap-1.5 text-left">
                      <span className="text-slate-500">$</span>
                      <span className="text-slate-200">npx skills add</span>
                      <span className="text-cyan-400 hidden sm:inline">...clawcard</span>
                    </div>
                  </div>
                  <div className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 transition-colors group-hover:bg-white/10">
                    {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-slate-400 group-hover:text-white" />}
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div
            ref={containerRef}
            className="relative min-h-[400px] sm:min-h-[500px] w-full flex items-center justify-center lg:justify-end mt-12 lg:mt-0"
            style={{ perspective: "1500px" }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className={`relative h-[280px] sm:h-[300px] w-full max-w-[340px] sm:max-w-[400px] transition-transform duration-300 ease-out ${!isHovered ? 'animate-float-complex' : ''}`}
              style={{
                transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
                transformStyle: "preserve-3d"
              }}
            >
              <div
                className="absolute -left-2 sm:-left-12 top-0 sm:-top-16 z-20 h-[220px] sm:h-[240px] w-[340px] sm:w-[380px] overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
                style={{
                  background: "linear-gradient(135deg, rgba(30,27,75,0.9) 0%, rgba(15,23,42,0.95) 100%)",
                  transform: "translateZ(60px)",
                  boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(139, 92, 246, 0.3)"
                }}
              >
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-300 mix-blend-overlay"
                  style={{ opacity: glare.opacity, background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.8) 0%, transparent 50%)` }}
                />
                <div className="absolute inset-0 animate-holo pointer-events-none mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/10 via-transparent to-cyan-500/10" />

                <div className="relative flex h-full flex-col justify-between p-7 text-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-violet-400" />
                        <span className="bg-gradient-to-r from-violet-200 to-fuchsia-200 bg-clip-text font-mono text-lg font-bold tracking-widest text-transparent uppercase">
                          ClawCard
                        </span>
                      </div>
                      <div className="mt-1 font-mono text-[10px] tracking-[0.2em] text-violet-400/80 uppercase">
                        Virtual Burner
                      </div>
                    </div>
                    <div className="relative h-10 w-12 overflow-hidden rounded-md border border-yellow-500/40 bg-gradient-to-br from-yellow-200/20 via-yellow-600/40 to-yellow-800/60 shadow-inner">
                      <div className="absolute left-1/2 top-0 h-full w-[1px] -translate-x-1/2 bg-yellow-400/30" />
                      <div className="absolute top-1/2 h-[1px] w-full -translate-y-1/2 bg-yellow-400/30" />
                      <div className="absolute inset-1.5 rounded border border-yellow-400/30" />
                    </div>
                  </div>

                  <div className="font-mono text-2xl tracking-[0.25em] text-slate-100 drop-shadow-lg">
                    4242 8310 •••• 7291
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">Limit</div>
                      <div className="font-mono text-base font-bold text-emerald-400">$50.00</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">Merchant</div>
                      <div className="font-mono text-sm text-slate-200">amazon.com</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">Status</div>
                      <div className="flex items-center justify-end gap-1.5">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                        </span>
                        <span className="text-[11px] font-bold text-emerald-400 tracking-wider">ACTIVE</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="absolute bottom-[-40px] right-[-20px] z-10 w-[360px] overflow-hidden rounded-xl glass-panel shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)]"
                style={{ transform: "translateZ(20px)" }}
              >
                <div className="flex items-center justify-between border-b border-white/10 bg-black/40 px-4 py-3">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-[#FF5F57] border border-black/20" />
                    <div className="h-3 w-3 rounded-full bg-[#FFBD2E] border border-black/20" />
                    <div className="h-3 w-3 rounded-full bg-[#28C840] border border-black/20" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <span className="font-mono text-[10px] text-slate-300">clawcard — bash</span>
                  </div>
                  <div className="w-[50px]" />
                </div>

                <div className="min-h-[220px] p-5 font-mono text-[12px] leading-relaxed bg-black/60">
                  {lines.map((line, i) => {
                    if (line.type === "blank") return <div key={i} className="h-3" />;
                    if (line.type === "success")
                      return <div key={i} className="font-semibold text-emerald-400 mt-1">{line.text}</div>;
                    if (line.type === "out")
                      return <div key={i} className="text-slate-300 pl-3 border-l-2 border-slate-700 ml-1.5 whitespace-pre">{line.text}</div>;

                    const isTyping = i === lines.length - 1 && cursorVisible;
                    return (
                      <div key={i} className="flex">
                        <span className="text-violet-400 mr-2 font-bold">❯</span>
                        <div className="flex-1 break-all">
                          {formatCmd(line.text).map((part, j) => (
                            <span key={j} style={{ color: part.color }}>{part.text} </span>
                          ))}
                          {isTyping && <span className="animate-pulse inline-block w-2 bg-violet-400 align-middle ml-1" style={{ height: "14px" }} />}
                        </div>
                      </div>
                    );
                  })}
                  {lines.length === 0 && (
                    <div className="flex">
                      <span className="text-violet-400 mr-2 font-bold">❯</span>
                      <span className="animate-pulse inline-block w-2 bg-violet-400 align-middle ml-1" style={{ height: "14px" }} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
