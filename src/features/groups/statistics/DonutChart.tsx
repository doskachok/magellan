import { useState } from 'react';
import styled, { keyframes, useTheme } from 'styled-components';

import { Avatar } from 'components';
import { getFileUrl } from 'lib/config';
import { formatMoney, formatPercent } from 'lib/format';
import { fadeIn } from 'theme/motion';
import { OTHER_KEY, type Slice } from './slices';

const SIZE = 180;
const RADIUS = 70;
const THICKNESS = 24;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
/** Surface-coloured gap between neighbouring segments. */
const GAP = 2;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space(4)};
`;

const Figure = styled.div`
  position: relative;
  width: ${SIZE}px;
  height: ${SIZE}px;
`;

const Svg = styled.svg`
  display: block;
  transform: rotate(-90deg);
`;

/** Each segment grows from its own start; delays follow the angle, so together they sweep round the ring. */
const SWEEP_MS = 360;

const draw = keyframes`
  from { stroke-dasharray: 0 ${CIRCUMFERENCE}; }
`;

const Segment = styled.circle`
  cursor: pointer;
  transition: stroke-width ${({ theme }) => theme.motion.fast};
  animation: ${draw} 520ms cubic-bezier(0.2, 0.8, 0.2, 1) backwards;

  &:focus-visible {
    outline: none;
    stroke-width: ${THICKNESS + 6}px;
  }
`;

const Center = styled.div`
  position: absolute;
  inset: ${THICKNESS + 14}px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  text-align: center;
  pointer-events: none;
  animation: ${fadeIn} 160ms ease-out;
`;

const CenterCaption = styled.span`
  max-width: 100%;
  overflow: hidden;
  font-size: ${({ theme }) => theme.font.size.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const CenterValue = styled.span`
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  font-variant-numeric: tabular-nums;
`;

const Legend = styled.ul`
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const LegendRow = styled.li<{ $active: boolean }>`
  display: grid;
  grid-template-columns: auto auto 1fr auto auto;
  align-items: center;
  gap: ${({ theme }) => theme.space(2)};
  padding: ${({ theme }) => theme.space(2)};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme, $active }) => ($active ? theme.colors.surfaceMuted : 'transparent')};
`;

const Swatch = styled.span<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 3px;
  background: ${({ $color }) => $color};
`;

const Name = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const Amount = styled.span`
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  font-variant-numeric: tabular-nums;
`;

const Percent = styled.span`
  min-width: 3.5em;
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  font-variant-numeric: tabular-nums;
  text-align: right;
`;

interface DonutChartProps {
  /** Names the chart for screen readers. */
  label: string;
  slices: Slice[];
  currencyCode: string;
  /** Shown in the middle while no segment is hovered. */
  totalCaption: string;
  /** The total in the middle; defaults to the sum of the slices. */
  total?: number;
}

/** Part-to-whole donut with a legend that always carries the values, so nothing relies on colour alone. */
export const DonutChart = ({ label, slices, currencyCode, totalCaption, total: displayedTotal }: DonutChartProps) => {
  const theme = useTheme();
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const total = slices.reduce((sum, slice) => sum + slice.value, 0);
  const colorOf = (slice: Slice) => (slice.colorIndex === null ? theme.chart.other : theme.chart.series[slice.colorIndex]!);
  const active = slices.find(slice => slice.key === activeKey);
  const gap = slices.length > 1 ? GAP : 0;

  const lengthOf = (slice: Slice) => (slice.value / total) * CIRCUMFERENCE;
  const segments = slices.map((slice, index) => ({
    slice,
    start: slices.slice(0, index).reduce((sum, previous) => sum + lengthOf(previous), 0),
    length: Math.max(lengthOf(slice) - gap, 0.5),
  }));

  return (
    <Root>
      <Figure>
        <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label={label}>
          {segments.map(({ slice, start, length }) => (
            <Segment
              key={slice.key}
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke={colorOf(slice)}
              strokeWidth={slice.key === activeKey ? THICKNESS + 6 : THICKNESS}
              strokeDasharray={`${length} ${CIRCUMFERENCE - length}`}
              strokeDashoffset={-start}
              style={{ animationDelay: `${(start / CIRCUMFERENCE) * SWEEP_MS}ms` }}
              tabIndex={0}
              aria-label={`${slice.label}: ${formatMoney(slice.value, currencyCode)}, ${formatPercent(slice.value, total)}`}
              onMouseEnter={() => setActiveKey(slice.key)}
              onMouseLeave={() => setActiveKey(null)}
              onFocus={() => setActiveKey(slice.key)}
              onBlur={() => setActiveKey(null)}
            />
          ))}
        </Svg>
        {/* Re-keyed per segment so the readout fades between values instead of snapping. */}
        <Center aria-hidden key={activeKey ?? 'total'}>
          <CenterCaption>{active ? active.label : totalCaption}</CenterCaption>
          <CenterValue>{formatMoney(active ? active.value : (displayedTotal ?? total), currencyCode)}</CenterValue>
          {active && <CenterCaption>{formatPercent(active.value, total)}</CenterCaption>}
        </Center>
      </Figure>

      <Legend>
        {slices.map(slice => (
          <LegendRow
            key={slice.key}
            $active={slice.key === activeKey}
            onMouseEnter={() => setActiveKey(slice.key)}
            onMouseLeave={() => setActiveKey(null)}
          >
            <Swatch $color={colorOf(slice)} aria-hidden />
            {slice.key === OTHER_KEY ? <span /> : <Avatar name={slice.label} src={getFileUrl(slice.avatarId)} size={28} />}
            <Name>{slice.label}</Name>
            <Amount>{formatMoney(slice.value, currencyCode)}</Amount>
            <Percent>{formatPercent(slice.value, total)}</Percent>
          </LegendRow>
        ))}
      </Legend>
    </Root>
  );
};
