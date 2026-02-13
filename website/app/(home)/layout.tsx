import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import type { ReactNode } from "react";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="marketing-page">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
