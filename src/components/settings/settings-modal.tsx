"use client";

import { X } from "lucide-react";
import { AccountSettings } from "@/components/settings/account-settings";
import { AppearanceSettings } from "@/components/settings/appearance-settings";
import { GeneralSettings } from "@/components/settings/general-settings";
import { SecuritySettings } from "@/components/settings/security-settings";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { settingsCopy, type SettingsCategory, type SettingsGroup } from "@/content/settings";
import { cn } from "@/lib/utils";

type SettingsModalProps = {
  open: boolean;
  category: SettingsCategory;
  onCategoryChange: (category: SettingsCategory) => void;
  onClose: () => void;
};

type CategoryCopy = (typeof settingsCopy.categories)[SettingsCategory];
const categories = Object.entries(settingsCopy.categories) as [SettingsCategory, CategoryCopy][];
const groups = Object.entries(settingsCopy.groups) as [SettingsGroup, string][];

function Body({ category }: { category: SettingsCategory }) {
  if (category === "account") return <AccountSettings />;
  if (category === "security") return <SecuritySettings />;
  if (category === "general") return <GeneralSettings />;
  return <AppearanceSettings />;
}

/**
 * The full settings panel. Categories on the left (a scrolling row on phones), the chosen one on the right.
 * It rises in from below and leaves through the top.
 */
export function SettingsModal({ open, category, onCategoryChange, onClose }: SettingsModalProps) {
  const current = settingsCopy.categories[category];

  return (
    <Modal
      open={open}
      onOpenChange={next => !next && onClose()}
      title={settingsCopy.title}
      className="h-[min(40rem,calc(100dvh-1.5rem))] max-w-settings sm:flex-row"
    >
      <nav
        aria-label={settingsCopy.title}
        className="flex shrink-0 gap-1 overflow-x-auto border-b border-line bg-sidebar/70 p-2 sm:w-52 sm:flex-col sm:gap-4 sm:overflow-visible sm:border-r sm:border-b-0 sm:p-3"
      >
        <p className="hidden px-2 pt-1 text-[0.8125rem] font-semibold text-heading sm:block">{settingsCopy.title}</p>
        {groups.map(([group, groupLabel]) => (
          <div key={group} className="flex gap-1 sm:grid sm:gap-0.5">
            <p className="hidden px-2 pb-1 text-[0.6875rem] font-medium text-muted sm:block">{groupLabel}</p>
            {categories
              .filter(([, item]) => item.group === group)
              .map(([id, { label, icon: Icon }]) => (
                <button
                  key={id}
                  type="button"
                  aria-current={category === id ? "page" : undefined}
                  onClick={() => onCategoryChange(id)}
                  className={cn(
                    "flex h-8 shrink-0 items-center gap-2.5 rounded-sm px-2 text-[0.8125rem] font-medium text-muted transition-colors",
                    "hover:bg-hover hover:text-fg aria-[current=page]:bg-hover aria-[current=page]:text-heading",
                    "aria-[current=page]:[&_svg]:text-accent",
                  )}
                >
                  <Icon aria-hidden="true" className="size-4" />
                  {label}
                </button>
              ))}
          </div>
        ))}
      </nav>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="flex items-start justify-between gap-4 border-b border-line px-6 py-4">
          <div className="grid gap-0.5">
            <h2 className="text-[0.9375rem] font-semibold text-heading">{current.label}</h2>
            <p className="text-xs text-muted">{current.description}</p>
          </div>
          <Button variant="ghost" size="icon-sm" aria-label={settingsCopy.close} onClick={onClose}>
            <X />
          </Button>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <Body category={category} />
        </div>
      </div>
    </Modal>
  );
}
