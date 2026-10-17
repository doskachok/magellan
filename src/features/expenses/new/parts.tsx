import type { InputHTMLAttributes } from 'react';
import styled from 'styled-components';

import { isAmountInput } from './draft';

const StyledInput = styled.input`
  width: 104px;
  min-height: 44px;
  padding: ${({ theme }) => theme.space(0, 3)};
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.surface};
  font-variant-numeric: tabular-nums;
  text-align: right;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.brand};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.brand};
  }
`;

interface AmountInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: string;
  label: string;
  onValueChange: (value: string) => void;
}

/** Compact decimal input used inside list rows; rejects keystrokes that would make an invalid amount. */
export const AmountInput = ({ value, label, onValueChange, ...rest }: AmountInputProps) => (
  <StyledInput
    type="text"
    inputMode="decimal"
    autoComplete="off"
    placeholder="0"
    aria-label={label}
    value={value}
    onChange={event => {
      if (isAmountInput(event.target.value)) onValueChange(event.target.value);
    }}
    {...rest}
  />
);

const StepperRoot = styled.div`
  /* Stays in place while the step below it slides, so the bar fill reads as progress. */
  view-transition-name: expense-stepper;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(2)};
`;

const StepperBars = styled.ol`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.space(1.5)};
  margin: 0;
  padding: 0;
  list-style: none;
`;

const StepperBar = styled.li<{ $state: 'done' | 'current' | 'todo' }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(1.5)};
  font-size: ${({ theme }) => theme.font.size.xs};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme, $state }) => ($state === 'todo' ? theme.colors.textMuted : theme.colors.brand)};
  transition: color ${({ theme }) => theme.motion.normal};

  /* A brand fill sweeps across the track as the step is reached, and drains back when leaving it. */
  &::before {
    content: '';
    height: 4px;
    border-radius: ${({ theme }) => theme.radius.pill};
    background: linear-gradient(${({ theme }) => `${theme.colors.brand}, ${theme.colors.brand}`}) left / ${({ $state }) => ($state === 'todo' ? '0%' : '100%')} 100% no-repeat
      ${({ theme }) => theme.colors.border};
    transition: background-size 360ms cubic-bezier(0.2, 0.8, 0.2, 1);
  }
`;

export const Stepper = ({ steps, current }: { steps: string[]; current: number }) => (
  <StepperRoot>
    <StepperBars>
      {steps.map((label, index) => (
        <StepperBar
          key={label}
          $state={index < current ? 'done' : index === current ? 'current' : 'todo'}
          aria-current={index === current ? 'step' : undefined}
        >
          {label}
        </StepperBar>
      ))}
    </StepperBars>
  </StepperRoot>
);

