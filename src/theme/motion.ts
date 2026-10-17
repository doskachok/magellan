import { css, keyframes } from 'styled-components';

export const fadeIn = keyframes`
  from { opacity: 0; }
`;

export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
`;

export const popIn = keyframes`
  from { opacity: 0; transform: scale(0.6); }
`;

/**
 * Entrance for each child of a list, delayed by its position (capped so long lists don't drag).
 * The fill is `backwards`, never `both`: a kept transform would trap fixed-position descendants.
 * Browsers without `sibling-index()` drop the delay and animate every child at once.
 */
export const staggeredEntrance = (step = 30) => css`
  animation: ${fadeUp} ${({ theme }) => theme.motion.enter} backwards;
  animation-delay: calc((min(sibling-index(), 10) - 1) * ${step}ms);
`;
