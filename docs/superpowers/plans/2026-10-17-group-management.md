# Group Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membership checks, edit/delete/restore of expenses and repayments, placeholder members, optional notes and receipts, a group activity feed with per-expense history, and personal archive / leave / remove / delete for groups.

**Architecture:** API first (`Wise Split`): one EF migration, two new services (`IGroupAccess`, `IActivityLog`) that the existing services call, plus new endpoints on the existing controllers. Then the front end (`magellan`): new RTK Query endpoints, and screens built from the existing UI kit.

**Tech Stack:** .NET 10, EF Core + Npgsql, MongoDB driver, Autofac, AutoMapper 14, FluentValidation, xUnit v3 + Testcontainers; React 19, RTK Query, react-router 8, styled-components 6, i18next, react-hot-toast, Vitest.

**Spec:** `magellan/docs/superpowers/specs/2026-10-17-group-management-design.md`

## Global Constraints

- Branch `feature/group-management` in **both** repos (`Wise Split` from `master`, `magellan` from `develop`). Never push `develop` (it deploys live) or `master` without the user's OK.
- Back-end conventions from `Wise Split/CLAUDE.md`: Autofac registration in `CoreModule`, `?? throw new ArgumentNullException` guards, `ConfigureAwait(false)` on every await, `CancellationToken` passed through, errors only via `NotFoundException` (404), `NotAllowedException` (403), `ArgumentException` (400). AutoMapper stays on 14.x.
- DB tests use `PostgreDbFixture` (Testcontainers), never InMemory/SQLite. Model changes need a migration.
- Front-end conventions from `magellan/CLAUDE.md`: `routes.*` / `routePatterns.*` only, theme tokens only, transient `$props`, icon-only controls via `IconButton`/`IconLink` with `label`, i18n keys flat, money and dates through `lib/format.ts`.
- Limits copied from the spec: note max **500** characters; up to **5** receipts per expense; types **JPEG, PNG, WebP, PDF**; max **5 MB** each; images resized to at most **2000 px** on the long side at JPEG quality **0.85**; placeholder name **1–64** characters; activity page **30** by default, max **100**.
- Leave / remove rule: allowed only when **no optimized debt involves that person, in any currency**.
- Any member may edit/delete/restore expenses and repayments. Expenses that involve a user who is no longer a member are **locked** (403).
- Activity cursor: `before` is an **activity id**, not a time (refines the spec), and order is (`CreatedAt` desc, `Id` desc), so rows with the same timestamp are never skipped.

## Review Focus

1. **Deleted expenses must vanish from balances, statistics and the group list.** The global query filter does this, but any `IgnoreQueryFilters()` or raw query would bring them back → test in Task 1.
2. **Activity paging when several rows share one `CreatedAt`** (e.g. leave writes two events in one save): no row skipped or repeated across pages → test in Task 3.
3. **Editing keeps the date the user picked.** Create sends local noon (`${date}T12:00:00`); `draftFromExpense` must map that back to the same local date in UTC−11…UTC+14 → test in Task 11.
4. **A photo the browser can't decode** (e.g. HEIC on desktop Chrome) must fail with a clear per-file message, not a silent blank upload → test in Task 11.
5. **A balance in a second currency**: €0 in EUR but $5 in USD must still block leave/remove → test in Task 7.

---

## Back end (`Wise Split/src`)

Run all commands from `Wise Split/src`. Docker must be running.

### Task 1: Data model and migration

**Files:**
- Modify: `WiseSplit.Database/Transactions/Transaction.cs`, `WiseSplit.Database/Groups/TransactionGroup.cs`, `WiseSplit.Database/Users/User.cs`, `WiseSplit.Database/DbContext.cs`
- Create: `WiseSplit.Database/Transactions/TransactionReceipt.cs`, `WiseSplit.Database/Groups/GroupArchive.cs`, `WiseSplit.Database/Activity/GroupActivity.cs`, `WiseSplit.Database/Activity/GroupActivityType.cs`, `WiseSplit.Database/Behaviour/ISoftDeletable.cs`
- Create: migration `AddGroupManagement` (generated)
- Test: `WiseSplit.Tests/DbContextTrackingTests.cs`, `WiseSplit.Tests/TransactionGroupServiceTests.cs`

**Interfaces:**
- Produces: `ISoftDeletable { DateTime? DeletedAt; Guid? DeletedBy; }`, implemented by `Transaction` and `TransactionGroup`. `Transaction.Note` (`string?`, `HasMaxLength(500)`), `Transaction.Receipts` (`IList<TransactionReceipt>`). `User.IsPlaceholder` (`bool`). `TransactionReceipt { Guid Id; Guid TransactionId; Guid FileId; string FileName; string ContentType; long Size; DateTime? CreatedAt; Guid? CreatedBy }` (implements `ITrackable` fields it has; add `UpdatedAt/UpdatedBy` to satisfy the interface). `GroupArchive { Guid UserId; Guid GroupId; DateTime ArchivedAt }`, key (`UserId`, `GroupId`). `GroupActivity { Guid Id; Guid GroupId; Guid ActorId; User? Actor; GroupActivityType Type; Guid? TransactionId; Guid? SubjectUserId; User? SubjectUser; string? Details /* jsonb */; DateTime CreatedAt }`. `GroupActivityType` with the 18 members in spec order, numbered from 0. New `DbSet`s: `TransactionReceipts`, `GroupArchives`, `GroupActivities`.
- Query filters: `HasQueryFilter(t => t.DeletedAt == null)` on `Transaction` and `TransactionGroup`. Indexes: `GroupActivity (GroupId, CreatedAt)`, `GroupActivity (TransactionId)`.

- [ ] **Step 1: Create branches** in both repos: `git switch -c feature/group-management`.
- [ ] **Step 2: Write failing tests**
  - `DbContextTrackingTests.RequireThat_SoftDeletedTransaction_IsHiddenFromQueries`: add a transaction, set `DeletedAt = DateTime.UtcNow`, save. A fresh context `Transactions.CountAsync()` == 0 and `IgnoreQueryFilters().CountAsync()` == 1.
  - `TransactionGroupServiceTests.RequireThat_GetOptimizedDebts_IgnoresDeletedExpenses`: owner pays 30 for member, then a second expense of 20, soft-deleted. Debts == one debt of 30.
  - `TransactionGroupServiceTests.RequireThat_GetStatistics_IgnoresDeletedExpenses`: same setup, `TotalSpent` == 30.
- [ ] **Step 3: Run:** `dotnet test --filter "FullyQualifiedName~SoftDeleted|FullyQualifiedName~IgnoresDeleted"`. Expected: build FAIL (`DeletedAt` missing).
- [ ] **Step 4: Implement the entities, configuration and filters** listed above. Then run `dotnet ef migrations add AddGroupManagement --project WiseSplit.Database --startup-project WiseSplit`. Check the migration only adds columns, tables and indexes (`IsPlaceholder` default `false`).
- [ ] **Step 5: Run** the same filter, then the full `dotnet test`. Expected: all PASS.
- [ ] **Step 6: Commit** `feat: add soft delete, receipts, archive and activity schema`.

### Task 2: Membership checks

**Files:**
- Create: `WiseSplit.Core/Services/Abstractions/IGroupAccess.cs`, `WiseSplit.Core/Services/GroupAccess.cs`
- Modify: `WiseSplit.Core/IoC/CoreModule.cs`, `WiseSplit.Core/Services/TransactionGroupService.cs`, `WiseSplit.Core/Services/TransactionService.cs`
- Test: `WiseSplit.Tests/GroupAccessTests.cs`, `WiseSplit.Tests/TransactionGroupServiceTests.cs`, `WiseSplit.Tests/TransactionServiceTests.cs`

**Interfaces:**
- Produces: `IGroupAccess`
  - `Task EnsureMemberAsync(Guid groupId, CancellationToken ct)`
  - `Task<Guid> EnsureMemberOfTransactionAsync(Guid transactionId, CancellationToken ct, bool includeDeleted = false)`, which returns the group id
  - `Guid CurrentUserId { get; }`, which throws `UnauthorizedAccessException` when `AuthorizedUserData.Id` is null

  All of them throw `NotFoundException` for a missing or deleted group or transaction, or a non-member. `includeDeleted` lets restore find soft-deleted transactions (the group must still not be deleted).
- `TransactionGroupService` and `TransactionService` get `IGroupAccess` as a new constructor parameter (tests pass `new GroupAccess(dbContext, userData)`).

- [ ] **Step 1: Write failing tests**
  - `GroupAccessTests`: member passes; outsider → `NotFoundException`; deleted group → `NotFoundException`; transaction in another group → `NotFoundException`; `includeDeleted: true` finds a soft-deleted transaction.
  - In the service tests, with `_userData.Id = _outsider.Id`, each of these throws `NotFoundException`: `FetchAsync`, `UpdateAsync`, `AddParticipant`, `RemoveParticipant`, `GetOptimizedDebts`, `GetStatistics`, `SettleAsync`, `TransactionService.AddAsync` (into the group), `UpdateAsync`, `FetchAsync`, `GetList`. Name them `RequireThat_<Method>_RejectsNonMember`.
- [ ] **Step 2: Run:** `dotnet test --filter "FullyQualifiedName~RejectsNonMember|FullyQualifiedName~GroupAccessTests"`. Expected: FAIL.
- [ ] **Step 3: Implement `GroupAccess`**, register it in `CoreModule`, and call it first thing in every method above. `GetList` stays scoped by user id. Update the existing test constructors.
- [ ] **Step 4: Run** the full `dotnet test`. Expected: PASS.
- [ ] **Step 5: Commit** `fix: only group members can read or change a group`.

### Task 3: Activity log, diff and read endpoints

**Files:**
- Create: `WiseSplit.Core/Services/Abstractions/IActivityLog.cs`, `WiseSplit.Core/Services/ActivityLog.cs`, `WiseSplit.Domain/Activity/TransactionSnapshot.cs`, `WiseSplit.Domain/Activity/TransactionDiff.cs`, `WiseSplit.Domain/Activity/ActivityDetails.cs`, `WiseSplit.DTO/Activity/ActivityView.cs`, `WiseSplit.DTO/Mappings/ActivityProfile.cs`
- Modify: `TransactionGroupService.cs` (log `GroupCreated`, `GroupEdited`, `MemberAdded`, `RepaymentAdded`), `TransactionService.cs` (log `ExpenseAdded`), `TransactionGroupsController.cs`, `TransactionsController.cs`, `CoreModule.cs`
- Test: `WiseSplit.Tests/TransactionDiffTests.cs`, `WiseSplit.Tests/ActivityLogTests.cs`

**Interfaces:**
- Produces:
  - `ActivityDetails { string? Name; IList<FieldChange> Changes; string? Amount; string? Currency }`, with `FieldChange { string Field; string? From; string? To }`. Serialized camelCase with `System.Text.Json`, nulls and empty `Changes` omitted.
  - `TransactionSnapshot.From(Transaction t)`, which captures `name`, `date` (`yyyy-MM-dd`), `currency`, `amount` (total, `0.00` invariant), `note`, `payers` (e.g. `"Alice 20.00, Bob 5.00"`, sorted by name), `split` (method name + `"Alice 10.00, Bob 15.00"` from translated amounts). It needs `Payer`/`User` loaded.
  - `TransactionDiff.Compare(TransactionSnapshot before, TransactionSnapshot after) -> IList<FieldChange>`, in field order name, date, currency, amount, note, payers, split.
  - `IActivityLog.Add(Guid groupId, GroupActivityType type, Guid? transactionId = null, Guid? subjectUserId = null, ActivityDetails? details = null)` adds to the context without saving. Actor = current user, `CreatedAt = DateTime.UtcNow`.
  - `Task<IList<GroupActivity>> GetGroupFeedAsync(Guid groupId, Guid? before, int limit, CancellationToken ct)` (limit clamped to 1..100) and `Task<IList<GroupActivity>> GetTransactionHistoryAsync(Guid transactionId, CancellationToken ct)` (oldest first). Both include `Actor` and `SubjectUser`.
  - `ActivityView { Guid Id; UserView Actor; GroupActivityType Type; Guid? TransactionId; UserView? SubjectUser; ActivityDetails? Details; DateTime CreatedAt; bool CanRestore }`. `CanRestore` = the type is `ExpenseDeleted`/`RepaymentDeleted` and that transaction is still soft-deleted (computed in the service, passed via mapping context or set after mapping).
  - Endpoints: `GET transaction-groups/{groupId}/activity?before=&limit=30` → `IEnumerable<ActivityView>`; `GET transactions/{id}/history` → `IEnumerable<ActivityView>`. Both call `IGroupAccess` first.

- [ ] **Step 1: Write failing tests**
  - `TransactionDiffTests`: identical snapshots → empty; amount 20 → 25 gives exactly `[{amount, "20.00", "25.00"}]`; note `null` → `"Taxi"` gives `{note, null, "Taxi"}`; several changes come out in field order.
  - `ActivityLogTests`: `AddAsync` (group) writes `GroupCreated`; renaming writes `GroupEdited` with `{name, "Trip", "Lisbon"}`; adding an expense writes `ExpenseAdded` with `Name`; a settlement writes `RepaymentAdded` with `Amount`/`Currency`.
  - `ActivityLogTests.RequireThat_GroupFeed_PagesWithoutGaps_WhenTimestampsTie`: 5 rows with the same `CreatedAt`. Pages of 2 using `before = last.Id` return all 5 ids once each.
- [ ] **Step 2: Run:** `dotnet test --filter "FullyQualifiedName~TransactionDiffTests|FullyQualifiedName~ActivityLogTests"`. Expected: FAIL.
- [ ] **Step 3: Implement** the types, the service and the logging calls listed, then the two controller actions with XML doc comments.
- [ ] **Step 4: Run** the full `dotnet test`. Expected: PASS.
- [ ] **Step 5: Commit** `feat: record group activity and expose feed and history`.

### Task 4: Edit, delete and restore expenses and repayments, plus notes

**Files:**
- Modify: `WiseSplit.DTO/Transactions/BaseTransaction.cs` (add `string? Note`), `TransactionView.cs` (`Note`, `IsLocked`, `Receipts`), `TransactionListView.cs` (`HasNote`, `ReceiptCount`), `WiseSplit.DTO/Validations/Transactions/CreateTransactionValidator.cs` and `UpdateTransactionValidator.cs` (note ≤ 500), `WiseSplit.DTO/Mappings/TransactionsProfile.cs`, `ITransactionService.cs`, `TransactionService.cs`, `TransactionsController.cs`
- Test: `WiseSplit.Tests/TransactionServiceTests.cs`, `WiseSplit.Tests/TransactionUtilsTests.cs` (validator)

**Interfaces:**
- Consumes: `IGroupAccess`, `IActivityLog`, `TransactionSnapshot`, `TransactionDiff`, `ITransactionGroupsService.GetOptimizedDebts`.
- Produces: `ITransactionService.DeleteAsync(Guid id, CancellationToken ct)` and `RestoreAsync(Guid id, CancellationToken ct) -> Task<Transaction>`. Endpoints `DELETE transactions/{id}` (204) and `POST transactions/{id}/restore` (200 `TransactionView`). `TransactionView.IsLocked` is computed by a new `IsLockedResolver` (any payer or assignee not in `Group.Participants`), so `FetchAsync` must include `Group.Participants`. `ReceiptView { Guid Id; string FileName; string ContentType; long Size }`.
- Rules:
  - Locked → `NotAllowedException("This expense includes someone who left the group, so it can't be changed.")`.
  - Repayment update: only `PaymentDateUtc` and the amount (`PayerDetails[0].Amount` = `PartialsAssignments[0].PartialAmount`) change; debtor, lender and currency must match the existing ones, else `ArgumentException`. The new amount must be ≤ current debt between them + the repayment's current amount, else `ArgumentException("Repayment can't exceed the debt.")`.
  - Logged events: `ExpenseEdited`/`RepaymentEdited` (only when the diff is non-empty), `…Deleted`, `…Restored`, each with `Name`.
  - Restore: the transaction must be soft-deleted and all involved users must be members, else 403 with the locked message.

- [ ] **Step 1: Write failing tests** in `TransactionServiceTests`:
  - `RequireThat_UpdateAsync_ChangesAmountAndLogsDiff`: the activity has `Changes` containing `amount`.
  - `RequireThat_UpdateAsync_SavesNote` and `RequireThat_AddAsync_AllowsNoNote` (`Note == null`).
  - `RequireThat_UpdateAsync_RejectsLockedExpense`: the member left via a direct `Participants.Remove`; expect `NotAllowedException`.
  - `RequireThat_DeleteAsync_SoftDeletesAndLogs`, `RequireThat_RestoreAsync_BringsBackAndLogs`, `RequireThat_RestoreAsync_RejectsWhenMemberLeft`.
  - `RequireThat_UpdateAsync_RejectsRepaymentAboveDebt`: debt 30, repayment 10; updating to 40 succeeds (≤ 30 + 10), updating to 41 → `ArgumentException`.
  - Validator test: a note of 501 characters is invalid, 500 is valid.
- [ ] **Step 2: Run:** `dotnet test --filter "FullyQualifiedName~TransactionServiceTests"`. Expected: FAIL.
- [ ] **Step 3: Implement** it. `UpdateAsync` takes the snapshot before mapping, then compares with the reloaded entity after saving.
- [ ] **Step 4: Run** the full `dotnet test`. Expected: PASS.
- [ ] **Step 5: Commit** `feat: edit, delete and restore expenses and repayments`.

### Task 5: Receipts

**Files:**
- Create: `WiseSplit.Core/Services/Abstractions/IReceiptService.cs`, `WiseSplit.Core/Services/ReceiptService.cs`
- Modify: `IStorageService.cs` / `StorageService.cs` (add `Task DeleteAsync(Guid id, CancellationToken ct)` and `Task<UploadedFile> UploadAsync(string name, byte[] data, CancellationToken ct)`), `TransactionsController.cs`, `CoreModule.cs`
- Test: `WiseSplit.Tests/ReceiptServiceTests.cs` (Postgres fixture + a fake `IStorageService`)

**Interfaces:**
- Consumes: `IGroupAccess.EnsureMemberOfTransactionAsync`, `IActivityLog`.
- Produces: `IReceiptService`
  - `AddAsync(Guid transactionId, IFormFile file, CancellationToken ct) -> Task<TransactionReceipt>`
  - `GetAsync(Guid transactionId, Guid receiptId, CancellationToken ct) -> Task<(TransactionReceipt Receipt, byte[] Data)>`
  - `DeleteAsync(Guid transactionId, Guid receiptId, CancellationToken ct)`

  Endpoints: `POST transactions/{id}/receipts` (`[RequestSizeLimit(5 * 1024 * 1024 + 64 * 1024)]`, form field `file`) → `ReceiptView`; `GET transactions/{id}/receipts/{receiptId}` → `File(data, contentType, fileName)`; `DELETE …` → 204.
- Rules: allowed content types `image/jpeg`, `image/png`, `image/webp`, `application/pdf`, with a matching extension (`.jpg/.jpeg/.png/.webp/.pdf`), else `ArgumentException("Only JPEG, PNG, WebP or PDF files can be attached.")`. Size > 5 MB → `ArgumentException("Each receipt can be at most 5 MB.")`. Six or more → `ArgumentException("An expense can have at most 5 receipts.")`. Logs `ReceiptAdded`/`ReceiptRemoved` with `Name` = file name.

- [ ] **Step 1: Write failing tests:** add a valid PNG works and logs the event; a `.exe`/`application/octet-stream` file is rejected; 5 MB + 1 byte is rejected; the 6th is rejected; delete removes the row and calls storage delete; an outsider gets `NotFoundException` on all three.
- [ ] **Step 2: Run:** `dotnet test --filter "FullyQualifiedName~ReceiptServiceTests"`. Expected: FAIL.
- [ ] **Step 3: Implement** it.
- [ ] **Step 4: Run** the full `dotnet test`. Expected: PASS.
- [ ] **Step 5: Commit** `feat: optional receipts on expenses`.

### Task 6: Placeholder members

**Files:**
- Create: `WiseSplit.DTO/Groups/CreatePlaceholder.cs` (`string Name`), `WiseSplit.DTO/Groups/ReplacePlaceholder.cs` (`Guid UserId`), `WiseSplit.DTO/Validations/Groups/CreatePlaceholderValidator.cs`
- Modify: `UserView.cs` (`IsPlaceholder`), `TransactionGroupService.cs`, `ITransactionGroupsService.cs`, `TransactionGroupsController.cs`, `UsersService.cs` (exclude placeholders from `TryFetchAutoCompleteAsync`, `GetKnownUsersAsync`, `TryFetchExactAsync`), `AuthorizationService.cs` (reject placeholders like a wrong password)
- Test: `WiseSplit.Tests/PlaceholderTests.cs`, `WiseSplit.Tests/UsersServiceTests.cs`

**Interfaces:**
- Produces:
  - `AddPlaceholderAsync(Guid groupId, CreatePlaceholder model, CancellationToken ct) -> Task<User>`: username `placeholder-{Guid:N}`, empty email, `IsPlaceholder = true`, `Name` trimmed.
  - `ReplacePlaceholderAsync(Guid groupId, Guid placeholderId, ReplacePlaceholder model, CancellationToken ct)`: one DB transaction (`Database.BeginTransactionAsync`). It re-points `PayerDetails.PayerId` and `PartialsAssignments.UserId` for transactions of that group (including soft-deleted ones), adds the user, removes the placeholder from the group and deletes the placeholder user.
  - Endpoints `POST transaction-groups/{groupId}/placeholders` → 201 `UserView`; `POST transaction-groups/{groupId}/placeholders/{placeholderId}/replace` → 204.
- Rules: the placeholder must be in the group and `IsPlaceholder`, else `NotFoundException`. The target must exist, not be a placeholder and not already be a member, else `ArgumentException("That person is already in the group.")` / `NotFoundException`. `AddParticipant` rejects placeholders. `SettleAsync`: the requester must be the debtor or the lender, **or** either of them is a placeholder. Logs `PlaceholderAdded` (subject = placeholder, `Name`) and `PlaceholderReplaced` (subject = new user, `Name` = placeholder name).

- [ ] **Step 1: Write failing tests:**
  - Add a placeholder: it's a member, `IsPlaceholder` is true, the event is logged.
  - The name validator rejects `""` and 65 characters.
  - Replace: afterwards the debts are identical except the id swap (compare `GetOptimizedDebts` before and after), and the placeholder user no longer exists.
  - Replace rejects an existing member.
  - Search, known users and sign-in ignore placeholders.
  - The owner can record a repayment between two other people when one is a placeholder.
- [ ] **Step 2: Run:** `dotnet test --filter "FullyQualifiedName~PlaceholderTests|FullyQualifiedName~UsersServiceTests"`. Expected: FAIL.
- [ ] **Step 3: Implement** it.
- [ ] **Step 4: Run** the full `dotnet test`. Expected: PASS.
- [ ] **Step 5: Commit** `feat: placeholder members`.

### Task 7: Leave, remove, archive and delete group

**Files:**
- Create: `WiseSplit.DTO/Groups/LeaveGroup.cs` (`Guid? NewOwnerId`)
- Modify: `GroupListView.cs` (`IsArchived`), `ITransactionGroupsService.cs`, `TransactionGroupService.cs`, `TransactionGroupsController.cs`, `TransactionGroupsProfile.cs`
- Test: `WiseSplit.Tests/GroupLifecycleTests.cs`, existing `RemoveParticipant` tests

**Interfaces:**
- Produces:
  - `GetList(Guid userId, bool archived, CancellationToken ct)`. Controller: `GET transaction-groups?archived=false`.
  - `LeaveAsync(Guid groupId, LeaveGroup model, CancellationToken ct)` → `POST …/{groupId}/leave`.
  - `DeleteAsync(Guid groupId, CancellationToken ct)` → `DELETE …/{groupId}`.
  - `SetArchivedAsync(Guid groupId, bool archived, CancellationToken ct)` → `POST`/`DELETE …/{groupId}/archive`.
  - A private `EnsureSettled(Guid groupId, Guid userId)` that throws `NotAllowedException("Settle up first: {name} still has an open balance.")`.
- Rules:
  - Leave: the user must be settled. If the user is the owner, `NewOwnerId` must be a registered member other than the user (else `ArgumentException("Choose a new owner.")`). If no other registered member exists → `NotAllowedException("You're the last member. Delete the group instead.")`. Leave also removes the user's `GroupArchive` row. Logs `OwnershipTransferred` (subject = new owner) then `MemberLeft`.
  - `RemoveParticipant`: the owner can remove registered members; anyone can remove placeholders; nobody can remove themselves here (`NotAllowedException("Use Leave group instead.")`); the person must be settled. A removed placeholder user is deleted too. Logs `MemberRemoved`.
  - Delete: owner only (`NotAllowedException("Only the owner can delete the group.")`) and no debts at all (`NotAllowedException("Everyone has to be settled up before the group can be deleted.")`). Soft delete.

- [ ] **Step 1: Write failing tests** in `GroupLifecycleTests`:
  - A member leaves when settled.
  - Leaving is blocked with a balance.
  - `RequireThat_Leave_IsBlocked_WhenOnlyAnotherCurrencyHasBalance`: settled in EUR, $5 open in USD.
  - The owner leaving without `NewOwnerId` → `ArgumentException`. With it: ownership moves and two events are logged in order.
  - The last registered member is told to delete.
  - The owner removes a member; a member removing another registered member → `NotAllowedException`; a member removing a placeholder works.
  - Archive hides the group from `GetList(archived: false)` and shows it with `archived: true` for that user only.
  - Delete: a non-owner is rejected, open debts are rejected, a settled group is deleted and gone from `GetList` and from `FetchAsync` (404).
- [ ] **Step 2: Run:** `dotnet test --filter "FullyQualifiedName~GroupLifecycleTests|FullyQualifiedName~TransactionGroupServiceTests"`. Expected: FAIL.
- [ ] **Step 3: Implement** it. Update the existing "owner cannot leave" test to the new message.
- [ ] **Step 4: Run** the full `dotnet test`. Expected: PASS. Then `dotnet run --project WiseSplit` and check that Swagger lists every new endpoint.
- [ ] **Step 5: Commit** `feat: leave, remove, archive and delete groups`.

---

## Front end (`magellan`)

Run from `magellan`. API running locally with `.env` `REACT_APP_BASE_URL=http://localhost:5236/`.

### Task 8: Types and API layer

**Files:**
- Modify: `src/store/api.ts` (add `ApiTag.Activity`), `src/features/expenses/types.ts`, `src/features/expenses/api.ts`, `src/features/groups/types.ts`, `src/features/groups/api.ts`, `src/features/users/types.ts` (`isPlaceholder: boolean`), `src/lib/routes.ts`
- Create: `src/features/activity/types.ts`, `src/features/activity/api.ts`, `src/features/expenses/receipts.ts`

**Interfaces:**
- Produces:
  - Types: `Transaction` gets `note?: string | null`, `isLocked: boolean`, `receipts: Receipt[]`; `Receipt { id; fileName; contentType; size }`; `CreateTransaction` gets `note?: string | null`; `UpdateTransaction = CreateTransaction & { id: string }`; `GroupListItem.isArchived`; `GroupTransaction.hasNote`, `receiptCount`.
  - `ActivityType` enum mirroring `GroupActivityType`; `ActivityItem { id; actor: User; type; transactionId?; subjectUser?: User | null; details?: { name?; changes?: { field; from?; to? }[]; amount?; currency? } | null; createdAt; canRestore }`.
  - Hooks:
    - `useUpdateTransactionMutation`, `useDeleteTransactionMutation`, `useRestoreTransactionMutation` (arg `{ id, groupId }`)
    - `useGetTransactionHistoryQuery(id)`, `useUploadReceiptMutation({ transactionId, file: Blob, fileName })` (`FormData`), `useDeleteReceiptMutation({ transactionId, receiptId, groupId })`
    - `useGetGroupsQuery({ archived: boolean })`
    - `useAddPlaceholderMutation({ groupId, name })`, `useReplacePlaceholderMutation({ groupId, placeholderId, userId })`
    - `useLeaveGroupMutation({ groupId, newOwnerId? })`, `useDeleteGroupMutation(groupId)`, `useSetArchivedMutation({ groupId, archived })`
    - `useGetGroupActivityQuery({ groupId, before? })` (an RTK Query infinite query, or merge pages by cursor)

    Every mutation invalidates `Groups`, `Group`, `Debts`, `Activity` by group id and `Transaction` by id where relevant.
  - `receipts.ts`: `useReceiptUrl(transactionId, receiptId): string | undefined` (authorized `fetch` → blob URL, revoked on unmount).
  - Routes: `routes.editExpense(groupId, expenseId)` = `/groups/${groupId}/expenses/${expenseId}/edit`, `routes.groupActivity(groupId)` = `/groups/${groupId}/activity`, `routes.archivedGroups` = `/groups?archived=1`, with matching `routePatterns`.

- [ ] **Step 1: Implement** the types, endpoints and routes. Update every `useGetGroupsQuery()` caller to pass `{ archived: false }`.
- [ ] **Step 2: Run** `npm run build` and `npm run lint`. Expected: no errors.
- [ ] **Step 3: Commit** `feat: API layer for group management`.

### Task 9: Activity screen

**Files:**
- Create: `src/features/activity/describeActivity.ts`, `src/features/activity/describeActivity.test.ts`, `src/features/activity/GroupActivityPage.tsx`, `src/features/activity/ActivityRow.tsx`, `public/locales/en/activity.json`
- Modify: `src/i18n.ts` (namespace `activity`), `src/app/router.tsx`, `src/features/groups/GroupDetailsPage.tsx` (an `IconLink` with the `History` icon, label "Activity")

**Interfaces:**
- Produces: `describeActivity(item: ActivityItem, currentUserId: string, t: TFunction<'activity'>, formatters: { money: (a: number, c: string) => string; date: (iso: string) => string }): { text: string; changes: string[] }`. The actor is "You" when it's the current user. Changes are rendered as `"{{field}}: {{from}} → {{to}}"` with amount values formatted as money in the expense's currency, `date` values through `formatShortDate`, and a missing `from`/`to` shown as "—".

- [ ] **Step 1: Write failing tests:** one assertion per `ActivityType`, using the English locale JSON loaded into a real i18next instance. "You" for the current user. An amount change renders `"Amount: €20.00 → €25.00"`. A note added renders `"Note: — → Taxi"`.
- [ ] **Step 2: Run:** `npx vitest run src/features/activity`. Expected: FAIL.
- [ ] **Step 3: Implement** it. The page groups rows by `dayKey(createdAt)`, shows "Load more" while the last page returned 30, and shows Restore when `canRestore` is true (calls the restore mutation). `HistorySection` (Task 10) reuses `describeActivity` and `ActivityRow`.
- [ ] **Step 4: Run** the tests, lint and build. Then check in the browser: the feed shows add/edit/delete/restore/repayment/member events; Load more works with the seed data; Restore brings a deleted expense back.
- [ ] **Step 5: Commit** `feat: group activity feed`.

### Task 10: Expense details: edit, delete, note, receipts, history

**Files:**
- Modify: `src/features/expenses/ExpenseDetailsPage.tsx`, `public/locales/en/expenses.json`
- Create: `src/features/expenses/details/ReceiptsSection.tsx`, `src/features/expenses/details/HistorySection.tsx`, `src/features/expenses/details/EditRepaymentDialog.tsx`

**Interfaces:**
- Consumes: Task 8 hooks; `describeActivity` and `ActivityRow` from Task 9.
- Behaviour from the spec, "Expense details". Copy:
  - `deleteExpenseTitle`: "Delete expense?"
  - `deleteExpenseMessage`: "It disappears from balances for everyone in the group. You can restore it from Activity."
  - `expenseDeleted`: "Expense deleted"
  - `undo`: "Undo"
  - `lockedHint`: "Someone in this expense left the group, so it can't be changed."
  - `note`: "Note"
  - `receipts`: "Receipts"
  - `history`: "History"

- [ ] **Step 1: Implement** it. Delete → `navigate(routes.group(groupId))` + `toast(t => <>{msg} <button>Undo</button></>)`, which calls restore.
- [ ] **Step 2: Verify in the browser** (seeded data): delete + undo restores the row and balance; a locked expense has disabled buttons with the hint; note/receipts/history appear only when present; editing a repayment above the cap shows the API error toast.
- [ ] **Step 3: Commit** `feat: expense details actions, note, receipts and history`.

### Task 11: Edit expense flow, note and receipts in the form

**Files:**
- Modify: `src/features/expenses/new/draft.ts`, `src/features/expenses/new/NewExpensePage.tsx`, `src/features/expenses/new/steps.tsx`, `src/app/router.tsx`, `public/locales/en/expenses.json`
- Create: `src/features/expenses/new/ReceiptPicker.tsx`, `src/features/expenses/new/resizeImage.ts`
- Test: `src/features/expenses/new/draft.test.ts`, `src/features/expenses/new/resizeImage.test.ts`

**Interfaces:**
- Produces:
  - `ExpenseDraft` gets `note: string` and `receipts: PendingReceipt[]`, where `PendingReceipt = { key: string; file: File }`. A new `DraftAction` `{ type: 'addReceipts'; files: File[] } | { type: 'removeReceipt'; key: string }`. `update` also patches `note`. Existing receipts are handled on the details screen and in edit mode as a separate list with delete.
  - `draftFromExpense(expense: Transaction, groupId: string, memberIds: string[]): ExpenseDraft`, starting at `step: 0`, with:
    - `date = toDateInputValue(new Date(expense.paymentDateUtc))`
    - a single payer → `payerMode: 'single'`, `payerId`, `amount`; otherwise `'multiple'` + `payerAmounts`
    - split mode from the `splitMethod` of the first assignment; `values` as strings; for equal, `included[userId] = true` for each assignee and `false` for each id in `memberIds` that is not an assignee
  - `fitWithin(width: number, height: number, max = 2000): { width: number; height: number }` and `resizeImage(file: File): Promise<Blob>`. PDFs are returned as is. Images go through `createImageBitmap` → canvas → `toBlob('image/jpeg', 0.85)`. If decoding fails, it throws `ReceiptError('unreadable')`. Over 5 MB after resizing → `ReceiptError('tooLarge')`.
  - The `NewExpensePage` mode comes from the route: an `expenseId` param means edit (load with `useGetTransactionQuery`, init the reducer once loaded, save with update). After save, upload pending receipts one by one; a failure toasts `receiptUploadFailed` ("{{name}} couldn't be uploaded") and continues.

- [ ] **Step 1: Write failing tests**
  - `draft.test.ts`: round trip for each split mode (equal with an excluded member, amount, percent, shares). Build the draft, run the existing `split.ts` conversion and expect the original `payerDetails`/`partialsAssignments`. Multiple payers. `RequireThat_date_survives_timezones` with `process.env.TZ` set (in `beforeEach`, restored after) to `Pacific/Kiritimati` and `Pacific/Pago_Pago`: `paymentDateUtc` built as `new Date('2026-10-12T12:00:00').toISOString()` maps back to `'2026-10-12'`.
  - `resizeImage.test.ts`: `fitWithin(4000, 3000)` → `{2000, 1500}`; `fitWithin(800, 600)` unchanged; `fitWithin(1000, 3000)` → `{667, 2000}`; `resizeImage` returns a PDF file unchanged; a file whose decode rejects (`createImageBitmap` mocked to reject) → `ReceiptError` with `reason 'unreadable'`.
- [ ] **Step 2: Run:** `npx vitest run src/features/expenses/new`. Expected: FAIL.
- [ ] **Step 3: Implement** it. Step 1 gets an optional Note textarea (`maxLength` 500, counter) and a `ReceiptPicker` (`accept="image/jpeg,image/png,image/webp,application/pdf"`, multiple, disabled at 5 including existing ones). Copy:
  - `noteOptional`: "Note (optional)"
  - `addReceipt`: "Add receipt"
  - `receiptsOptional`: "Receipts (optional)"
  - `receiptUnreadable`: "{{name}} can't be read. Try a JPEG or PNG."
  - `receiptTooLarge`: "{{name}} is larger than 5 MB."
  - `editExpense`: "Edit expense"
  - `expenseSaved`: "Expense saved"
- [ ] **Step 4: Run** `npx vitest run`, `npm run lint` and `npm run build`. Expected: PASS. Then check in the browser: edit each split mode and save unchanged → no history entry; change the amount → a history entry; add 2 receipts at creation; save with no note or receipts.
- [ ] **Step 5: Commit** `feat: edit expenses with optional note and receipts`.

### Task 12: Group settings: members, placeholders, leave, archive, delete

**Files:**
- Modify: `src/features/groups/GroupSettingsPage.tsx`, `src/features/groups/AddMemberDialog.tsx`, `public/locales/en/groups.json`, every place that renders a member name (`ListRow` callers in groups/expenses) to show the placeholder label
- Create: `src/features/groups/settings/MemberMenu.tsx`, `src/features/groups/settings/GroupActionsSection.tsx`, `src/features/groups/settings/LeaveGroupDialog.tsx`, `src/features/groups/memberBalance.ts`, `src/features/groups/memberBalance.test.ts`, `src/components/PlaceholderLabel.tsx` (exported from `components/index.ts`)

**Interfaces:**
- Produces: `openBalances(debts: Debt[], userId: string): { currencyCode: string; amount: number }[]`, giving the absolute amount per currency for debts involving the user. The UI uses it to disable actions and build hints, e.g. "Settle up first: owes €12.40" / "is owed $5.00".
- Behaviour from the spec, "Group settings". The owner's Leave opens `LeaveGroupDialog` with a `SelectField` of registered members other than self. With none, the Leave button becomes "Delete group". Copy:
  - `notSignedUp`: "not signed up"
  - `addPlaceholder`: "Add someone who isn't signed up"
  - `placeholderName`: "Name"
  - `replaceWithUser`: "Replace with a real person"
  - `leaveGroup`: "Leave group"
  - `chooseNewOwner`: "Choose who owns the group after you leave"
  - `archiveGroup`: "Archive"
  - `unarchiveGroup`: "Unarchive"
  - `deleteGroup`: "Delete group"
  - `deleteGroupMessage`: "The group disappears for everyone. This can't be undone from the app."
  - `settleFirst`: "Settle up first: {{balances}}"

- [ ] **Step 1: Write failing tests** in `memberBalance.test.ts`: no debts → `[]`; debts in EUR and USD both listed; debts not involving the user are ignored.
- [ ] **Step 2: Run:** `npx vitest run src/features/groups`. Expected: FAIL.
- [ ] **Step 3: Implement** it. After a successful leave/delete → `navigate(routes.groups)` + toast. "Replace with a real person" reuses `AddMemberDialog` in a `mode="replace"` that calls the replace mutation.
- [ ] **Step 4: Run** the tests, lint and build. Then check in the browser as owner and as member: every enabled and disabled state and hint, placeholder add/replace/remove, leave with hand-over, archive/unarchive, delete of a settled group.
- [ ] **Step 5: Commit** `feat: manage members, placeholders and group lifecycle`.

### Task 13: Archived groups list, seed data and final verification

**Files:**
- Modify: `src/features/groups/GroupsPage.tsx`, `public/locales/en/groups.json`, `scripts/seed-dev-data.mjs`

**Interfaces:**
- Consumes: `useGetGroupsQuery({ archived })`, `routes.archivedGroups`, `useSetArchivedMutation`.
- `GroupsPage` reads `?archived=1`. In normal mode it shows an "Archived ({{count}})" link at the bottom when the count > 0 (from a second `useGetGroupsQuery({ archived: true })`). In archived mode it shows title "Archived groups", a back link to `routes.groups`, and Unarchive on each row.
- Seed: add one placeholder ("Eve") with one expense, one note, one deleted expense, and one archived group for `alicedemo`.

- [ ] **Step 1: Implement** the list and the seed changes.
- [ ] **Step 2: Run the full verification**
  - Back end: `dotnet test` (from `Wise Split/src`). Expected: all PASS.
  - Front end: `npx vitest run`, `npm run lint`, `npm run build`. Expected: all PASS.
  - Reseed a fresh DB (`docker compose down -v && docker compose up -d`, run the API, `node scripts/seed-dev-data.mjs`), then walk through every flow in the browser at 375 px and 1280 px, and take screenshots of the expense details, edit, activity and group settings screens.
- [ ] **Step 3: Commit** `feat: archived groups list and demo data`.
