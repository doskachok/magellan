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
  EXPENSES: {
    ROOT: '/expenses',
    ADD_MAININFO: 'add-main-info',
  },
};

export const ResolveExpenseRoute = (route: string) => {
  return `${ROUTES.EXPENSES.ROOT}/${route}`;
};

export enum GroupRouteMode { EDIT = 'edit', NONE = '' };

export const composeGroupRoute = (groupId: string, mode = GroupRouteMode.NONE) => {
  return `${ROUTES.GROUPS.ROOT}/${groupId}/${mode}`;
};
