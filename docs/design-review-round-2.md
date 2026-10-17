# Design Review, Round 2: WiseSplit (magellan) after the redesign

Reviewed on 2026-10-17 at 375×812 (plus 320px and 1280px), against the local API seeded with `scripts/seed-dev-data.mjs` and signed in as `alicedemo`. Screens: Sign in, Groups, Group details, Expense details, New expense (Details, Paid by, Split in all four modes), Group settings, Add people dialog, New group, Account.

The round-1 issues are fixed: balances are the hero, there is one token set, labels sit above fields, and actions use a sticky footer. This round covers the smaller things that still make screens look slightly off.

---

## Part 1: Design critique

### Overall impression
The app now reads as one product. The "odd" feeling comes from about a dozen small things: avatars that all look the same colour, a footer that floats over content, labels that truncate the most important text, pills and badges that don't match the rest of the system, and primary actions that move between screens.

### Usability
| Finding | Severity | Recommendation |
|---|---|---|
| **Amounts mode starts with a red error.** If you pick *Amounts* before typing anything, a red "Select at least one person." appears, which is the wrong message and comes too early. `split.ts` returns `noParticipants` when every value is empty. | 🔴 Critical | In amounts/percent/shares modes with every value empty, show a neutral notice such as "€20.00 left to assign" or "100% left to assign", not an error. Keep red for real mismatches once the user has typed. |
| **Names get truncated to make room for status labels.** "Board games nig…", "Dinner at Time…", and at large text "F…" or "L…". The right column (label plus amount) never shrinks. | 🟡 Moderate | Give the title `min-width` priority. Put the label ("you lent") and the amount on one line in the right column, or move the label under the amount in the subtitle line ("€96.40 · you borrowed"). |
| **You can't tell people apart by avatar.** Alice, Carol and Dave all hash to the same orange `#B7572B`, and the palette's first colour is the brand green, so group avatars look like buttons. | 🟡 Moderate | Grow the palette to 8–10 hues that avoid brand green. Hash the user id instead of the display name. Never assign two members of the same group the same colour, or at least avoid it for the first N. |
| **Add expense, step 1 asks for currency** even though the group already has one, and the amount (the main input) is only entered on step 2, as a regular 16px field. | 🟡 Moderate | Default currency from the group and tuck it behind a "Change" link. On "Who paid?", make the total a large 28px hero input with the currency symbol. |
| **The Back button on step 1** does the same thing as the top-bar ←. | 🟢 Minor | On step 1, show only a full-width *Continue*. Show *Back* from step 2 onwards. |
| **The Add people dialog** is a centred modal on mobile, the search isn't focused when it opens, the placeholder is cut off ("…or em"), and "People from your other groups will show up here" appears even when those people are already members. | 🟢 Minor | Use a bottom sheet on mobile, autofocus the search, shorten the placeholder to "Username or email", and when everyone known is already a member, say so. |
| **The new-group avatar** shows a big orange "?", which looks like an error state. | 🟢 Minor | Use a neutral `surfaceMuted` circle with an image or camera icon until a name is typed, then show initials. |
| **Expense details has no "you" emphasis** in the split list. Alice sits third in random order. | 🟢 Minor | Sort "you" first (or highlight the row) and show the split method ("Split by exact amounts"). |

### Visual hierarchy
- **What draws the eye first:** the balance card and amounts on Groups and Group details, which is correct. On Expense details it's the generic receipt icon, which is not.
- **Reading flow:** good overall. On Group details the floating *Add expense* footer covers half an expense row as you scroll (the footer gradient is transparent at the top 25%), so the list seems to slide *under* the button.
- **Emphasis:** the Balances rows ("Carol Diaz owes you €261.21") use the same weight and colour for name and amount, while expense rows use right-aligned coloured amounts. One pattern should win: right-aligned coloured amount, name on the left.

### Consistency
| Element | Issue | Recommendation |
|---|---|---|
| Sticky footer | Gradient fade lets content show through behind the button (Group details, New expense). Elsewhere in the app, surfaces are solid. | Use a solid `background` footer with a 1px top `border` (or `shadow.raised`) that appears only once the content scrolls under it. |
| Primary action placement | New expense uses a sticky footer, while New group, Group settings and Account put *Save* inside the card. | Pick one. A sticky footer for every form screen matches round 1. |
| Balance pill (Expense details) | Grey `surfaceMuted` pill with green text and a large radius on a two-line block reads as a blob. Every other positive state uses `positiveSoft`. | Use the same `Balance` treatment as the list rows (label above a coloured amount, no pill), or a `positiveSoft`/`negativeSoft` pill on one line: "You lent €135.00". |
| Expense icon | Every expense shows the same `$` receipt icon, even for EUR/UAH, and it repeats on every row. | Drop the icon from list rows (dates already group them), or use a currency-neutral `Receipt` icon. |
| Bottom nav | The centre *Add expense* label is always brand green, so on the Account tab two items look active. | Keep the green pill icon but give the label the same muted colour as the other inactive tabs. Only the active tab gets green text. |
| Summary card | "You owe —" uses a red dash for zero, and multi-currency totals stack and make the two columns uneven heights. | Show "Nothing" in muted text for zero. Top-align the columns and keep the currencies stacked in both. |
| Case | "Owed to you" / "You owe" (sentence case) next to "you're owed" / "settled up" (lowercase). | Use sentence case for all status labels. |
| Date formats | List: "Mon 12 October". Details: "12 Oct 2026". Input: "10/17/2026". | Use one `formatDate` style (e.g. "Mon, 12 Oct") everywhere outside inputs. |
| Destructive buttons | Three red-outlined *Remove* buttons on Group settings make the members list feel alarming. | Use a quiet `Trash`/`X` `IconButton` or a row overflow (⋯) menu. The confirm dialog already carries the danger. |
| Desktop width | The green top bar is only 560px wide and floats in the middle of a grey page. | Make the top bar background full-bleed and keep only its content at `maxWidth`. |
| Checkbox vs radio | Native checkboxes (square, `accent-color`) next to native radios in the previous step look like two different kits. | Style both to a 22px custom control with matching border and colour, or use a toggle row. |

### What works well
- Balance-first Groups and Group details screens are clear.
- The three-step add-expense flow with a live "Everything adds up" check is excellent.
- Tokens are used consistently. No stray hex values showed up in the screens reviewed.
- Landmarks, headings, `aria-current`, and the visually hidden labels on icon buttons are all in place.

---

## Part 2: Accessibility audit (WCAG 2.1 AA)

**Method:** an automated in-page scan (contrast of every text node, target sizes, accessible names, landmarks, headings) on every screen, plus keyboard checks and token contrast maths. A manual NVDA/VoiceOver pass is still recommended.

### Summary
**Issues found:** 11 | **Critical:** 2 | **Major:** 5 | **Minor:** 4

### Perceivable
| # | Issue | WCAG | Severity | Recommendation |
|---|---|---|---|---|
| 1 | Input borders `#B9C5BF` on white are **1.78:1**, so fields are hard to find for low-vision users. | 1.4.11 Non-text contrast | 🔴 Critical | Darken `borderStrong` to about `#839089` (3.3:1). Keep `border` for card dividers. |
| 2 | Green text on tinted backgrounds fails: "you lent €135.00" pill (`#1E7F57` on `#EEF2F0`) **4.40:1**, and the "Everything adds up" notice (`#1E7F57` on `#E5F3EC`) **4.34:1**. | 1.4.3 Contrast | 🟡 Major | Add a `positiveStrong` token (about `#17694A`) for text on soft backgrounds, or darken `brand` slightly (`#1B7450` gives ≥5:1 on both). |
| 3 | The selected segment is shown only by white on `#EEF2F0` (**1.13:1**) plus a faint shadow and a text-colour shift. | 1.4.11 | 🟡 Major | Add a `borderStrong` outline or a brand-coloured underline/text to the selected segment. |
| 4 | Status is partly carried by colour: "you lent" (green) vs "you borrowed" (red). The text does say it, so this passes, but the 12px label is easy to miss. | 1.4.1 | 🟢 Minor | Keep the label at 13–14px, or add a +/− sign to the amount. |
| 5 | All type sizes are `px`, so the user's browser font-size preference is ignored. Zoom still works, so this is not a hard failure. | 1.4.4 | 🟢 Minor | Move the type scale to `rem`. Also fixes the inconsistent inheritance seen at large text, where only some text scaled. |

### Operable
| # | Issue | WCAG | Severity | Recommendation |
|---|---|---|---|---|
| 6 | **The focus ring is invisible on the green top bar.** Focus `#2B6CB0` on `#1E7F57` is **1.09:1**, which affects Back, Settings and Create group. | 2.4.7 Focus visible | 🔴 Critical | Inside `TopBar`, use a white focus outline (`outline-color: onBrand`). |
| 7 | Text-input focus is only a border colour change: green vs grey is **2.79:1**, and the `brandSoft` glow is **1.14:1** on white. | 2.4.7 | 🟡 Major | Use a 2px `focus` ring (`box-shadow: 0 0 0 2px focus`) instead of `brandSoft`, consistent with the global `:focus-visible`. |
| 8 | `SegmentedControl` uses `role="radio"`, but every option is a Tab stop and arrow keys do nothing. | 2.1.1 / ARIA radio pattern | 🟡 Major | Roving `tabIndex` (0 on the selected option, -1 on the rest) plus ←/→ to move and select. |
| 9 | Targets under the project's 44px `touchTarget`: segmented options 38px tall, *Remove* 36px, *Add people* 36px. All pass AA 2.5.8 (24px) but break the house rule. | 2.5.5 (AAA) / house rule | 🟢 Minor | Use `min-height: theme.layout.touchTarget`, or extend the hit area with padding or a pseudo-element. |

### Understandable
| # | Issue | WCAG | Severity | Recommendation |
|---|---|---|---|---|
| 10 | The Amounts/Percent empty state announces a wrong error ("Select at least one person.") in a `role="status"` region before the user has typed anything. | 3.3.1 Error identification | 🟡 Major | Same fix as critique item 1: show a neutral "€X left to assign" first and give mode-specific messages. |

### Robust
| # | Issue | WCAG | Severity | Recommendation |
|---|---|---|---|---|
| 11 | `document.title` is "WiseSplit" on every route, so screen-reader users get no page-change announcement and browser history is unreadable. | 2.4.2 Page titled | 🟢 Minor | Add a `usePageTitle(t('…'))` hook in `Screen`/`TopBar`: "Lisbon trip · WiseSplit". |

### Colour contrast check
| Element | Foreground | Background | Ratio | Required | Pass? |
|---|---|---|---|---|---|
| Body text | `#14201B` | `#FFFFFF` | 16.8:1 | 4.5:1 | ✅ |
| Muted text | `#5A6A63` | `#F4F6F5` | 5.26:1 | 4.5:1 | ✅ |
| White on brand (top bar, buttons) | `#FFFFFF` | `#1E7F57` | 4.97:1 | 4.5:1 | ✅ |
| Negative on soft | `#B93A26` | `#FBEAE6` | 4.87:1 | 4.5:1 | ✅ |
| Balance pill | `#1E7F57` | `#EEF2F0` | 4.40:1 | 4.5:1 | ❌ |
| "Everything adds up" | `#1E7F57` | `#E5F3EC` | 4.34:1 | 4.5:1 | ❌ |
| Input border | `#B9C5BF` | `#FFFFFF` | 1.78:1 | 3:1 | ❌ |
| Selected segment | `#FFFFFF` | `#EEF2F0` | 1.13:1 | 3:1 | ❌ |
| Focus ring on top bar | `#2B6CB0` | `#1E7F57` | 1.09:1 | 3:1 | ❌ |
| Focus ring on page | `#2B6CB0` | `#F4F6F5` | 4.99:1 | 3:1 | ✅ |
| Avatar initials (orange / teal) | `#FFFFFF` | `#B7572B` / `#2F7F86` | 4.76 / 4.67:1 | 4.5:1 | ✅ |

### Keyboard navigation
| Element | Tab order | Enter/Space | Escape | Arrow keys |
|---|---|---|---|---|
| Top bar icons | ✅ first | ✅ | n/a | n/a |
| Segmented control | ❌ every option is a stop | ✅ | n/a | ❌ none |
| Add people dialog | ✅ trapped (native `<dialog>`) | ✅ | ✅ closes | n/a |
| Avatar picker | ✅ (hidden file input, ring shown on the label) | ✅ | n/a | n/a |
| Split checkboxes and inputs | ✅ | ✅ | n/a | n/a |

### Screen reader (from the accessibility tree)
| Element | Announced as | Issue |
|---|---|---|
| Expense row link | "Fado show tickets €120.00 you lent €70.00, link" | OK |
| Icon buttons | "Back, button" / "Group settings, link" | OK |
| Bottom nav | "Main navigation", current page set | OK |
| Split notice | live `status` | Announces the wrong error early (#10) |
| Page change | (title unchanged) | #11 |

---

## Priority recommendations
1. **Fix focus visibility and field contrast.** These are token-level changes: white focus outline in `TopBar`, a 2px `focus` ring on inputs, darker `borderStrong`, and a `positiveStrong` text colour. They clear both critical a11y issues and make forms look crisper.
2. **Rework the split-step empty state and segmented control.** Neutral "left to assign" notices, a stronger selected segment, and arrow-key support. This is the most-used flow and currently opens with a red error.
3. **Polish the list and footer patterns.** Make avatar colours distinct, let titles win over status labels, use a solid sticky footer and the same footer placement on every form, align the Balances rows with expense rows, and calm the nav and Remove buttons.
