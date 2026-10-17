export const routes = {
  signIn: '/auth',
  signUp: '/auth/sign-up',
  groups: '/groups',
  newGroup: '/groups/new',
  group: (groupId: string) => `/groups/${groupId}`,
  groupSettings: (groupId: string) => `/groups/${groupId}/settings`,
  settleDebt: (groupId: string, debt: { debtorId: string; lenderId: string; currencyCode: string }) =>
    `/groups/${groupId}/settle?${new URLSearchParams({ debtor: debt.debtorId, lender: debt.lenderId, currency: debt.currencyCode })}`,
  expense: (groupId: string, expenseId: string) => `/groups/${groupId}/expenses/${expenseId}`,
  newExpense: (groupId?: string) => (groupId ? `/expenses/new?groupId=${groupId}` : '/expenses/new'),
  account: '/account',
} as const;

/** Path patterns for the router; keep in sync with the builders above. */
export const routePatterns = {
  group: '/groups/:groupId',
  groupSettings: '/groups/:groupId/settings',
  settleDebt: '/groups/:groupId/settle',
  expense: '/groups/:groupId/expenses/:expenseId',
  newExpense: '/expenses/new',
} as const;
