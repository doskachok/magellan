import { useRef, type KeyboardEvent } from 'react';
import styled from 'styled-components';

const PADDING = 3;
const GAP = 2;

const Group = styled.div<{ $count: number; $index: number }>`
  position: relative;
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  gap: ${GAP}px;
  padding: ${PADDING}px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surfaceMuted};

  /* One thumb slides under the options instead of each option painting its own selected background. */
  &::before {
    content: '';
    position: absolute;
    top: ${PADDING}px;
    bottom: ${PADDING}px;
    left: ${PADDING}px;
    width: ${({ $count }) => `calc((100% - ${PADDING * 2}px - ${($count - 1) * GAP}px) / ${$count})`};
    border-radius: 10px;
    background: ${({ theme }) => theme.colors.surface};
    /* The brand outline keeps the selection visible (≥3:1) where white on the muted track is not. */
    box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.brand}, ${({ theme }) => theme.shadow.card};
    opacity: ${({ $index }) => ($index < 0 ? 0 : 1)};
    transform: translateX(${({ $index }) => `calc(${Math.max($index, 0)} * (100% + ${GAP}px))`});
    transition: transform ${({ theme }) => theme.motion.spring};
  }
`;

const Option = styled.button<{ $selected: boolean }>`
  position: relative;
  min-height: ${({ theme }) => theme.layout.touchTarget};
  padding: ${({ theme }) => theme.space(0, 2)};
  border: none;
  border-radius: 10px;
  background: transparent;
  color: ${({ theme, $selected }) => ($selected ? theme.colors.text : theme.colors.textMuted)};
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  cursor: pointer;
  transition: color ${({ theme }) => theme.motion.normal};
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

  const selectedIndex = options.findIndex(option => option.value === value);

  return (
    <Group role="radiogroup" aria-label={label} $count={options.length} $index={selectedIndex}>
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
