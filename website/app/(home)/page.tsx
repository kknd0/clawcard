import { Hero } from "@/components/hero";
import { ProblemSolution } from "@/components/problem-solution";
import { Features } from "@/components/features";
import { TerminalDemo } from "@/components/terminal";
import { AIIntegration } from "@/components/ai-integration";
import { HowItWorks } from "@/components/how-it-works";
import { TrustSignals } from "@/components/trust-signals";
import { FinalCTA } from "@/components/final-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProblemSolution />
      <Features />
      <TerminalDemo />
      <AIIntegration />
      <HowItWorks />
      <TrustSignals />
      <FinalCTA />
    </>
  );
}
