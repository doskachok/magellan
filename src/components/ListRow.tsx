import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { ChevronRight } from 'lucide-react';
import styled, { css } from 'styled-components';

const rowStyles = css`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(3)};
  width: 100%;
  min-height: 64px;
  padding: ${({ theme }) => theme.space(3, 4)};
  border: none;
  background: ${({ theme }) => theme.colors.surface};
  color: inherit;
  text-align: left;
  text-decoration: none;

  & + & {
    border-top: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const interactive = css`
  cursor: pointer;
  transition: background ${({ theme }) => theme.motion.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
`;

const StaticRow = styled.div`
  ${rowStyles}
`;

const LinkRow = styled(Link)`
  ${rowStyles}
  ${interactive}
`;

const ButtonRow = styled.button`
  ${rowStyles}
  ${interactive}
`;

const Body = styled.span`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
`;

const Title = styled.span`
  overflow: hidden;
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const Subtitle = styled.span`
  overflow: hidden;
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const Trailing = styled.span`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: ${({ theme }) => theme.space(2)};
  text-align: right;
`;

const Chevron = styled(ChevronRight)`
  color: ${({ theme }) => theme.colors.textDisabled};
`;

interface ListRowProps {
  leading?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  trailing?: ReactNode;
  to?: string;
  onClick?: () => void;
}

export const ListRow = ({ leading, title, subtitle, trailing, to, onClick }: ListRowProps) => {
  const content = (
    <>
      {leading}
      <Body>
        <Title>{title}</Title>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </Body>
      {(trailing || to) && (
        <Trailing>
          {trailing}
          {to && <Chevron size={18} aria-hidden />}
        </Trailing>
      )}
    </>
  );

  if (to) return <LinkRow to={to}>{content}</LinkRow>;
  if (onClick) return <ButtonRow type="button" onClick={onClick}>{content}</ButtonRow>;
  return <StaticRow>{content}</StaticRow>;
};
