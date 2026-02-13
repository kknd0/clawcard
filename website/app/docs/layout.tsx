import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { source } from "@/lib/source";
import { Terminal } from "lucide-react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      nav={{
        title: (
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#EC4899]">
              <Terminal className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="bg-gradient-to-r from-[#7C3AED] to-[#EC4899] bg-clip-text font-mono text-[14px] font-bold tracking-tight text-transparent">
              ClawCard
            </span>
          </div>
        ),
        url: "/",
      }}
    >
      {children}
    </DocsLayout>
  );
}
