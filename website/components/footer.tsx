import { Github, Linkedin, Terminal } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--mp-border)] bg-[var(--mp-bg-alt)] px-6 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 md:flex-row md:justify-between">
        <Link
          href="/"
          className="flex items-center gap-2"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-[var(--mp-violet)] to-[var(--mp-pink)]">
            <Terminal className="h-3 w-3 text-white" strokeWidth={2.5} />
          </div>
          <span className="bg-gradient-to-r from-[var(--mp-violet)] to-[var(--mp-pink)] bg-clip-text font-mono text-[13px] font-bold text-transparent">
            ClawCard
          </span>
        </Link>

        <div className="flex items-center gap-5 text-[13px] text-[var(--mp-text-muted)]">
          <a
            href="https://www.npmjs.com/package/clawcard"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-[var(--mp-text-secondary)]"
          >
            npm
          </a>
          <a
            href="https://github.com/kknd0/clawcard"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 transition hover:text-[var(--mp-text-secondary)]"
          >
            <Github className="h-3.5 w-3.5" />
            GitHub
          </a>
          <Link href="/docs" className="transition hover:text-[var(--mp-text-secondary)]">
            Docs
          </Link>
          <a
            href="https://www.linkedin.com/in/lizi-li-0901582aa/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 transition hover:text-[var(--mp-text-secondary)]"
          >
            <Linkedin className="h-3.5 w-3.5" />
            Author
          </a>
        </div>

        <p className="text-[11px] text-[var(--mp-text-muted)]">
          MIT License &middot; Built with Privacy.com API
        </p>
      </div>
    </footer>
  );
}
