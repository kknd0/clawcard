import { Bot, Sparkles, Terminal } from "lucide-react";

export function AIIntegration() {
  return (
    <section className="px-6 py-24 md:py-32 border-t border-[var(--mp-border)] bg-[var(--mp-bg)] relative overflow-hidden">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="mx-auto max-w-6xl relative z-10">
        <div className="grid items-center gap-16 lg:grid-cols-2">

          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--mp-pink)]/30 bg-[var(--mp-pink)]/10 px-3 py-1 mb-6">
              <Sparkles className="h-3.5 w-3.5 text-[var(--mp-pink)]" />
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--mp-pink)]">
                Native MCP Support
              </span>
            </div>

            <h2 className="font-sans text-4xl font-bold tracking-tight sm:text-5xl text-white mb-6">
              Your AI manages <br/>
              <span className="text-slate-500">its own cards.</span>
            </h2>

            <p className="text-lg leading-relaxed text-slate-400 mb-8">
              ClawCard includes a built-in <strong className="text-white font-medium">Model Context Protocol (MCP) server</strong>. Claude Code, Cursor, and other AI tools can create and freeze cards natively through natural conversation.
            </p>

            <div className="space-y-3">
              <div className="group relative">
                <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 opacity-20 blur group-hover:opacity-40 transition duration-300" />
                <code className="relative flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-white/10 bg-black/80 backdrop-blur-md px-5 py-4 font-mono text-[13px] text-slate-300">
                  <span className="text-slate-600 hidden sm:block">$</span>
                  <span>claude mcp add <span className="text-cyan-400">clawcard</span> -- <span className="text-emerald-400">npx clawcard-mcp</span></span>
                </code>
              </div>
            </div>
          </div>

          <div className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-1 shadow-2xl shadow-violet-500/10 backdrop-blur-xl">
            <div className="rounded-xl bg-[#0A0A0F] overflow-hidden border border-white/5">

              <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  <span className="font-sans text-sm font-medium text-slate-200">Claude 3.5 Sonnet</span>
                </div>
                <Bot className="h-4 w-4 text-slate-500" />
              </div>

              <div className="space-y-5 p-6 text-sm">
                <ChatBubble role="user">
                  Create a $30 burner card for a domain purchase on namecheap.com
                </ChatBubble>
                <ChatBubble role="assistant">
                  I&apos;ll create a single-use burner card for your Namecheap purchase using ClawCard.
                </ChatBubble>

                <div className="ml-12 rounded-xl border border-violet-500/20 bg-violet-500/[0.05] p-4 font-mono text-[12px] leading-relaxed shadow-inner">
                  <div className="flex items-center gap-2 mb-3 border-b border-white/5 pb-2">
                    <Terminal className="h-3.5 w-3.5 text-violet-400" />
                    <span className="font-semibold text-violet-300 uppercase tracking-wider text-[10px]">Tool Executed: clawcard.create</span>
                  </div>
                  <div className="space-y-1.5 text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Number</span>
                      <span className="text-white">4242 •••• •••• 3847</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Merchant</span>
                      <span className="text-white">namecheap.com</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-white/5">
                      <span className="text-slate-500">Limit</span>
                      <span className="text-emerald-400 font-bold">$30.00</span>
                    </div>
                  </div>
                </div>

                <ChatBubble role="assistant">
                  Done! Your $30 burner card is ready. It will automatically freeze after the purchase is complete.
                </ChatBubble>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChatBubble({ role, children }: { role: "user" | "assistant"; children: React.ReactNode }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-500/10 border border-violet-500/20 mr-3 mt-1">
          <Bot className="h-4 w-4 text-violet-400" />
        </div>
      )}
      <div
        className={`max-w-[85%] rounded-2xl px-5 py-3.5 leading-relaxed shadow-md ${
          isUser
            ? "bg-gradient-to-br from-[var(--mp-violet)] to-[var(--mp-pink)] text-white rounded-tr-sm"
            : "bg-white/[0.03] border border-white/5 text-slate-300 rounded-tl-sm"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
