import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteNav } from "@/components/site-nav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "qldapm",
  description: "A focused, single-user project and task tracker.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <div className="flex min-h-screen flex-col md:flex-row">
          <aside className="border-b border-zinc-200 bg-white md:w-64 md:shrink-0 md:border-b-0 md:border-r dark:border-zinc-800 dark:bg-zinc-900">
            <div className="px-6 pb-4 pt-6">
              <h1 className="text-2xl font-semibold tracking-tight">qldapm</h1>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Projects, tasks, momentum.
              </p>
            </div>
            <SiteNav />
            <p className="hidden px-6 py-4 text-xs text-zinc-400 md:block dark:text-zinc-600">
              Single-user local MVP
            </p>
          </aside>
          <main className="flex-1 px-6 py-8 sm:px-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
