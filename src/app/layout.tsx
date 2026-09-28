import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wild Speed Motors | Quality Used Cars",
  description:
    "Discover quality used cars, flexible finance options, part exchange and friendly local service at Wild Speed Motors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
