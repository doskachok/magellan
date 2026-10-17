# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Magellan is the React 19 + TypeScript PWA front-end for the WiseSplit expense-splitting app. Its API is the sibling `Wise Split` repo (`../Wise Split`, ASP.NET Core).

## Commands

Requires Node >= 22.22.

```bash
npm i
npm start                          # Vite dev server on http://localhost:3000
npm run build                      # tsc --noEmit type-check, then vite build to build/
npm run lint                       # eslint .
npm test                           # vitest (watch mode); `npx vitest run` for a single pass
npx vitest run src/path/to/file.test.tsx   # one test file; add -t "name" for one test
```

Create `.env` with `REACT_APP_BASE_URL=<api base url>` before running. The project was migrated from CRA to Vite, and `envPrefix: 'REACT_APP_'` is kept deliberately so CI secrets keep working — read env vars via `import.meta.env.REACT_APP_*`, not `VITE_*`.

Vitest uses jsdom, globals, and `src/setupTests.ts` (jest-dom). Pure logic is unit-tested next to its source (e.g. `features/expenses/split.test.ts`).

**Local full stack**: start Postgres/Mongo and the API from `../Wise Split` (see its CLAUDE.md), point `.env` at it (`REACT_APP_BASE_URL=http://localhost:5236/`), then `node scripts/seed-dev-data.mjs` creates demo users, groups and expenses (sign in as `alicedemo`; the password is in the script).

Deployment is Firebase Hosting (project `magellan2022-613c2`, serves `build/` with SPA rewrite) via GitHub Actions: push to `develop` deploys live, PRs get a preview channel, and a `/deploy` PR comment deploys to the `preview` channel.

## Architecture

- **Layout**: `src/app` (App shell, `router.tsx`), `src/components` (shared UI kit, re-exported from `components/index.ts`), `src/features/<feature>/` (`auth`, `groups`, `expenses`, `users`, `account`) with `api.ts`, `types.ts` and `*Page.tsx` screens, `src/store` (Redux store, API base, auth slice, error toasts), `src/lib` (routes, formatting, config, small hooks), `src/theme` (design tokens + global styles).
- **Import aliases** (`tsconfig.json` paths, resolved natively by Vite via `resolve.tsconfigPaths`): `components`, `features/*`, `store`, `store/*`, `lib/*`, `theme/*`, `assets/*`.
- **Data layer is RTK Query.** One `api` (`store/api.ts`, `reducerPath: 'api'`); features add endpoints with `api.injectEndpoints`. Server data lives only in the RTK Query cache — read it with the generated hooks, never copy it into slices. Invalidation uses `ApiTag` (`Groups`, `Group`/`Debts`/`Transaction`/`User` by id, `KnownUsers`). API paths are kebab-case to match the backend's slugified routes (e.g. `transaction-groups`).
- **Auth**: `store/authSlice.ts` holds only `{ token, userId }`. The `signIn` endpoint dispatches `credentialsReceived` from `onQueryStarted`; a listener middleware persists credentials to `localStorage` and, on `loggedOut`, clears them and resets the API cache. `baseQueryWithReauth` retries once after `users/refreshed-token` on 401 (concurrent 401s share one refresh) and logs out if that fails. The current user is `useCurrentUser()` (`features/users/api.ts`).
- **Errors**: `errorToastMiddleware` (`store/errors.ts`) toasts every rejected API call (ProblemDetails `detail`, else the first field error). Screens only handle errors they can act on, e.g. mapping field errors onto a form with `getFieldErrors`.
- **Routing** (react-router v8 data router, `app/router.tsx`): pages are `lazy()`-loaded; `RequireAuth` / `RedirectIfAuthenticated` guard the two route trees. Build URLs with `routes.*` and declare paths with `routePatterns.*` (`lib/routes.ts`) — never hand-write path strings. Adding an expense is a single route, `/expenses/new?groupId=…`, whose three steps (details → paid by → split) are local `useReducer` state (`features/expenses/new/draft.ts`).
- **Split rules**: `features/expenses/split.ts` turns the UI state into `payerDetails` / `partialsAssignments` and mirrors the API's `TransactionUtils.AmountCheck` (amounts sum to the total, percentages to 100, shares > 0, at least one participant). Keep the two in sync and extend `split.test.ts` when changing either.
- **Forms**: react-hook-form + `yupResolver`; yup messages are i18n keys from the `validation` namespace. Fields are `TextField` / `SelectField` (`components/Field.tsx`), which always render a visible label and hint/error text wired via `aria-describedby`.
- **Dialogs**: `Dialog` / `ConfirmDialog` (`components/Dialog.tsx`) wrap the native `<dialog>` and are controlled with local `open` state where they are used.
- **Styling**: styled-components v6 with the typed theme in `theme/theme.ts` (colors, type scale, `space()`, radii, shadows, layout sizes) — use tokens, not literal values. Component-only props must be transient (`$prop`). Files that export React components export only components; shared styled pieces live in `*.styles.ts` (react-refresh lint rule). Screens compose `Screen` + `TopBar` (+ optional sticky `footer`, `withNav` for top-level tabs), `Card`/`CardList`, `ListRow`, `Section`, `Balance`. Icons come from `lucide-react`; icon-only controls must use `IconButton`/`IconLink` (which require a `label`).
- **i18n**: i18next with the HTTP backend loading `public/locales/en/<namespace>.json`; namespaces are `common` (default), `auth`, `validation`, `groups`, `expenses`, `account`. `keySeparator` is disabled, so keys are flat strings; plurals use `_one` / `_other`. Money and dates go through `lib/format.ts` (`Intl`), not string concatenation.
- **PWA**: `vite-plugin-pwa` in `injectManifest` mode with `src/service-worker.js`; registration is manual via `serviceWorkerRegistration.js` and the manifest is `public/manifest.json` (plugin's own register/manifest are disabled).
