# WiseSplit feature roadmap

Reviewed 2026-10-17 against `magellan` (React PWA) and `Wise Split` (ASP.NET Core API).

## What the app does today

- Sign up / sign in with username or email, JWT with refresh. Edit display name and avatar.
- Groups: create, rename, set a default currency and avatar, add members (search or "people you know"), remove members (the owner can't leave; members with debts can't be removed).
- Expenses: 3-step flow (details → paid by → split). Supports several payers and four split methods: equal, exact amounts, percent, shares. Expenses can be in any currency.
- Balances: debts simplified per currency (`DebtsOptimizer`), an overall "owed to you / you owe" summary, and filters on the groups list.
- Settle up: record a full or partial repayment between a debtor and a lender.
- Statistics per group: totals, who paid, whose spending, paid vs. share, spending by month, largest expenses.
- PWA shell, i18n setup (English only), file storage (avatars only).

## Gaps found in the code (fix before new features)

| Gap | Where | Why it matters |
|---|---|---|
| **No membership checks.** Any signed-in user can read any group, its expenses, debts and statistics, and can add members, edit the group or edit expenses if they know the id. | `TransactionGroupService.FetchAsync/UpdateAsync/AddParticipant/GetOptimizedDebts/GetStatistics`, `TransactionService.FetchAsync/UpdateAsync/GetList` | Privacy and data integrity. This is a security bug, not a feature. |
| **You can't edit or delete an expense in the UI.** `PUT /transactions` exists, but the front end never calls it, and there's no delete endpoint. | `features/expenses`, `TransactionsController` | Typos and duplicates happen all the time. Without edit/delete, the balances end up wrong for good. |
| **You can't delete or archive a group, or leave one yourself.** | `TransactionGroupsController` | Finished trips clutter the list forever. |
| **Account activation is a stub** (`ActivateAsync` throws `NotImplementedException`). There's no email verification and no password reset. | `UsersService` | Users who forget their password lose their account. |

## Feature list, ranked by value to users

Value: 🔴 high, 🟡 medium, 🟢 nice to have. Effort: S / M / L (rough, both repos).

### Tier 1: needed to trust the app every day

| # | Feature | Value | Effort | Notes |
|---|---|---|---|---|
| 1 | **Edit and delete expenses and repayments** | 🔴 | S–M | Reuse the 3-step flow prefilled from the expense. Soft delete with "Undo" in a toast. Only members may do it, and the change is logged (see #6). |
| 2 | **Password reset and email verification** | 🔴 | M | Needs an email sender (SendGrid, SES etc.) and a token flow. Finishing `ActivateAsync` is part of this. |
| 3 | **Invite people who aren't signed up yet** | 🔴 | M | Share an invite link or QR code that opens the group. Also allow "placeholder" members (a name only) who can claim their spot later. This is the biggest blocker to getting started: today everyone has to register first. |
| 4 | **Notifications** | 🔴 | M–L | Push (the PWA already has a service worker) and/or email: "Bob added Dinner, you owe €12", "Carol paid you back", a weekly reminder to settle up. |
| 5 | **Expense notes and receipt photo** | 🔴 | S | The storage service and Mongo file store already exist. Add a `Note` and `ReceiptFileIds` to `Transaction` and a "Attach receipt" button. |
| 6 | **Activity feed / change history** | 🟡 | M | "Alice edited Taxi: €20 → €25". The `ITrackable` audit fields are there, but a proper event log is needed. Builds trust when several people edit the same group. |
| 7 | **Delete, archive and leave group** | 🟡 | S | Archive hides settled groups. "Leave" is allowed when your balance is zero. |

### Tier 2: makes it faster and nicer than a spreadsheet

| # | Feature | Value | Effort | Notes |
|---|---|---|---|---|
| 8 | **Categories** (food, transport, lodging, …) with icons | 🟡 | S | Fixes the identical "$" icon from the design review, and gives the statistics a "by category" chart. Could be guessed from the description. |
| 9 | **Search and filter expenses** in a group (text, payer, date range, category) | 🟡 | S–M | `TransactionListFilter` only has `GroupId` today. Add paging too: `FetchAsync` loads every expense of the group. |
| 10 | **Currency conversion** | 🟡 | M–L | Debts are kept per currency, so a trip in EUR + CZK leaves two separate debts. Add "settle all in EUR" with a daily exchange rate (stored on the expense via `PaymentDateUtc`), plus showing the converted total. |
| 11 | **Recurring expenses** (rent, subscriptions, utilities) | 🟡 | M | Monthly/weekly template that adds the expense automatically. Key for flatmates and couples. |
| 12 | **Pay-back links** | 🟡 | S–M | On "Settle up", show the lender's payment handle (Revolut, PayPal, Monzo, IBAN, local apps) with a copy/deep link, then record the repayment automatically. |
| 13 | **Offline add expense** | 🟡 | M | Queue new expenses in the service worker and sync when back online. Trips often have bad signal. |
| 14 | **Friends view / 1-to-1 balances across groups** | 🟡 | M | "Across all groups, Bob owes you €40." Allows one combined settle-up. |
| 15 | **Export** (CSV / PDF summary of a group) | 🟢 | S | For records, reimbursement, or leaving the app. |

### Tier 3: smart and differentiating

| # | Feature | Value | Effort | Notes |
|---|---|---|---|---|
| 16 | **Receipt scanning (OCR)** | 🟢 | L | Read the total, date and merchant from a photo. Later: itemised split, where each line is assigned to people. |
| 17 | **Itemised split** (split a bill line by line) | 🟢 | M | Great for restaurants and groceries. Can come before OCR with manual entry of items. |
| 18 | **Default split per group** | 🟢 | S | e.g. a couple at 60/40, or a member who joined halfway at 0 shares. Saves typing on every expense. |
| 19 | **Group budget** | 🟢 | M | "Trip budget €2,000, €1,340 spent." Fits the existing statistics screen. |
| 20 | **Personal spending overview** | 🟢 | M | Your share across all groups by month and category. |
| 21 | **Import** from Splitwise / Tricount CSV | 🟢 | M | Reduces the cost of switching apps. |
| 22 | **More languages** | 🟢 | S per language | i18n is already set up; only `en` exists. |
| 23 | **Dark mode** | 🟢 | S | Tokens are central in `theme.ts`, so this is mostly a second palette. |
| 24 | **Sign in with Google / Apple** | 🟢 | M | Fewer sign-up drop-offs, especially combined with invite links (#3). |

## Suggested order

1. Security fix (membership checks), then **edit/delete expense** (#1). Both are small and protect existing data.
2. **Invite links + placeholder members** (#3) and **password reset** (#2). These unlock growth and keep users from getting locked out.
3. **Notes/receipts** (#5), **categories** (#8), **archive group** (#7). Quick wins.
4. **Notifications** (#4) and **activity feed** (#6), which share the same event model, so build them together.
5. Then currency conversion, recurring expenses and pay-back links, based on who the users turn out to be (travellers vs. flatmates).
