import { cn } from "@/lib/utils";

type Look = "light" | "dark";

// Fixed colors on purpose: each preview shows its own theme, whatever theme is active.
const looks: Record<Look, { page: string; side: string; line: string; block: string; accent: string }> = {
  light: { page: "bg-[#ffffff]", side: "bg-[#f3f4f3]", line: "border-[#e5e7e5]", block: "bg-[#e3e6e4]", accent: "bg-[#1f7a5a]" },
  dark: { page: "bg-[#0c0e0d]", side: "bg-[#141716]", line: "border-[#232725]", block: "bg-[#262b28]", accent: "bg-[#3ddc97]" },
};

function Mini({ look, className }: { look: Look; className?: string }) {
  const c = looks[look];
  return (
    <div className={cn("flex h-full", c.page, className)}>
      <div className={cn("flex w-[30%] flex-col gap-1 border-r p-1.5", c.side, c.line)}>
        <span className={cn("h-1.5 w-3/4 rounded-[1px]", c.accent)} />
        <span className={cn("h-1 w-full rounded-[1px]", c.block)} />
        <span className={cn("h-1 w-2/3 rounded-[1px]", c.block)} />
        <span className={cn("h-1 w-4/5 rounded-[1px]", c.block)} />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-2">
        <span className={cn("h-1.5 w-1/2 rounded-[1px]", c.block)} />
        <div className={cn("flex-1 rounded-[2px] border", c.line)} />
      </div>
    </div>
  );
}

/** A tiny drawing of the panel in light, dark, or split down the middle for System. */
export function ThemePreview({ theme }: { theme: "light" | "dark" | "system" }) {
  if (theme !== "system") return <Mini look={theme} />;
  return (
    <div className="relative h-full">
      <Mini look="light" className="absolute inset-0" />
      <Mini look="dark" className="absolute inset-0 [clip-path:polygon(55%_0,100%_0,100%_100%,45%_100%)]" />
    </div>
  );
}
