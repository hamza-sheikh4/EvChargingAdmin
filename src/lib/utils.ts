import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge about the custom theme keys in styles/tokens.css,
// so classes like rounded-md and shadow-overlay resolve conflicts correctly.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      radius: ["xs", "sm", "md", "lg"],
      shadow: ["overlay"],
      spacing: ["sidebar", "topbar", "row"],
      container: ["content", "drawer", "drawer-wide", "settings"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** "Ayesha Khan" becomes "AK". */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join("");
}
