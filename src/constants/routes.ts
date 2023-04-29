export const ROUTES = {
  ROOT: '/',
  AUTH: {
    ROOT: '/auth',
    REGISTER: 'sign-up',
    FORGOT_PASSWORD: 'forgot-password',
  },
  GROUPS: {
    ROOT: '/groups',
    CREATE: 'create',
  },
  ACCOUNT_SETTINGS: '/account-settings',
};

export const CreateRouteString = 'create';
export const NoneRouteString = 'none';

export enum GroupRouteMode { EDIT = 'edit', EXPENSES = 'expenses', NONE = '' };

export const composeGroupRoute = (groupId: string, mode = GroupRouteMode.NONE) => {
  return `${ROUTES.GROUPS.ROOT}/${groupId}/${mode}`;
};

export enum ExpenseRouteMode {
  ADD_MAININFO = 'add-main-info',
  ADD_PAYERS = 'add-payers',
  ADD_PARTICIPANTS = 'add-participants',
  NONE = ''
};

export const composeExpenseRoute = (groupId: string, expenseIdOrCreate: string, mode: ExpenseRouteMode) => {
  return `${composeGroupRoute(groupId, GroupRouteMode.EXPENSES)}/${expenseIdOrCreate}/${mode}`;
};
