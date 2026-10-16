import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router';

import { Button, TextField } from 'components';
import { routes } from 'lib/routes';
import { useSignInMutation } from './api';
import { AuthLayout } from './AuthLayout';
import { AuthFooter, AuthForm } from './AuthLayout.styles';
import { PasswordField } from './PasswordField';
import { signInSchema, type SignInForm } from './schemas';

interface LocationState {
  from?: string;
}

const SignInPage = () => {
  const { t } = useTranslation('auth');
  const { t: tv } = useTranslation('validation');
  const navigate = useNavigate();
  const location = useLocation();
  const [signIn, { isLoading }] = useSignInMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>({
    resolver: yupResolver(signInSchema),
    defaultValues: { login: '', password: '' },
  });

  const onSubmit = async (form: SignInForm) => {
    const result = await signIn(form);
    if ('data' in result) {
      const from = (location.state as LocationState | null)?.from;
      navigate(from ?? routes.groups, { replace: true });
    }
  };

  const errorText = (key?: string) => (key ? tv(key) : undefined);

  return (
    <AuthLayout title={t('signInTitle')}>
      <AuthForm onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          label={t('usernameOrEmail')}
          autoComplete="username"
          autoCapitalize="none"
          autoCorrect="off"
          error={errorText(errors.login?.message)}
          {...register('login')}
        />
        <PasswordField
          label={t('password')}
          autoComplete="current-password"
          error={errorText(errors.password?.message)}
          {...register('password')}
        />
        <Button type="submit" fullWidth loading={isLoading}>
          {t('signIn')}
        </Button>
      </AuthForm>
      <AuthFooter>
        {t('noAccount')} <Link to={routes.signUp}>{t('createAccount')}</Link>
      </AuthFooter>
    </AuthLayout>
  );
};

export default SignInPage;
