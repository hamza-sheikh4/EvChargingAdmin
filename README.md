# PakVolt Admin

Internal admin panel. It calls the Express API in `EvChargingBackend` and never talks to the database directly. The structure, tokens and UI components follow `EvChargingLanding`.

## Setup

```bash
npm install
cp .env.example .env   # then edit the values
npm run dev            # http://localhost:3000
npm run build
npm run lint
```

`.env` holds development values with the production ones commented underneath. Swap the comments to point at production.

## Structure

```
src/
  app/                 routes; (dashboard)/ holds every page behind the sidebar
  components/
    ui/                button, card, badge, input, switch, avatar, skeleton, modal, drawer
    layout/            sidebar (nav, signed-in admin, settings), mobile nav
    shared/            logo, page header, empty, error and skeleton states
    settings/          the Settings panel (account, sessions, appearance, general)
    team/              team table, invite and permissions drawer
    health/            API and database status
    providers/         React Query and toasts
  hooks/               admin session, team, health
  config/              site, environment, sidebar links
  content/             all copy
  lib/                 cn(), tokens mirror, formatting
  services/            API client, admin endpoints, token
  styles/              tokens.css (source of truth), themes.css (light and dark), base.css (overlay-surface)
  types/
```

Design tokens live in `src/styles/tokens.css`. `src/lib/tokens.ts` mirrors them for JavaScript; keep both in sync. Copy goes in `src/content`, never inline.

Settings (theme, reduce transparency, compact tables, start page, sounds) are saved in the browser by `lib/preferences.ts`. An inline script in `app/layout.tsx` applies them before the first paint. Surfaces are flat; only overlays (modal, drawer, menus) are frosted. Loading states use `Skeleton`, not spinners.
