import { useCallback, useMemo, useState, useEffect } from 'react';

import Header from 'components/Header';
import { Column, PageWrapper, Row } from 'components/Containers';
import { ContentWrapper, ForgotPasswordLink, NoAccountLink, RequiredText } from './index.styled';

import { useTranslation } from 'react-i18next';
import { useLoginMutation, useLazyUserQuery } from '../api';
import { Input, Button } from 'components';
import { requiredValidator } from '../validation';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from 'constants/routes';
import { ILoginForm } from '../types';
import { toast } from 'react-hot-toast';

interface IValidation {
  login: boolean;
  password: boolean;
}

interface ILocationState {
  isRegistered?: boolean;
}

const Login = () => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as ILocationState;

  const [form, setForm] = useState<ILoginForm>({
    login: '',
    password: '',
  });

  const [validation, setValidation] = useState<IValidation>({
    login: false,
    password: false,
  });

  const [login, { data: loginData, isLoading }] = useLoginMutation();
  const [getUser] = useLazyUserQuery();

  const isDisabled = useMemo(() => Object.values(validation).some((el) => !el), [validation]);

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

  const onFormSubmit = async () => {
    login(form);
  };

  useEffect(() => {
    if (loginData) {
      getUser(loginData.id)
        .then(() => navigate(ROUTES.GROUPS.ROOT, { replace: true }));
    }
  }, [loginData, navigate, getUser]);

  useEffect(() => {
    if (locationState?.isRegistered) {
      toast.success(t('registrationSuccess'));
    }
  }, [locationState, t]);

  return (
    <PageWrapper>
      <Header text={'Login'} isLoading={isLoading} />
      <ContentWrapper jc={'space-between'} fullWidth>
        <Column gap={'8px'} fullWidth>
          <RequiredText>
            <span>*</span>
            {t('requiredText')}
          </RequiredText>

          <Input
            required
            disabled={isLoading}
            name='login'
            displayName={form.login.includes('@') ? t('email') : t('username') }
            value={form.login}
            validator={requiredValidator}
            placeholder={t('usernameOrEmailAddress')}
            onTextChange={onInputChange}
            onValidationChange={onValidationChange}
          />

          <Input
            required
            disabled={isLoading}
            name={'password'}
            displayName={t('password')}
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
          <Button onClick={onFormSubmit} disabled={isDisabled || isLoading}>
            {t('signIn')}
          </Button>
        </Row>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default Login;
