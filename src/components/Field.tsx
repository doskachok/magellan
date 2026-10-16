import { useId, type InputHTMLAttributes, type ReactNode, type Ref, type SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import styled, { css } from 'styled-components';

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(1.5)};
  width: 100%;
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.colors.text};
`;

const Message = styled.p<{ $error?: boolean }>`
  font-size: ${({ theme }) => theme.font.size.xs};
  color: ${({ theme, $error }) => ($error ? theme.colors.negative : theme.colors.textMuted)};
`;

const controlStyles = css<{ $invalid: boolean }>`
  width: 100%;
  min-height: 48px;
  padding: ${({ theme }) => theme.space(0, 3.5)};
  border: 1px solid ${({ theme, $invalid }) => ($invalid ? theme.colors.negative : theme.colors.borderStrong)};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface};
  font-size: ${({ theme }) => theme.font.size.md};
  transition: border-color ${({ theme }) => theme.motion.fast}, box-shadow ${({ theme }) => theme.motion.fast};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
    opacity: 0.8;
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.brand};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.brandSoft};
  }

  &:disabled,
  &[readonly] {
    background: ${({ theme }) => theme.colors.surfaceMuted};
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const ControlRow = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input<{ $invalid: boolean; $hasSuffix: boolean }>`
  ${controlStyles}
  ${({ $hasSuffix }) => $hasSuffix && css`padding-right: 52px;`}
`;

const Select = styled.select<{ $invalid: boolean }>`
  ${controlStyles}
  appearance: none;
  padding-right: 44px;
  cursor: pointer;
`;

const Suffix = styled.div`
  position: absolute;
  right: 4px;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.textMuted};
  pointer-events: none;

  & > button {
    pointer-events: auto;
  }
`;

const SelectChevron = styled(Suffix)`
  right: 14px;
`;

interface FieldChromeProps {
  label: string;
  hint?: string;
  error?: string;
  hideLabel?: boolean;
}

const useFieldIds = (id?: string) => {
  const generated = useId();
  const controlId = id ?? generated;
  return { controlId, messageId: `${controlId}-message` };
};

interface TextFieldProps extends FieldChromeProps, InputHTMLAttributes<HTMLInputElement> {
  suffix?: ReactNode;
  ref?: Ref<HTMLInputElement>;
}

export const TextField = ({ label, hint, error, hideLabel, suffix, id, ref, ...rest }: TextFieldProps) => {
  const { controlId, messageId } = useFieldIds(id);
  const message = error ?? hint;

  return (
    <FieldWrapper>
      <Label htmlFor={controlId} className={hideLabel ? 'visually-hidden' : undefined}>
        {label}
      </Label>
      <ControlRow>
        <Input
          ref={ref}
          id={controlId}
          $invalid={Boolean(error)}
          $hasSuffix={Boolean(suffix)}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          {...rest}
        />
        {suffix && <Suffix>{suffix}</Suffix>}
      </ControlRow>
      {message && (
        <Message id={messageId} $error={Boolean(error)} role={error ? 'alert' : undefined}>
          {message}
        </Message>
      )}
    </FieldWrapper>
  );
};

interface SelectFieldProps extends FieldChromeProps, SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
  placeholder?: string;
  ref?: Ref<HTMLSelectElement>;
}

export const SelectField = ({ label, hint, error, hideLabel, options, placeholder, id, ref, ...rest }: SelectFieldProps) => {
  const { controlId, messageId } = useFieldIds(id);
  const message = error ?? hint;

  return (
    <FieldWrapper>
      <Label htmlFor={controlId} className={hideLabel ? 'visually-hidden' : undefined}>
        {label}
      </Label>
      <ControlRow>
        <Select
          ref={ref}
          id={controlId}
          $invalid={Boolean(error)}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <SelectChevron aria-hidden>
          <ChevronDown size={20} />
        </SelectChevron>
      </ControlRow>
      {message && (
        <Message id={messageId} $error={Boolean(error)} role={error ? 'alert' : undefined}>
          {message}
        </Message>
      )}
    </FieldWrapper>
  );
};
