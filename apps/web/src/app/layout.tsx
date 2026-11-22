import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMonoSans = JetBrains_Mono({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMonoSerif = JetBrains_Mono({
  variable: "--font-serif",
  subsets: ["latin"],
});

const jetbrainsMonoMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cue - Store your code snippets and prompts",
  description: "An app to store your most important code snippets and prompts.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        jetbrainsMonoSans.variable,
        jetbrainsMonoSerif.variable,
        jetbrainsMonoMono.variable,
        "font-sans",
        "dark",
      )}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
