import styled from 'styled-components';

export const Content = styled.main`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(4)};
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  padding: ${({ theme }) => theme.space(4)};
`;

/** Sticky bar for a screen's primary action, kept above the bottom navigation. */
export const Footer = styled.div`
  position: sticky;
  bottom: 0;
  z-index: 5;
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  padding: ${({ theme }) => theme.space(3, 4, 4)};
  background: linear-gradient(to top, ${({ theme }) => theme.colors.background} 75%, transparent);
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(2)};
`;
