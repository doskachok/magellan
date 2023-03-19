import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from 'constants/routes';

import Header from 'components/Header';
import { Input, Button } from 'components';

import { Column, PageWrapper, Row } from 'components/Containers';
import { ContentWrapper, PasswordRequirementsText, PasswordRequirementsWrapper, RequiredText } from './index.styled';

import { useRegisterMutation } from '../api';

import { useTranslation } from 'react-i18next';

import { usernameValidator, emailValidator, passwordValidator, createConfirmPasswordValidator } from '../validation';
import { Notification, NotificationType } from 'components/Notification';
import { IRegisterForm, IUser } from '../types';

interface IValidation {
  username: boolean;
  email: boolean;
  password: boolean;
  passwordConfirmation: boolean;
}

interface IPasswordRequirements {
  length: boolean;
  capitalLetter: boolean;
  number: boolean;
}

const Register = () => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();

  const [form, setForm] = useState<IRegisterForm>({
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  });

  const [validation, setValidation] = useState<IValidation>({
    username: false,
    email: false,
    password: false,
    passwordConfirmation: false,
  });

  const [passwordRequirements, setPasswordRequirements] = useState<IPasswordRequirements>({
    length: false,
    capitalLetter: false,
    number: false,
  });

  const confirmPasswordValidator = useMemo(() => createConfirmPasswordValidator(form.password), [form.password]);

  const [register, { data: registerData, isLoading, isSuccess, isError, error }] = useRegisterMutation();

  const [isEmailError, setIsEmailError] = useState(false);
  const isDisabled = useMemo(() => Object.values(validation).some(el => !el), [validation]);

  const onInputChange = useCallback((name: string, value: string) => {
    setForm(form => ({
      ...form,
      [name]: value,
    }));
  }, []);

  const onValidationChange = useCallback((name: string, value: boolean) => {
    setValidation(validation => ({
      ...validation,
      [name]: value,
    }));
  }, []);

  const onFromSubmit = () => {
    register(form);
  };

  useEffect(() => {
    if (isError) {
      setIsEmailError(true);
    }
  }, [isError]);

  useEffect(() => {
    if (registerData && isSuccess) {
      navigate(ROUTES.AUTH.ROOT, { replace: true });
    }
  }, [isSuccess]);

  useEffect(() => {
    const requirements = {
      length: form.password.length >= 8,
      capitalLetter: /[A-Z]+/.test(form.password),
      number: /\d+/.test(form.password),
    };
    setPasswordRequirements(requirements);
  }, [form.password, setPasswordRequirements]);

  const emailUsedTxt = t('email_already_used', 'Try again, this email has been already used');

  return (
    <PageWrapper>
      <Notification text={isEmailError ? emailUsedTxt : null} type={NotificationType.ERROR} />
      <Header text={t('signup')} isLoading={isLoading} />
      <ContentWrapper jc={'space-between'} fullWidth>

        <Column gap={'8px'} fullWidth>
          <RequiredText>
            <span>*</span>
            {t('requiredText')}
          </RequiredText>

          <Input
            required
            disabled={isLoading}
            name={'username'}
            displayName={t('username')}
            value={form.username}
            placeholder={t('username')}
            onTextChange={onInputChange}
            validator={usernameValidator}
            onValidationChange={onValidationChange}
          />

          <Input
            required
            disabled={isLoading}
            name={'email'}
            displayName={t('email')}
            value={form.email}
            placeholder={t('email')}
            onTextChange={onInputChange}
            validator={emailValidator}
            onValidationChange={onValidationChange}
          />

          <Input
            required
            disabled={isLoading}
            type={'password'}
            name={'password'}
            displayName={t('password')}
            value={form.password}
            placeholder={t('password')}
            onTextChange={onInputChange}
            validator={passwordValidator}
            onValidationChange={onValidationChange}
          />

          <Input
            required
            disabled={isLoading}
            type={'password'}
            name={'passwordConfirmation'}
            displayName={t('passwordConfirmation')}
            value={form.passwordConfirmation}
            placeholder={t('confirmPassword')}
            onTextChange={onInputChange}
            validator={confirmPasswordValidator}
            onValidationChange={onValidationChange}
          />

          <PasswordRequirementsWrapper fullWidth>
            <PasswordRequirementsText>
              {t('passwordRequirements')}
            </PasswordRequirementsText>
            <PasswordRequirementsText fulfilled={passwordRequirements.length}>
              {t('atLeast8Chars')}
            </PasswordRequirementsText>
            <PasswordRequirementsText fulfilled={passwordRequirements.capitalLetter}>
              {t('containCapitalLetter')}
            </PasswordRequirementsText>
            <PasswordRequirementsText fulfilled={passwordRequirements.number}>
              {t('containNumber')}
            </PasswordRequirementsText>
          </PasswordRequirementsWrapper>
        </Column>

        <Row jc={'flex-end'} fullWidth>
          <Button onClick={onFromSubmit} disabled={isDisabled || isLoading}>
            {t('createAccount')}
          </Button>
        </Row>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default Register;
