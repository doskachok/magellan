export const ROUTES = {
  ROOT: '/',
  AUTH: {
    ROOT: '/auth',
    REGISTER: 'sign-up',
    FORGOT_PASSWORD: 'forgot-password',
  },
  GROUPS: {
    ROOT: '/groups',
    EDIT: 'edit',
    CREATE: 'create',
    GROUP: 'group',
  },
  ACCOUNT_SETTINGS: '/account-settings',
  EXPENSES: {
    ROOT: '/expenses',
    ADD_MAININFO: 'add-main-info',
  },
};

export const ResolveGroupRoute = (route: string) => {
  return `${ROUTES.GROUPS.ROOT}/${route}`;
};

export const ResolveExpenseRoute = (route: string) => {
  return `${ROUTES.EXPENSES.ROOT}/${route}`;
};
