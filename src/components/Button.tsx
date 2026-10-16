import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router';
import styled, { css } from 'styled-components';

import { Spinner } from './Spinner';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'md' | 'sm';

interface StyleProps {
  $variant: Variant;
  $size: Size;
  $fullWidth: boolean;
}

const variants = {
  primary: css`
    background: ${({ theme }) => theme.colors.brand};
    color: ${({ theme }) => theme.colors.onBrand};
    &:hover:not(:disabled) { background: ${({ theme }) => theme.colors.brandHover}; }
    &:active:not(:disabled) { background: ${({ theme }) => theme.colors.brandPressed}; }
  `,
  secondary: css`
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.brand};
    border-color: ${({ theme }) => theme.colors.border};
    &:hover:not(:disabled) { background: ${({ theme }) => theme.colors.brandSoft}; }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.brand};
    &:hover:not(:disabled) { background: ${({ theme }) => theme.colors.brandSoft}; }
  `,
  danger: css`
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.negative};
    border-color: ${({ theme }) => theme.colors.border};
    &:hover:not(:disabled) { background: ${({ theme }) => theme.colors.negativeSoft}; }
  `,
};

const buttonStyles = css<StyleProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space(2)};
  min-height: ${({ $size }) => ($size === 'md' ? '48px' : '36px')};
  padding: ${({ theme, $size }) => ($size === 'md' ? theme.space(0, 5) : theme.space(0, 3))};
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme, $size }) => ($size === 'md' ? theme.font.size.md : theme.font.size.sm)};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  transition: background ${({ theme }) => theme.motion.fast};

  ${({ $variant }) => variants[$variant]}

  &:disabled {
    cursor: not-allowed;
    background: ${({ theme }) => theme.colors.surfaceMuted};
    color: ${({ theme }) => theme.colors.textDisabled};
    border-color: transparent;
  }

  svg {
    flex-shrink: 0;
  }
`;

const StyledButton = styled.button<StyleProps>`
  ${buttonStyles}
`;

const StyledLink = styled(Link)<StyleProps>`
  ${buttonStyles}
`;

interface CommonProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
}

interface ButtonProps extends CommonProps, ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  icon,
  children,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) => (
  <StyledButton
    type={type}
    $variant={variant}
    $size={size}
    $fullWidth={fullWidth}
    disabled={disabled || loading}
    aria-busy={loading || undefined}
    {...rest}
  >
    {loading ? <Spinner size={18} /> : icon}
    {children}
  </StyledButton>
);

type ButtonLinkProps = CommonProps & LinkProps;

export const ButtonLink = ({ variant = 'primary', size = 'md', fullWidth = false, icon, children, ...rest }: ButtonLinkProps) => (
  <StyledLink $variant={variant} $size={size} $fullWidth={fullWidth} {...rest}>
    {icon}
    {children}
  </StyledLink>
);
