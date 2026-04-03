import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "URL Shortener",
  description: "Shorten URLs and track analytics",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col bg-slate-50 text-slate-800`}
      >
        <header className="bg-white/80 backdrop-blur sticky top-0 z-50 border-b border-slate-200 shadow-sm">
          <nav className="max-w-4xl mx-auto flex items-center justify-between px-6 py-4">
            {/* LOGO */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold">
                U
              </div>
              <span className="font-semibold text-lg tracking-tight">
                URL Shortener
              </span>
            </Link>

            {/* NAV LINKS */}
            <div className="flex items-center gap-6 text-sm font-medium">
              <Link
                href="/"
                className="text-slate-600 hover:text-indigo-600 transition"
              >
                Home
              </Link>

              <Link
                href="/analytics"
                className="text-slate-600 hover:text-indigo-600 transition"
              >
                Analytics
              </Link>
            </div>
          </nav>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-1 max-w-4xl mx-auto w-full p-6">{children}</main>
      </body>
    </html>
  );
}
