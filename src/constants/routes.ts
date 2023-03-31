export const ROUTES = {
  ROOT: '/',
  AUTH: {
    ROOT: '/auth',
    REGISTER: 'sign-up',
    FORGOT_PASSWORD: 'forgot-password',
  },
  GROUPS: {
    ROOT: '/groups',
    LIST: 'list',
    EDIT: 'edit',
    CREATE: 'create',
    MEMBERS: 'members',
    GROUP: 'group',
  },
  ACCOUNT_SETTINGS: '/account-settings',
};

export const ResolveGroupRoute = (route: string) => {
  return `${ROUTES.GROUPS.ROOT}/${route}`;
};
