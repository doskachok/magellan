import styled from 'styled-components';

import { staggeredEntrance } from 'theme/motion';

export const Card = styled.section<{ $padded?: boolean }>`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.card};
  padding: ${({ theme, $padded }) => ($padded ? theme.space(4) : 0)};
  overflow: hidden;
`;

export const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const Stack = styled.div<{ $gap?: number }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme, $gap = 4 }) => theme.space($gap)};
`;

export const Muted = styled.p`
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

/** A card that is also a `<ul>`; put each row in an `<li>`. */
export const CardList = styled(Card).attrs({ as: 'ul' })`
  margin: 0;
  padding: 0;
  list-style: none;

  & > li {
    ${staggeredEntrance()}
  }
`;

export const PlainList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;
