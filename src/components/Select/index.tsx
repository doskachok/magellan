import {
  useCallback,
  memo,
  FocusEvent,
  MouseEvent,
  SelectHTMLAttributes,
  ChangeEvent,
  useEffect,
  useMemo,
} from 'react';
import { DisplayName, SelectLabel, SelectStyled, Wrapper } from './index.styled';
import { ReactComponent as AngleDownSVG } from '../../assets/images/angle-down.svg';
import { useState } from 'react';
import { AnySchema } from 'yup';
import { TextError } from 'components/Input/index.styled';
import { useTranslation } from 'react-i18next';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  value: string;
  name: string;
  options: { title: string, value: string }[];
  onValueChanged: (name: string, value: string) => void;
  reversedTheme?: boolean;
  validator?: AnySchema;
  onValidationChange?: (name: string, isValid: boolean) => void;
  error?: string;
  displayName?: string;
  required?: boolean;
}

const validate = (schema: AnySchema, value: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    schema
      .validate(value, { abortEarly: false })
      .then(() => resolve([]))
      .catch(err => {
        reject(err.errors);
      });
  });
};

const Select =
  ({
    value,
    name,
    options = [],
    onValueChanged,
    reversedTheme = false,
    required = false,
    validator,
    onValidationChange,
    error,
    displayName,
    placeholder,
    onClick,
    onBlur,
    ...rest
  }: Props) => {
    const { t } = useTranslation('validation');

    const handleChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
      onValueChanged(name, event.target.value);
    }, [onValueChanged, name]);

    const [isOpened, setIsOpened] = useState(false);

    const [isShowError, setIsShowError] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const _error = useMemo(() => error || errors.length ? errors[0] : '', [error, errors]);

    const displayError = !!_error && isShowError;

    const handleClick = useCallback((event: MouseEvent<HTMLSelectElement>) => {
      onClick && onClick(event);

      setIsOpened(!isOpened);
    }, [isOpened, onClick]);

    const handleBlur = useCallback((event: FocusEvent<HTMLSelectElement>) => {
      onBlur && onBlur(event);

      setIsShowError(true);
      setIsOpened(false);
    }, [onBlur]);

    useEffect(() => {
      onValidationChange &&
        onValidationChange(name, !errors.length);
    }, [errors, onValidationChange, name]);

    useEffect(() => {
      if (validator) {
        validate(validator, value)
          .then(setErrors)
          .catch(setErrors);
      }
    }, [validator, value]);

    return (
      <Wrapper fullWidth>
        {displayError && <TextError>{t(_error)}</TextError>}

        {
          (!displayError && value && displayName) && 
          <DisplayName reversedTheme={reversedTheme}> 
            {`${required ? '*' : ''} ${displayName}`.trim()}
          </DisplayName>
        }

        <SelectLabel reversedTheme={reversedTheme} isOpened={isOpened} hasError={displayError}>
          <span>{options.find(v => v.value === value)?.title || placeholder}</span>
          <SelectStyled
            name={name}
            value={value}
            onChange={handleChange}
            reversedTheme={reversedTheme}
            onBlur={handleBlur}
            onClick={handleClick}
            {...rest}>
            {options.map(o => <option key={o.value} value={o.value}>{o.title}</option>)}
          </SelectStyled>

          <AngleDownSVG />
        </SelectLabel>
      </Wrapper>
    );
  };

export default memo(Select);
