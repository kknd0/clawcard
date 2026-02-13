export function TerminalDemo() {
  return (
    <section className="px-6 py-20 md:py-24">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--mp-violet)]">
            Demo
          </p>
          <h2 className="mt-2 font-mono text-2xl font-bold tracking-tight sm:text-3xl">
            See it in action
          </h2>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-[var(--mp-border)] shadow-2xl shadow-[var(--mp-violet)]/10" style={{ background: "var(--mp-bg-card)" }}>
          {/* Title bar */}
          <div className="flex items-center gap-2 border-b border-[var(--mp-border)] px-4 py-2.5">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
            </div>
            <span className="ml-2 font-mono text-[11px] text-[var(--mp-text-muted)]">
              clawcard &mdash; zsh
            </span>
          </div>

          {/* Terminal content */}
          <div className="p-5 font-mono text-[13px] leading-[1.8]">
            <Line comment># Create a burner card for a one-time purchase</Line>
            <Line prompt>
              <span className="text-[var(--mp-text)]">clawcard burner</span>{" "}
              <span className="text-[var(--mp-cyan)]">25.50</span>{" "}
              <span className="text-[var(--mp-pink)]">-m</span>{" "}
              <span className="text-[var(--mp-green)]">&quot;domain.com&quot;</span>
            </Line>
            <Line success>&check; Burner card created &mdash; $26 limit, locked to domain.com</Line>
            <Spacer />
            <Line comment># Create a reusable card with a monthly cap</Line>
            <Line prompt>
              <span className="text-[var(--mp-text)]">clawcard create</span>{" "}
              <span className="text-[var(--mp-pink)]">-n</span>{" "}
              <span className="text-[var(--mp-green)]">&quot;AI Tools&quot;</span>{" "}
              <span className="text-[var(--mp-pink)]">-l</span>{" "}
              <span className="text-[var(--mp-cyan)]">50</span>
            </Line>
            <Line success>&check; Card &quot;AI Tools&quot; created &mdash; $50/month limit</Line>
            <Spacer />
            <Line comment># Check recent transactions</Line>
            <Line prompt>
              <span className="text-[var(--mp-text)]">clawcard transactions</span>{" "}
              <span className="text-[var(--mp-pink)]">--since</span>{" "}
              <span className="text-[var(--mp-cyan)]">7d</span>
            </Line>
            <Line dim>{"  "}domain.com{"        "}$25.50{"   "}settled{"   "}2 days ago</Line>
            <Line dim>{"  "}openai.com{"        "}$20.00{"   "}settled{"   "}5 days ago</Line>
            <div className="mt-1">
              <span className="text-[var(--mp-green)]">$</span>{" "}
              <span className="animate-blink text-[var(--mp-text)]">▋</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Spacer() {
  return <div className="h-3" />;
}

function Line({
  children,
  prompt,
  comment,
  success,
  dim,
}: {
  children?: React.ReactNode;
  prompt?: boolean;
  comment?: boolean;
  success?: boolean;
  dim?: boolean;
}) {
  if (comment) {
    return <div className="text-[var(--mp-text-muted)]">{children}</div>;
  }
  if (prompt) {
    return (
      <div>
        <span className="text-[var(--mp-green)]">$</span>{" "}
        {children}
      </div>
    );
  }
  if (success) return <div className="text-[var(--mp-green)]">{children}</div>;
  if (dim) return <div className="text-[var(--mp-text-muted)]">{children}</div>;
  return <div>{children}</div>;
}
