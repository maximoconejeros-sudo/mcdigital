import type { Metadata } from "next";
import { Playfair_Display, Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const mono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

// The editorial serif voice — the same family the MC monogram's own
// letterforms are built from (see mc-glyph-paths.ts), used sparingly for
// single-word emotional emphasis, never for full passages.
const serif = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["600"],
  style: ["italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MC Digital® — Digital Growth Agency",
  description:
    "MC Digital is a digital growth agency building landing pages, complete websites, and WhatsApp AI agents designed around your business. Santiago — Miami.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${mono.variable} ${serif.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
