"use client";

import { Check } from "lucide-react";
import { SettingsRow, SettingsSection } from "@/components/settings/settings-section";
import { ThemePreview } from "@/components/settings/theme-preview";
import { Switch } from "@/components/ui/switch";
import { settingsCopy } from "@/content/settings";
import { setPreference, usePreferences } from "@/lib/preferences";
import type { ThemePreference } from "@/lib/preferences-script";
import { cn } from "@/lib/utils";

const copy = settingsCopy.appearance;
const themes = Object.entries(copy.themes) as [ThemePreference, (typeof copy.themes)[ThemePreference]][];

/** Theme with previews, then display options. Everything is saved in this browser. */
export function AppearanceSettings() {
  const preferences = usePreferences();

  return (
    <div className="grid gap-7">
      <section className="grid gap-2.5">
        <div className="grid gap-0.5">
          <h3 id="theme-label" className="text-[0.8125rem] font-semibold text-heading">{copy.theme.title}</h3>
          <p className="text-xs text-muted">{copy.theme.description}</p>
        </div>
        <div role="radiogroup" aria-labelledby="theme-label" className="grid grid-cols-3 gap-3">
          {themes.map(([value, { label, icon: Icon }]) => {
            const selected = preferences.theme === value;
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setPreference("theme", value)}
                className="group grid gap-2 text-left"
              >
                <span
                  className={cn(
                    "block aspect-[16/10] overflow-hidden rounded-md border transition-colors",
                    selected ? "border-accent ring-2 ring-accent-soft" : "border-line-strong group-hover:border-muted",
                  )}
                >
                  <ThemePreview theme={value} />
                </span>
                <span className={cn("flex items-center gap-1.5 text-xs font-medium", selected ? "text-heading" : "text-muted")}>
                  <Icon aria-hidden="true" className="size-3.5" />
                  {label}
                  {selected ? <Check aria-hidden="true" className="ml-auto size-3.5 text-accent" /> : null}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <SettingsSection title={copy.display.title}>
        <SettingsRow label={copy.transparency.label} description={copy.transparency.description} labelId="pref-transparency">
          <Switch
            checked={preferences.reduceTransparency}
            onCheckedChange={on => setPreference("reduceTransparency", on)}
            labelledBy="pref-transparency"
          />
        </SettingsRow>
        <SettingsRow label={copy.compact.label} description={copy.compact.description} labelId="pref-compact">
          <Switch
            checked={preferences.compactTables}
            onCheckedChange={on => setPreference("compactTables", on)}
            labelledBy="pref-compact"
          />
        </SettingsRow>
      </SettingsSection>
    </div>
  );
}
