import styled from 'styled-components';

const Group = styled.div`
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  gap: 2px;
  padding: 3px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surfaceMuted};
`;

const Option = styled.button<{ $selected: boolean }>`
  min-height: 38px;
  padding: ${({ theme }) => theme.space(0, 2)};
  border: none;
  border-radius: 10px;
  background: ${({ theme, $selected }) => ($selected ? theme.colors.surface : 'transparent')};
  box-shadow: ${({ theme, $selected }) => ($selected ? theme.shadow.card : 'none')};
  color: ${({ theme, $selected }) => ($selected ? theme.colors.text : theme.colors.textMuted)};
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  cursor: pointer;
  transition: background ${({ theme }) => theme.motion.fast};
`;

interface SegmentedControlProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}

export const SegmentedControl = <T extends string>({ label, value, options, onChange }: SegmentedControlProps<T>) => (
  <Group role="radiogroup" aria-label={label}>
    {options.map(option => (
      <Option
        key={option.value}
        type="button"
        role="radio"
        aria-checked={option.value === value}
        $selected={option.value === value}
        onClick={() => onChange(option.value)}
      >
        {option.label}
      </Option>
    ))}
  </Group>
);
