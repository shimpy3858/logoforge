import "./globals.css";
import "./fonts.css";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "LogoForge - make a logo in minutes", description: "Answer a few questions and get logo options you can download as SVG or PNG." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body>{children}</body></html>);
}
