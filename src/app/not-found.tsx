import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFoundCopy } from "@/content/layout";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-4">
      <div className="grid max-w-sm justify-items-center gap-4 text-center">
        <h1 className="text-2xl font-bold text-heading">{notFoundCopy.title}</h1>
        <p className="text-sm text-muted">{notFoundCopy.description}</p>
        <Button asChild>
          <Link href="/">{notFoundCopy.back}</Link>
        </Button>
      </div>
    </main>
  );
}
