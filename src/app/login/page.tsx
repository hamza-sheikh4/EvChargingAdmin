import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { SignedInRedirect } from "@/components/auth/signed-in-redirect";
import { Logo } from "@/components/shared/logo";
import { loginCopy } from "@/content/login";

export const metadata: Metadata = { title: loginCopy.title };

/** The only page outside the dashboard. No sign-up: the super admin adds people from Team. */
export default function LoginPage() {
  return (
    <main className="grid min-h-dvh place-items-center bg-sidebar px-4 py-10">
      <SignedInRedirect />
      <div className="grid w-full max-w-sm gap-6">
        <Logo className="justify-self-center" />
        <div className="rounded-md border border-line bg-surface p-6">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
