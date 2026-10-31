"use client";

import { SettingsRow, SettingsSection } from "@/components/settings/settings-section";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { sidebarNav } from "@/config/navigation";
import { settingsCopy } from "@/content/settings";
import { setPreference, usePreferences } from "@/lib/preferences";

const copy = settingsCopy.general;
// Locked sections have no page yet, so they cannot be the start page.
const pages = sidebarNav.flatMap(group =>
  group.items.filter(item => !item.locked).map(item => ({ value: item.href, label: item.label })),
);

/** Where the panel opens, and alert sounds. */
export function GeneralSettings() {
  const preferences = usePreferences();

  return (
    <div className="grid gap-7">
      <SettingsSection>
        <SettingsRow label={copy.startPage.label} description={copy.startPage.description} labelId="pref-start">
          <Select
            aria-labelledby="pref-start"
            options={pages}
            value={preferences.landingPage}
            onChange={page => setPreference("landingPage", page)}
          />
        </SettingsRow>
      </SettingsSection>
      <SettingsSection title={copy.alerts.title}>
        <SettingsRow label={copy.sounds.label} description={copy.sounds.description} labelId="pref-sounds">
          <Switch
            checked={preferences.sounds}
            onCheckedChange={on => setPreference("sounds", on)}
            labelledBy="pref-sounds"
          />
        </SettingsRow>
      </SettingsSection>
    </div>
  );
}
