import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevComply - AI Regulatory & Security Code Scanner",
  description: "Shift-left security and compliance automation powered by AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}