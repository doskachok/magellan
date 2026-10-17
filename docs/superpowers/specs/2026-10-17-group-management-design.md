# Group management features: design

Date: 2026-10-17. Covers both repos: `Wise Split` (API) and `magellan` (front end).

## Goal

Make WiseSplit trustworthy for everyday use. People can fix mistakes, see who changed what, track people who haven't signed up yet, attach optional notes and receipts, and tidy up finished groups, all without anyone outside a group seeing its data.

## Scope

In scope (numbers from `docs/feature-roadmap.md`):

| Item | Feature |
|---|---|
| prerequisite | Group membership checks on every group/expense endpoint |
| #1 | Edit and delete (with restore) expenses and repayments |
| #3 (part) | Placeholder members (name only), replaceable by a real user |
| #5 | Optional note and optional receipts on an expense |
| #6 | Group activity feed + per-expense history |
| #7 | Personal archive, leave group, remove member, delete group |

Out of scope: password reset / email verification (#2) and notifications (#4), both waiting on SMTP; invite links (part of #3); everything below the top 7.

## Decisions

| Topic | Decision |
|---|---|
| Who can edit/delete expenses and repayments | Any group member. The activity log records who did it. |
| Activity recording | Explicit typed events written by the services in the same `SaveChanges` (not an automatic EF hook, not event sourcing). |
| Deleting | Soft delete (`DeletedAt`, `DeletedBy`) on `Transaction` and `TransactionGroup`, with EF global query filters. |
| Placeholders | `User` rows with `IsPlaceholder = true`, no password, generated hidden username. |
| Archive | Personal (per user), stored in a separate `GroupArchives` table. The existing groups ↔ users many-to-many stays. |
| Delete group | Owner only, only when nobody in the group owes anything. Soft. |
| Owner leaving | Must name a registered member as the new owner. If they are the last member, they delete instead. |
| Leave / remove rule | Allowed only when no optimized debt involves that person, in any currency. |
| Receipts | Up to 5 per expense; JPEG, PNG, WebP or PDF; at most 5 MB each; images shrunk in the browser before upload. |
| Activity UI | Per-group Activity screen + History section on each expense. No global feed. |

## Back end (`Wise Split`)

### Data model (one EF migration)

- `Transaction`: add `Note` (`string?`, max 500), `DeletedAt` (`DateTime?`), `DeletedBy` (`Guid?`). Global query filter `DeletedAt == null`.
- `TransactionGroup`: add `DeletedAt`, `DeletedBy`. Global query filter `DeletedAt == null`.
- `User`: add `IsPlaceholder` (`bool`, default false).
- New `TransactionReceipt`: `Id`, `TransactionId` (FK), `FileId` (Mongo id), `FileName`, `ContentType`, `Size`, `CreatedAt`, `CreatedBy`.
- New `GroupArchive`: composite key (`UserId`, `GroupId`), `ArchivedAt`.
- New `GroupActivity`: `Id`, `GroupId` (FK), `ActorId` (FK user), `Type` (enum, stored as int), `TransactionId` (`Guid?`), `SubjectUserId` (`Guid?`), `Details` (`jsonb`), `CreatedAt`. Index on (`GroupId`, `CreatedAt` desc) and on `TransactionId`.

`Details` shape: `{ "name": "<expense or group name>", "changes": [{ "field": "amount", "from": "20.00", "to": "25.00" }], "amount": "12.40", "currency": "EUR" }`. All keys are optional. Values are invariant-culture strings; the front end formats them.

`GroupActivityType`: `GroupCreated`, `GroupEdited`, `MemberAdded`, `MemberRemoved`, `MemberLeft`, `PlaceholderAdded`, `PlaceholderReplaced`, `OwnershipTransferred`, `ExpenseAdded`, `ExpenseEdited`, `ExpenseDeleted`, `ExpenseRestored`, `RepaymentAdded`, `RepaymentEdited`, `RepaymentDeleted`, `RepaymentRestored`, `ReceiptAdded`, `ReceiptRemoved`.

Diffed expense fields: `name`, `date`, `currency`, `amount` (total), `note`, `payers` (summary string, e.g. "Alice 20.00, Bob 5.00"), `split` (method + per-person summary).

### New services (registered in `CoreModule`)

- `IGroupAccess`: `EnsureMemberAsync(groupId, ct)` and `EnsureMemberOfTransactionAsync(transactionId, ct)`. They use the current `AuthorizedUserData.Id` and throw `NotFoundException` when the group (or transaction) is missing or deleted or the user is not a participant.
- `IActivityLog`: `Add(groupId, type, transactionId?, subjectUserId?, details?)`. It only adds to the `DbContext`; the caller's `SaveChangesAsync` persists it. Also `GetGroupFeedAsync(groupId, before?, limit)` and `GetTransactionHistoryAsync(transactionId)`.
- `TransactionDiff` (pure, in `WiseSplit.Domain` or `Core`): compares two transaction snapshots and returns the change list.

### Endpoints

Every endpoint below, and every existing group/expense endpoint, calls `IGroupAccess` first.

| Method and path | Who | Behaviour |
|---|---|---|
| `GET /transaction-groups?archived=false\|true` | member | Lists your non-deleted groups, filtered by your archive state. `GroupListView` gets `IsArchived`. |
| `PUT /transaction-groups` | member | Existing. Logs `GroupEdited` with the changed fields. |
| `DELETE /transaction-groups/{id}` | owner | 403 (`NotAllowedException`) if any debt exists. Soft delete. |
| `POST /transaction-groups/{id}/archive` / `DELETE …/archive` | member | Personal archive / unarchive. Idempotent. |
| `POST /transaction-groups/{id}/leave` `{ newOwnerId? }` | member | Fails if you are in any debt. Owner: `newOwnerId` must be a registered member other than yourself, else 400. If you are the only registered member, 403 "delete the group instead". Logs `OwnershipTransferred` (if any) and `MemberLeft`. Also removes your archive row. |
| `POST /transaction-groups/{id}/participants` | member | Existing. Rejects placeholders as the added user. Logs `MemberAdded`. |
| `DELETE /transaction-groups/{id}/participants/{userId}` | owner for registered users; any member for placeholders | Fails if that user is in any debt. Owner can't remove themselves this way (use leave). Logs `MemberRemoved`. |
| `POST /transaction-groups/{id}/placeholders` `{ name }` | member | Name 1–64 characters. Creates the placeholder user and adds it to the group. Logs `PlaceholderAdded`. |
| `POST /transaction-groups/{id}/placeholders/{pid}/replace` `{ userId }` | member | `pid` must be a placeholder in the group. `userId` must be a registered user who is not a member yet. Re-points that group's `PayerDetail.PayerId` and `PartialsAssignment.UserId` from `pid` to `userId`, adds the user, removes and deletes the placeholder. All in one database transaction. Logs `PlaceholderReplaced`. |
| `GET /transaction-groups/{id}/activity?before=<ISO time>&limit=30` | member | Newest first, max 100 per page. Each item has actor (`UserView`), type, `TransactionId`, subject user, details, time, and `CanRestore` (deleted transaction still in the soft-deleted state). |
| `POST /transaction-groups/{id}/settlements` | member | Existing. The "debtor or lender only" rule now also allows any member when the debtor or the lender is a placeholder. Logs `RepaymentAdded`. |
| `POST /transactions` | member | Existing. Accepts optional `Note`. Logs `ExpenseAdded`. |
| `PUT /transactions` | member | Existing. Accepts `Note`. Locked (403) if the expense involves a user who is no longer in the group. For repayments, only amount and date may change, and the amount is capped by current debt + the repayment's current amount. Logs `ExpenseEdited` / `RepaymentEdited` with the diff (nothing logged when nothing changed). |
| `DELETE /transactions/{id}` | member | Same former-member lock. Soft delete. Logs `ExpenseDeleted` / `RepaymentDeleted`. |
| `POST /transactions/{id}/restore` | member | Restores a soft-deleted transaction if its group still exists and every involved user is still a member. Logs `…Restored`. |
| `GET /transactions/{id}/history` | member | All activity rows for that transaction, oldest first. |
| `POST /transactions/{id}/receipts` (multipart, one file) | member | Max 5 per transaction, allowed types by content type and extension, max 5 MB (`RequestSizeLimit`). Stores bytes in Mongo through `StorageService`. Logs `ReceiptAdded`. |
| `GET /transactions/{id}/receipts/{receiptId}` | member | Streams the file with its stored content type. |
| `DELETE /transactions/{id}/receipts/{receiptId}` | member | Deletes the row and the Mongo document. Logs `ReceiptRemoved`. |

`TransactionView` gets `Note`, `Receipts` (id, file name, content type, size), `IsLocked` (involves a former member). `TransactionListView` gets `HasNote` and `ReceiptCount`. `UserView` gets `IsPlaceholder`.

### Placeholders elsewhere

- Excluded from sign-in (`AuthorizationService` rejects them), `GET /users?startsWith`, `GET /users/knowns`, and from being added through `/participants`.
- Username is `placeholder-<guid without dashes>`, email empty, `Name` set from the request.

### Errors

Use the existing exceptions only: `NotFoundException` (404) for missing / not a member / deleted, `NotAllowedException` (403) for role and balance rules, `ArgumentException` (400) for bad input. Messages are short user-readable sentences, because the front end toasts `detail`.

## Front end (`magellan`)

### API layer

New endpoints in the matching `features/*/api.ts`, using existing tags plus a new `Activity` tag by group id. Edit/delete/restore invalidate `Group`, `Debts`, `Transaction`, `Groups` and `Activity`. Receipts are fetched with the auth header and turned into blob URLs (a small `useReceiptUrl` hook that revokes on unmount).

### Screens

- **Expense details**: Edit and Delete in the top bar (disabled with an explanation when `isLocked`). Delete → `ConfirmDialog` → back to the group, toast with Undo (calls restore). Optional Note, Receipts (thumbnails / PDF icon, tap to open) and History sections, each shown only when it has content. Repayments: Edit opens a dialog with amount and date.
- **Edit expense**: route `routes.editExpense(groupId, expenseId)` = `/groups/:groupId/expenses/:expenseId/edit`. Reuses `NewExpensePage` with the draft built from the expense by a pure `draftFromExpense` (`draft.ts`, unit-tested). Step 1 gets an optional Note (textarea, max 500) and an optional Receipts picker (max 5; images resized client-side to at most 2000 px on the long side, JPEG quality 0.85; PDFs as is). Uploads run after a successful save; a failed upload doesn't undo the save and is reported per file.
- **Activity**: route `/groups/:groupId/activity`, reached by an icon in the group top bar. Day-grouped list, "Load more" by cursor, Restore on lines whose `canRestore` is true. Text comes from a pure `describeActivity(item, currentUserId, t)` (unit-tested), using i18n keys in a new `activity` namespace.
- **Group settings**: member rows get an overflow menu (Remove / Replace with a real person), with disabled items showing why ("Settle up first: owes €12.40"). The Add people dialog gets "Add someone who isn't signed up" (name field). A new Group section has Archive/Unarchive, Leave group (new-owner picker for the owner; becomes Delete for the last member) and Delete group (owner, only when everyone is settled), each with a `ConfirmDialog`.
- **Groups list**: archived groups are hidden. An "Archived (N)" link at the bottom shows them with Unarchive.
- **Placeholders**: a small muted "not signed up" label next to their name in member lists, payer and split pickers.

## Testing

- Back end: integration tests (Testcontainers, `PostgreDbFixture` pattern) for every rule: non-member 404 on each endpoint, edit/delete/restore including the former-member lock and repayment cap, leave/remove balance rule and owner hand-over, delete-group rule, archive filter, placeholder add/replace (re-pointed rows and debts unchanged), receipt limits, and the activity rows written for each action. Unit tests for `TransactionDiff`.
- Front end: Vitest for `draftFromExpense`, `describeActivity`, and the image resize size maths. Then a browser check of each flow against the local API seeded with `scripts/seed-dev-data.mjs` (the script also gets one placeholder member and a deleted expense).
- Both `dotnet test` and `npx vitest run` + `npm run lint` + `npm run build` must pass.

## Delivery

A feature branch in each repo (`feature/group-management`). Back end first (migration, services, endpoints, tests), then front end. No commits or pushes to `master` / `develop` without your OK; pushing `develop` deploys live.
