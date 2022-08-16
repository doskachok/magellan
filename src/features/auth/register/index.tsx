import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '../../../constants/routes';

import Header from '../../../components/Header';
import Input from '../../../components/Input';
import Button from '../../../components/Button';

import { Column, PageWrapper, Row } from '../../../components/Containers';
import {
  ContentWrapper,
  PasswordRequirementsText,
  PasswordRequirementsWrapper,
  RequiredText,
} from './index.styled';

import { useRegisterMutation } from '../api';

import { useTranslation } from 'react-i18next';

import {
  usernameValidator,
  emailValidator,
  passwordValidator,
  createConfirmPasswordValidator,
} from '../validation';

interface IForm {
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

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

  const [form, setForm] = useState<IForm>({
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

  const [passwordRequirements, setPasswordRequirements] =
    useState<IPasswordRequirements>({
      length: false,
      capitalLetter: false,
      number: false,
    });

  const confirmPasswordValidator = useMemo(
    () => createConfirmPasswordValidator(form.password),
    [form.password]
  );

  const [register] = useRegisterMutation();

  const isDisabled = useMemo(
    () => Object.values(validation).some((el) => !el),
    [validation]
  );

  const onInputChange = useCallback((name: string, value: string) => {
    setForm((form) => ({
      ...form,
      [name]: value,
    }));
  }, []);

  const onValidationChange = useCallback((name: string, value: boolean) => {
    setValidation((validation) => ({
      ...validation,
      [name]: value,
    }));
  }, []);

  const onFromSubmit = () => {
    register(form).then((response: any) => {
      const state = { isRegistered: !response.error };
      navigate(ROUTES.AUTH.ROOT, { state });
    });
  };

  useEffect(() => {
    const requirements = {
      length: form.password.length >= 8,
      capitalLetter: /[A-Z]+/.test(form.password),
      number: /\d+/.test(form.password),
    };
    setPasswordRequirements(requirements);
  }, [form.password, setPasswordRequirements]);

  return (
    <PageWrapper>
      <Header text={t('signup')} />
      <ContentWrapper jc={'space-between'} fullWidth>
        <Column gap={'8px'} fullWidth>
          <RequiredText>
            <span>*</span>
            {t('requiredText')}
          </RequiredText>

          <Input
            required
            name={'username'}
            value={form.username}
            placeholder={t('username')}
            onTextChange={onInputChange}
            validator={usernameValidator}
            onValidationChange={onValidationChange}
          />

          <Input
            required
            name={'email'}
            value={form.email}
            placeholder={t('email')}
            onTextChange={onInputChange}
            validator={emailValidator}
            onValidationChange={onValidationChange}
          />

          <Input
            required
            type={'password'}
            name={'password'}
            value={form.password}
            placeholder={t('password')}
            onTextChange={onInputChange}
            validator={passwordValidator}
            onValidationChange={onValidationChange}
          />

          <Input
            required
            type={'password'}
            name={'passwordConfirmation'}
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
            <PasswordRequirementsText
              fulfilled={passwordRequirements.capitalLetter}
            >
              {t('containCapitalLetter')}
            </PasswordRequirementsText>
            <PasswordRequirementsText fulfilled={passwordRequirements.number}>
              {t('containNumber')}
            </PasswordRequirementsText>
          </PasswordRequirementsWrapper>
        </Column>

        <Row jc={'flex-end'} fullWidth>
          <Button onClick={onFromSubmit} disabled={isDisabled}>
            {t('createAccount')}
          </Button>
        </Row>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default Register;
