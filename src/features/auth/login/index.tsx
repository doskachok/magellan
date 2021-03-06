import { useCallback, useMemo, useState, useEffect } from 'react';

import Header from '../../../components/Header';
import { Column, PageWrapper, Row } from '../../../components/Containers';
import { ContentWrapper, ForgotPasswordLink, NoAccountLink, RequiredText } from './index.styled';

import { useTranslation } from 'react-i18next';
import { useLoginMutation, useLazyUserQuery } from '../api';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import { requiredValidator } from '../validation';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { ILoginForm } from '../types';

interface IValidation {
  login: boolean;
  password: boolean;
}

const Login = () => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();

  const [form, setForm] = useState<ILoginForm>({
    login: '',
    password: '',
  });

  const [validation, setValidation] = useState<IValidation>({
    login: false,
    password: false,
  });

  const [login, {data: loginData}] = useLoginMutation();
  const [getUser] = useLazyUserQuery();

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

  const onFormSubmit = async () => {
    login(form);
  };

  useEffect(() => {
    if (loginData) {
      getUser(loginData.id)
        .then(() => navigate(ROUTES.GROUPS.ROOT, { replace: true }));
    }
  }, [loginData, navigate, getUser]);

  return (
    <PageWrapper>
      <Header text={'Login'} />
      <ContentWrapper jc={'space-between'} fullWidth>

        <Column gap={'8px'} fullWidth>
          <RequiredText>
            <span>*</span>
            {t('requiredText')}
          </RequiredText>

          <Input
            required
            name='login'
            value={form.login}
            validator={requiredValidator}
            placeholder={t('usernameOrEmailAddress')}
            onTextChange={onInputChange}
            onValidationChange={onValidationChange}
          />

          <Input
            required
            name={'password'}
            type={'password'}
            value={form.password}
            validator={requiredValidator}
            placeholder={t('password')}
            onTextChange={onInputChange}
            onValidationChange={onValidationChange}
          />

          <ForgotPasswordLink to={`${ROUTES.AUTH.ROOT}/${ROUTES.AUTH.FORGOT_PASSWORD}`}>
            {t('forgotPassword')}
          </ForgotPasswordLink>

          <NoAccountLink to={`${ROUTES.AUTH.ROOT}/${ROUTES.AUTH.REGISTER}`}>
            {t('noAccount')}
          </NoAccountLink>
        </Column>

        <Row jc={'flex-end'} fullWidth>
          <Button onClick={onFormSubmit} disabled={isDisabled}>
            {t('signIn')}
          </Button>
        </Row>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default Login;
