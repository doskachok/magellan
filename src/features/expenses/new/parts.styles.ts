import styled from 'styled-components';

export const StepHeading = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(1)};

  h2 {
    font-size: ${({ theme }) => theme.font.size.lg};
    font-weight: ${({ theme }) => theme.font.weight.semibold};
  }

  p {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

export const Notice = styled.p<{ $tone: 'positive' | 'negative' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(2)};
  padding: ${({ theme }) => theme.space(3, 4)};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme, $tone }) => ($tone === 'positive' ? theme.colors.positiveSoft : theme.colors.negativeSoft)};
  color: ${({ theme, $tone }) => theme.colors[$tone]};
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
`;

export const FooterActions = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: ${({ theme }) => theme.space(3)};
`;

export const Radio = styled.input.attrs({ type: 'radio' })`
  width: 22px;
  height: 22px;
  margin: 0;
  accent-color: ${({ theme }) => theme.colors.brand};
`;

export const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 22px;
  height: 22px;
  margin: 0;
  accent-color: ${({ theme }) => theme.colors.brand};
`;

/** Full-width clickable row wrapping a radio or checkbox so the whole row is the touch target. */
export const ChoiceRow = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(3)};
  min-height: 60px;
  padding: ${({ theme }) => theme.space(2, 4)};
  cursor: pointer;

  & + & {
    border-top: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

export const RowName = styled.span`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const RowAmount = styled.span<{ $muted?: boolean }>`
  font-variant-numeric: tabular-nums;
  color: ${({ theme, $muted }) => ($muted ? theme.colors.textMuted : theme.colors.text)};
`;

export const RowSubtitle = styled.span`
  display: block;
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.regular};
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.colors.textMuted};
`;
