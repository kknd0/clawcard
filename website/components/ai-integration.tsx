import { Bot } from "lucide-react";

export function AIIntegration() {
  return (
    <section className="border-t border-[var(--mp-border)] px-6 py-20 md:py-24" style={{ background: "var(--mp-bg-alt)" }}>
      <div className="mx-auto max-w-5xl">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left — text */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--mp-violet)]/30 bg-[var(--mp-violet)]/10 px-3 py-1">
              <Bot className="h-3.5 w-3.5 text-[var(--mp-violet)]" />
              <span className="text-xs font-medium text-[var(--mp-violet)]">
                AI Integration
              </span>
            </div>

            <h2 className="mt-5 font-mono text-2xl font-bold tracking-tight sm:text-3xl">
              Your AI manages
              <br />
              your cards
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-[var(--mp-text-secondary)]">
              ClawCard includes a built-in{" "}
              <strong className="font-medium text-[var(--mp-text)]">
                MCP server
              </strong>{" "}
              that lets Claude Code, Claude Desktop, and other MCP-compatible
              tools create, freeze, and manage cards through natural
              conversation.
            </p>

            <div className="mt-6 space-y-2">
              <code className="block rounded-xl border border-[var(--mp-border)] px-4 py-2.5 font-mono text-[12px] text-[var(--mp-text-secondary)]" style={{ background: "var(--mp-bg-card)" }}>
                <span className="text-[var(--mp-text-muted)]">$</span>{" "}
                <span className="text-[var(--mp-text)]">claude mcp add</span>{" "}
                <span className="text-[var(--mp-cyan)]">clawcard</span>{" "}
                <span className="text-[var(--mp-text-muted)]">--</span>{" "}
                <span className="text-[var(--mp-green)]">npx clawcard-mcp</span>
              </code>
              <code className="block rounded-xl border border-[var(--mp-border)] px-4 py-2.5 font-mono text-[12px] text-[var(--mp-text-secondary)]" style={{ background: "var(--mp-bg-card)" }}>
                <span className="text-[var(--mp-text-muted)]">$</span>{" "}
                <span className="text-[var(--mp-text)]">npx skills add</span>{" "}
                <span className="text-[var(--mp-cyan)]">https://github.com/kknd0/clawcard</span>{" "}
                <span className="text-[var(--mp-pink)]">--skill</span>{" "}
                <span className="text-[var(--mp-green)]">clawcard</span>
              </code>
            </div>
          </div>

          {/* Right — example conversation */}
          <div className="overflow-hidden rounded-2xl border border-[var(--mp-border)] shadow-lg shadow-[var(--mp-violet)]/5" style={{ background: "var(--mp-bg-card)" }}>
            <div className="border-b border-[var(--mp-border)] px-5 py-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[var(--mp-green)]" />
                <span className="font-mono text-[11px] font-medium text-[var(--mp-text-muted)]">
                  Claude Code
                </span>
              </div>
            </div>
            <div className="space-y-3 p-5 text-[13px]">
              <ChatBubble role="user">
                Create a $30 burner card for a domain purchase on namecheap.com
              </ChatBubble>
              <ChatBubble role="assistant">
                I&apos;ll create a single-use burner card for your Namecheap
                purchase.
              </ChatBubble>
              <div className="rounded-xl border border-[var(--mp-border)] p-3.5 font-mono text-[11px] leading-relaxed" style={{ background: "var(--mp-bg-hover)" }}>
                <div className="font-semibold text-[var(--mp-green)]">
                  Burner Card Created
                </div>
                <div className="mt-1.5 space-y-0.5 text-[var(--mp-text-muted)]">
                  <div>
                    Number: &nbsp;4242 •••• •••• 3847
                  </div>
                  <div>Merchant: namecheap.com</div>
                  <div>
                    Limit: &nbsp;&nbsp; $30.00
                  </div>
                </div>
              </div>
              <ChatBubble role="assistant">
                Done! Your $30 burner card is ready. It will auto-exhaust after
                the purchase.
              </ChatBubble>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChatBubble({
  role,
  children,
}: {
  role: "user" | "assistant";
  children: React.ReactNode;
}) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
          isUser
            ? "bg-gradient-to-r from-[var(--mp-violet)] to-[var(--mp-pink)] text-white"
            : "border border-[var(--mp-border)] text-[var(--mp-text-secondary)]"
        }`}
        style={!isUser ? { background: "var(--mp-bg-hover)" } : undefined}
      >
        {children}
      </div>
    </div>
  );
}
