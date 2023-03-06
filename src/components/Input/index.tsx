import {
  InputHTMLAttributes,
  FocusEvent,
  ChangeEvent,
  useState,
  useMemo,
  useEffect,
  useCallback,
  memo,
} from 'react';
import { DisplayName, InputStyled, RequiredIndicator, TextError, Wrapper } from './index.styled';

import { useTranslation } from 'react-i18next';

import { AnySchema } from 'yup';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  value: string;
  name: string;
  displayName?: string;
  onTextChange: (name: string, value: string) => void;
  onValidationChange?: (name: string, isValid: boolean) => void;
  error?: string;
  validator?: AnySchema;
  required?: boolean;
  reversedTheme?: boolean;
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

const Input =
  ({
    value,
    name,
    displayName,
    onTextChange,
    error,
    validator,
    onValidationChange,
    required = false,
    reversedTheme = false,
    ...rest
  }: Props) => {

    const { t } = useTranslation('validation');

    const [isShowError, setIsShowError] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const _error = useMemo(() => error || errors.length ? errors[0] : '', [error, errors]);

    const displayError = !!_error && isShowError;

    const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
      onTextChange(name, event.target.value);
      setIsShowError(false);
    }, [onTextChange, name]);

    const handleBlur = useCallback((event: FocusEvent<HTMLInputElement>) => {
      rest.onBlur && rest.onBlur(event);
      setIsShowError(true);
    }, [rest]);

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

        {(required && !value) && <RequiredIndicator reversedTheme={reversedTheme}>*</RequiredIndicator>}

        {(!(!!_error && isShowError) && value && displayName) && <DisplayName reversedTheme={reversedTheme}> {displayName} </DisplayName>}

        <InputStyled
          name={name}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          hasError={displayError}
          reversedTheme={reversedTheme}
          {...rest}
        />
      </Wrapper>
    );
  };

export default memo(Input);
