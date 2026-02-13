"use client";

import Link from "next/link";
import { Github, Terminal } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--mp-border)] bg-[var(--mp-bg)]/90 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Link
          href="/"
          className="flex items-center gap-2.5 transition hover:opacity-80"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--mp-violet)] to-[var(--mp-pink)]">
            <Terminal className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="bg-gradient-to-r from-[var(--mp-violet)] to-[var(--mp-pink)] bg-clip-text font-mono text-[15px] font-bold tracking-tight text-transparent">
            ClawCard
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 md:flex">
          <Link
            href="/#features"
            className="rounded-md px-3 py-1.5 text-[13px] font-medium text-[var(--mp-text-secondary)] transition hover:bg-[var(--mp-bg-hover)] hover:text-[var(--mp-text)]"
          >
            Features
          </Link>
          <Link
            href="/docs"
            className="rounded-md px-3 py-1.5 text-[13px] font-medium text-[var(--mp-text-secondary)] transition hover:bg-[var(--mp-bg-hover)] hover:text-[var(--mp-text)]"
          >
            Docs
          </Link>
          <div className="mx-2 h-4 w-px bg-[var(--mp-border)]" />
          <a
            href="https://github.com/kknd0/clawcard"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md p-1.5 text-[var(--mp-text-muted)] transition hover:bg-[var(--mp-bg-hover)] hover:text-[var(--mp-text)]"
          >
            <Github className="h-[18px] w-[18px]" />
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="rounded-md p-1.5 text-[var(--mp-text-secondary)] transition hover:bg-[var(--mp-bg-hover)] md:hidden"
          aria-label="Toggle menu"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-[var(--mp-border)] bg-[var(--mp-bg-card)] px-6 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            <Link
              href="/#features"
              className="rounded-md px-3 py-2 text-sm text-[var(--mp-text-secondary)] hover:bg-[var(--mp-bg-hover)]"
              onClick={() => setOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/docs"
              className="rounded-md px-3 py-2 text-sm text-[var(--mp-text-secondary)] hover:bg-[var(--mp-bg-hover)]"
              onClick={() => setOpen(false)}
            >
              Docs
            </Link>
            <a
              href="https://github.com/kknd0/clawcard"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-[var(--mp-text-secondary)] hover:bg-[var(--mp-bg-hover)]"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
