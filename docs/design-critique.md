# Design Critique: WiseSplit (magellan) mobile PWA — pre-redesign

Reviewed at 375×812 against a local API seeded with `scripts/seed-dev-data.mjs`. Screens: Login, Register, Groups, Group details, Group edit (Main info / Members / Statistics), Add member modal, Add expense (Main info → Payers → Participants), Expense details, Account settings.

### Overall Impression
The app has a recognisable brand colour and the core flows exist, but it never answers the one question a split app must answer at a glance — **"who owes whom, and how much?"** The balance data (`yourPart`, `/optimized-debts`) exists in the API but is either hidden or unused. Screens also feel like five different apps: green full-bleed forms, giant "half-circle" blobs, carousel tabs, and underlined text acting as primary buttons.

### Usability
| Finding | Severity | Recommendation |
|---------|----------|----------------|
| Groups list shows only names — no balance, though the API returns `yourPart` per group. "I lent / I borrowed" filters are the only hint. | 🔴 Critical | Show per-group balance ("you're owed €135" / "you owe ₴920" / "settled") on every row and a summary at the top. |
| Group details lists expenses but never shows member balances or suggested settlements; the `/optimized-debts` endpoint is unused. | 🔴 Critical | Add a "Balances" section with "Bob owes you €24" style rows from optimized debts. |
| Split step: "Percentage" and "Adjustment" tabs render placeholder text (`PercentageSplitMethodView`); "4/4 members in transaction" looks tappable but does nothing — you can't exclude anyone from an equal split. | 🔴 Critical | Ship working methods only (Equally with per-person toggles, Exact amounts, Percentages, Shares), with a live "remaining" indicator. |
| Entering what each payer paid needs a modal per person, and the expense amount is never entered directly. | 🟡 Moderate | Default "You paid the full amount" with an amount field; allow switching to "multiple people paid" with inline amount inputs. |
| "Forgot your password?" links to a route that doesn't exist. | 🟡 Moderate | Remove until the backend supports it. |
| Primary actions are inconsistent: pill button bottom-right (Login, Save group), underlined link (Next step, Save), button hidden entirely when invalid (Save expense). | 🟡 Moderate | One full-width primary button in a sticky footer; disabled state + a reason, never hidden. |
| Group edit uses a swipe carousel with a "Statistics — Not implemented" slide; swipe conflicts with scrolling and inputs. | 🟡 Moderate | Single settings page: details card + members card. Drop the carousel and the empty tab. |
| Removing a member: tap row → tick/cross icons with "Remove user?" text; icons have no labels. | 🟡 Moderate | Explicit "Remove" button → confirmation dialog naming the person. |
| Bottom nav has no labels or active state; centre button opens add-expense without a group from the profile screen. | 🟢 Minor | Labelled tabs with active state; contextual "Add expense" pre-fills the current group. |
| Log out is a small link with no confirmation, placed above "Save changes". | 🟢 Minor | Separate "Log out" row at the bottom with confirmation. |

### Visual Hierarchy
- **What draws the eye first**: the green header and huge placeholder avatar (Edit / Account) or the green "blob" (Add expense) — decoration, not content. On Groups it's the filter tabs, not your money.
- **Reading flow**: forms float on a green field; the main action sits far below, sometimes under a curved shape, so the eye ends on empty space.
- **Emphasis**: amounts are the most important data but use 11–13px light text; "you lent / you borrowed" hints are 11px coloured text.

### Consistency
| Element | Issue | Recommendation |
|---------|-------|----------------|
| Colour | Two greens (`#379970`, `#00A862`) plus `#28a745` and `#FF2121` for money; hard-coded `#000`, `#ddd`, `lightgrey`. | One token set: brand, surface, text, positive, negative, border. |
| Typography | 9px, 11px, 12px, 14px, 16px, 17px, 18px, 23px with weights 100–700, chosen per screen. | Type scale: 12 / 14 / 16 / 20 / 28 with 400 / 600. |
| Inputs | Placeholder is the label until you type; required "*" floats in different positions; error text replaces the label. | Persistent label above field, hint/error below. |
| Surfaces | Green-on-white and white-on-green forms alternate between screens. | Neutral background, white cards, brand colour reserved for actions and the header. |
| Icons | Mixed stroke/fill SVGs at different sizes, several used as click targets without buttons. | One icon set (lucide), always inside a labelled button. |

### Accessibility
- **Color contrast**: white on `#379970` ≈ 3.6:1 — fails AA for body text (all forms on green). Faded white labels (`rgba(255,255,255,.5)`) ≈ 1.8:1. Red error text on green fails. 11px weight-100 hints fail on readability.
- **Touch targets**: header back/edit icons, member remove icons and filter tabs are raw SVGs ~20–24px without button semantics or focus styles.
- **Text readability**: `user-scalable=no, maximum-scale=1` blocks pinch zoom (WCAG 1.4.4). Body has no background colour, so forced dark-mode renders black text on dark grey.
- **Semantics**: clickable `div`s and SVGs, inputs without `<label>`, avatar `alt="Img"`, page title "React App".

### What Works Well
- Brand green is distinctive and appropriate for money/positive balances.
- Expenses grouped by date with "you lent / you borrowed" per row is the right model.
- Live password requirement checklist on Register is helpful.
- Bottom navigation with a central "add expense" action matches the primary job.

### Priority Recommendations
1. **Make balances the hero** — group list balances + summary, group "Balances" section from optimized debts, "you" highlighted in expense details.
2. **Rebuild the add-expense flow** — one screen per step with a stepper, inline payer amounts, four working split methods with live validation that mirrors the API's rules.
3. **Adopt a single design system** — tokens, labelled inputs, one primary button style in a sticky footer, cards on a neutral background, accessible contrast, zoom allowed.
