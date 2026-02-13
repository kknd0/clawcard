import "./global.css";
import { RootProvider } from "fumadocs-ui/provider";
import { JetBrains_Mono, IBM_Plex_Sans } from "next/font/google";
import type { ReactNode } from "react";
import type { Metadata } from "next";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans",
});

export const metadata: Metadata = {
  title: "ClawCard — Safe Payments for AI",
  description:
    "Safe Payments for AI — Give your AI assistant a virtual card with strict spending limits. One command to create, auto-closes after use.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} ${ibmPlexSans.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <RootProvider theme={{ defaultTheme: "dark" }}>{children}</RootProvider>
      </body>
    </html>
  );
}
