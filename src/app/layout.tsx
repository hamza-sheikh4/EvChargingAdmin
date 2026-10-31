import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers/query-provider";
import { InlineScript } from "@/components/shared/inline-script";
import { siteConfig } from "@/config/site";
import { preferencesScript } from "@/lib/preferences-script";
import { canvas } from "@/lib/tokens";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Private tool: never indexed.
export const metadata: Metadata = {
  title: { default: siteConfig.title, template: `%s | ${siteConfig.title}` },
  description: siteConfig.description,
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: canvas.light },
    { media: "(prefers-color-scheme: dark)", color: canvas.dark },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // The preferences script sets data-theme before React loads, so html is allowed to differ.
    <html lang="en" data-theme="light" className={inter.variable} suppressHydrationWarning>
      <head>
        <InlineScript html={preferencesScript} />
      </head>
      {/* Browser extensions add attributes to body before React loads. This ignores them on body only. */}
      <body className="min-h-dvh" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
