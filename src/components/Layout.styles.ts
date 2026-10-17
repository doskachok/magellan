import styled from 'styled-components';

import { staggeredEntrance } from 'theme/motion';

export const Content = styled.main`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(4)};
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  padding: ${({ theme }) => theme.space(4)};

  /* Sections cascade in when a screen mounts or its data arrives. Dialogs restart animations when opened, so they're left out. */
  & > :not(dialog) {
    ${staggeredEntrance(40)}
  }
`;

/** Sticky bar for a screen's primary action, kept above the bottom navigation. */
export const Footer = styled.div`
  position: sticky;
  bottom: 0;
  z-index: 5;
  /* Primary actions hold still while the page or wizard step behind them slides. */
  view-transition-name: screen-footer;
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  padding: ${({ theme }) => theme.space(3, 4, 4)};
  background: linear-gradient(to top, ${({ theme }) => theme.colors.background} 75%, transparent);
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(2)};
`;
