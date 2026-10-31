import { AuthGuard } from "@/components/auth/auth-guard";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { StartPage } from "@/components/layout/start-page";
import { SettingsProvider } from "@/components/settings/settings-provider";
import { Suspense } from "react";
import { layoutCopy } from "@/content/layout";

/** Signed-in admins only. Sidebar on the left, the section's page on the right, Settings as a modal over both. */
export default function DashboardLayout({ children }: LayoutProps<"/">) {
  return (
    <AuthGuard>
      <SettingsProvider>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-sm focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-heading focus:shadow-overlay"
        >
          {layoutCopy.skipToContent}
        </a>
        <Suspense>
          <StartPage />
        </Suspense>
        <Sidebar />
        <MobileNav />
        <main id="main" className="lg:pl-sidebar">
          <div className="mx-auto grid w-full max-w-content gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
        </main>
      </SettingsProvider>
    </AuthGuard>
  );
}
