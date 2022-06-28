import {useState, useMemo, useCallback} from 'react';

import Header from '../../../components/Header';
import Input from '../../../components/Input';
import Button from '../../../components/Button';

import {Column, PageWrapper, Row} from '../../../components/Containers';
import {ContentWrapper} from './index.styled';

import {useRegisterMutation} from '../api';

import {useTranslation} from 'react-i18next';

import {usernameValidator, emailValidator} from './validation';

interface iForm {
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

interface iValidation {
  username: boolean;
  email: boolean;
}

const Register = () => {
  const {t} = useTranslation('auth');

  const [form, setForm] = useState<iForm>({
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  });

  const [validation, setValidation] = useState<iValidation>({
    username: false,
    email: false,
  });

  const [register] = useRegisterMutation();

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

  return (
    <PageWrapper>
      <Header text={t('signup')} />
      <ContentWrapper jc={'space-between'} fullWidth>
        <Column gap={'8px'} fullWidth>
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
            name={'email'}
            value={form.email}
            placeholder={t('email')}
            onTextChange={onInputChange}
            validator={emailValidator}
            onValidationChange={onValidationChange}
          />

          <Input
            name={'password'}
            value={form.password}
            placeholder={t('password')}
            onTextChange={onInputChange}
          />

          <Input
            name={'confirmPassword'}
            value={form.passwordConfirmation}
            placeholder={t('confirmPassword')}
            onTextChange={onInputChange}
          />
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
