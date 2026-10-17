import { useTranslation } from 'react-i18next';
import styled, { keyframes } from 'styled-components';

import { formatMoney, toneOf } from 'lib/format';
import type { MemberStatistics } from '../types';

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(3)};
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Row = styled.li`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(1)};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space(2)};
  font-size: ${({ theme }) => theme.font.size.sm};
`;

const Name = styled.span`
  overflow: hidden;
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const Value = styled.span`
  font-size: ${({ theme }) => theme.font.size.sm};
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-variant-numeric: tabular-nums;
`;

/** Two halves around a centre line: paying more than your share grows right, less grows left. */
const Track = styled.div`
  position: relative;
  height: 10px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.surfaceMuted};

  &::after {
    content: '';
    position: absolute;
    top: -2px;
    bottom: -2px;
    left: 50%;
    width: 1px;
    background: ${({ theme }) => theme.colors.borderStrong};
  }
`;

const grow = keyframes`
  from { transform: scaleX(0); }
`;

const Fill = styled.span<{ $width: number; $positive: boolean }>`
  position: absolute;
  top: 0;
  bottom: 0;
  ${({ $positive }) => ($positive ? 'left: 50%' : 'right: 50%')};
  width: ${({ $width }) => $width / 2}%;
  border-radius: ${({ $positive }) => ($positive ? '0 4px 4px 0' : '4px 0 0 4px')};
  background: ${({ theme, $positive }) => ($positive ? theme.colors.positive : theme.colors.negative)};
  /* Bars grow outwards from the centre line. */
  transform-origin: ${({ $positive }) => ($positive ? 'left' : 'right')};
  animation: ${grow} 600ms cubic-bezier(0.2, 0.8, 0.2, 1) 120ms backwards;
`;

interface PaidVsShareChartProps {
  members: MemberStatistics[];
  currencyCode: string;
}

export const PaidVsShareChart = ({ members, currencyCode }: PaidVsShareChartProps) => {
  const { t } = useTranslation('groups');

  const rows = members
    .filter(member => member.paid > 0 || member.share > 0)
    .map(member => ({ member, net: member.paid - member.share }))
    .toSorted((a, b) => b.net - a.net);
  const max = Math.max(...rows.map(row => Math.abs(row.net)), 0);

  return (
    <List>
      {rows.map(({ member, net }) => {
        const tone = toneOf(net);
        const amount = formatMoney(Math.abs(net), currencyCode);
        return (
          <Row key={member.userId}>
            <Header>
              <Name>{member.name}</Name>
              <Value>
                {tone === 'positive' && t('statsPaidMore', { amount })}
                {tone === 'negative' && t('statsPaidLess', { amount })}
                {tone === 'neutral' && t('statsPaidEven')}
              </Value>
            </Header>
            <Track aria-hidden>
              {tone !== 'neutral' && <Fill $width={(Math.abs(net) / max) * 100} $positive={tone === 'positive'} />}
            </Track>
            <Value>
              {t('statsPaidAndShare', {
                paid: formatMoney(member.paid, currencyCode),
                share: formatMoney(member.share, currencyCode),
              })}
            </Value>
          </Row>
        );
      })}
    </List>
  );
};
