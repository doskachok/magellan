import { useRef, type KeyboardEvent } from 'react';
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
  min-height: ${({ theme }) => theme.layout.touchTarget};
  padding: ${({ theme }) => theme.space(0, 2)};
  border: none;
  border-radius: 10px;
  background: ${({ theme, $selected }) => ($selected ? theme.colors.surface : 'transparent')};
  /* The brand outline keeps the selection visible (≥3:1) where white on the muted track is not. */
  box-shadow: ${({ theme, $selected }) => ($selected ? `inset 0 0 0 1px ${theme.colors.brand}, ${theme.shadow.card}` : 'none')};
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

/** ARIA radio group: one Tab stop on the selected option, arrow keys move and select. */
export const SegmentedControl = <T extends string>({ label, value, options, onChange }: SegmentedControlProps<T>) => {
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    const target = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 : step && (index + step + options.length) % options.length;
    if (target === undefined) return;

    event.preventDefault();
    onChange(options[target]!.value);
    optionRefs.current[target]?.focus();
  };

  return (
    <Group role="radiogroup" aria-label={label}>
      {options.map((option, index) => {
        const selected = option.value === value;
        return (
          <Option
            key={option.value}
            ref={element => {
              optionRefs.current[index] = element;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            $selected={selected}
            onClick={() => onChange(option.value)}
            onKeyDown={event => handleKeyDown(event, index)}
          >
            {option.label}
          </Option>
        );
      })}
    </Group>
  );
};
