import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router';
import styled, { css } from 'styled-components';

const iconButtonStyles = css<{ $tone: 'default' | 'onBrand' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({ theme }) => theme.layout.touchTarget};
  height: ${({ theme }) => theme.layout.touchTarget};
  padding: 0;
  border: none;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: transparent;
  color: ${({ theme, $tone }) => ($tone === 'onBrand' ? theme.colors.onBrand : theme.colors.text)};
  cursor: pointer;
  transition: background ${({ theme }) => theme.motion.fast};

  &:hover {
    background: ${({ $tone }) => ($tone === 'onBrand' ? 'rgba(255, 255, 255, 0.16)' : 'rgba(20, 32, 27, 0.06)')};
  }
`;

const StyledButton = styled.button<{ $tone: 'default' | 'onBrand' }>`
  ${iconButtonStyles}
`;

const StyledLink = styled(Link)<{ $tone: 'default' | 'onBrand' }>`
  ${iconButtonStyles}
`;

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Accessible name — icon-only buttons must always have one. */
  label: string;
  icon: ReactNode;
  tone?: 'default' | 'onBrand';
}

export const IconButton = ({ label, icon, tone = 'default', type = 'button', ...rest }: IconButtonProps) => (
  <StyledButton type={type} aria-label={label} title={label} $tone={tone} {...rest}>
    {icon}
  </StyledButton>
);

interface IconLinkProps {
  label: string;
  icon: ReactNode;
  to: string;
  tone?: 'default' | 'onBrand';
}

export const IconLink = ({ label, icon, to, tone = 'default' }: IconLinkProps) => (
  <StyledLink to={to} aria-label={label} title={label} $tone={tone}>
    {icon}
  </StyledLink>
);
