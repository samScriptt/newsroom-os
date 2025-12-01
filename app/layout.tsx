import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google"; // Fonte de Hacker
import "./globals.css";

// Configurando a fonte Mono
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Newsroom OS",
  description: "Autonomous AI Newsletter Agent",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${jetbrains.variable} font-mono bg-zinc-950 text-zinc-50 antialiased`}>
        {children}
      </body>
    </html>
  );
}