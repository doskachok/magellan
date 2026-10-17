import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Ring = styled.span<{ $size: number }>`
  display: inline-block;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`;

export const Spinner = ({ size = 24, label }: { size?: number; label?: string }) => (
  <Ring $size={size} role={label ? 'status' : undefined} aria-label={label} aria-hidden={label ? undefined : true} />
);

const Centered = styled.div`
  display: flex;
  justify-content: center;
  padding: ${({ theme }) => theme.space(10)};
  color: ${({ theme }) => theme.colors.brand};
`;

export const PageSpinner = ({ label = 'Loading' }: { label?: string }) => (
  <Centered>
    <Spinner size={32} label={label} />
  </Centered>
);
