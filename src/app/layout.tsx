import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "./design-v3.css";

const sans = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wild Speed Motors Japan | Used Cars in USD",
  description:
    "Japan-based used cars with USD pricing and a digital-first buying experience for the U.S. military community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={sans.variable + " " + mono.variable}>
      <body>{children}</body>
    </html>
  );
}
