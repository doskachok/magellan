import type { ReactNode } from 'react';
import { NavLink, useMatch, useNavigate } from 'react-router';
import { ArrowLeft, Plus, UserRound, UsersRound } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { routes } from 'lib/routes';
import { IconButton } from './IconButton';
import { Content, Footer } from './Layout.styles';

const Root = styled.div<{ $withNav: boolean }>`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding-bottom: ${({ theme, $withNav }) =>
    $withNav ? `calc(${theme.layout.bottomNavHeight} + env(safe-area-inset-bottom))` : 'env(safe-area-inset-bottom)'};
`;

const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  padding-top: env(safe-area-inset-top);
  background: ${({ theme }) => theme.colors.brand};
  color: ${({ theme }) => theme.colors.onBrand};
`;

const BarInner = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(1)};
  max-width: ${({ theme }) => theme.layout.maxWidth};
  height: ${({ theme }) => theme.layout.topBarHeight};
  margin: 0 auto;
  padding: ${({ theme }) => theme.space(0, 2)};
`;

const BarTitle = styled.h1<{ $indent: boolean }>`
  flex: 1;
  min-width: 0;
  padding-left: ${({ theme, $indent }) => ($indent ? theme.space(2) : 0)};
  overflow: hidden;
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
`;

interface TopBarProps {
  title: string;
  /** Route to go back to; `true` uses browser history. Omit for top-level screens. */
  back?: string | true;
  actions?: ReactNode;
}

export const TopBar = ({ title, back, actions }: TopBarProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleBack = () => {
    if (back === true) navigate(-1);
    else if (back) navigate(back);
  };

  return (
    <Bar>
      <BarInner>
        {back && <IconButton tone="onBrand" label={t('back')} icon={<ArrowLeft size={22} />} onClick={handleBack} />}
        <BarTitle $indent={!back}>{title}</BarTitle>
        {actions && <Actions>{actions}</Actions>}
      </BarInner>
    </Bar>
  );
};

interface ScreenProps {
  topBar: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  withNav?: boolean;
}

export const Screen = ({ topBar, children, footer, withNav = false }: ScreenProps) => (
  <Root $withNav={withNav}>
    {topBar}
    <Content>{children}</Content>
    {footer && <Footer>{footer}</Footer>}
    {withNav && <BottomNav />}
  </Root>
);

const Nav = styled.nav`
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 20;
  padding-bottom: env(safe-area-inset-bottom);
  background: ${({ theme }) => theme.colors.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const NavList = styled.ul`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  max-width: ${({ theme }) => theme.layout.maxWidth};
  height: ${({ theme }) => theme.layout.bottomNavHeight};
  margin: 0 auto;
  padding: 0;
  list-style: none;
`;

const NavItem = styled(NavLink)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  height: 100%;

  & > svg,
  & > span:first-child {
    height: 28px;
  }
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.font.size.xs};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  text-decoration: none;

  &.active {
    color: ${({ theme }) => theme.colors.brand};
  }
`;

const AddItem = styled(NavItem)`
  color: ${({ theme }) => theme.colors.brand};

  span:first-child {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 28px;
    border-radius: ${({ theme }) => theme.radius.pill};
    background: ${({ theme }) => theme.colors.brand};
    color: ${({ theme }) => theme.colors.onBrand};
  }
`;

const BottomNav = () => {
  const { t } = useTranslation();
  // Adding an expense from inside a group pre-selects that group.
  const groupMatch = useMatch(`${routes.groups}/:groupId/*`);
  const groupId = groupMatch?.params.groupId;
  const contextualGroupId = groupId && groupId !== 'new' ? groupId : undefined;

  return (
    <Nav aria-label={t('mainNavigation')}>
      <NavList>
        <li>
          <NavItem to={routes.groups}>
            <UsersRound size={22} aria-hidden />
            {t('groups')}
          </NavItem>
        </li>
        <li>
          <AddItem to={routes.newExpense(contextualGroupId)}>
            <span aria-hidden>
              <Plus size={20} />
            </span>
            <span>{t('addExpense')}</span>
          </AddItem>
        </li>
        <li>
          <NavItem to={routes.account}>
            <UserRound size={22} aria-hidden />
            {t('account')}
          </NavItem>
        </li>
      </NavList>
    </Nav>
  );
};
