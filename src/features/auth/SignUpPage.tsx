import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { Check, Circle } from 'lucide-react';
import styled from 'styled-components';

import { Button, TextField } from 'components';
import { routes } from 'lib/routes';
import { getFieldErrors } from 'store/errors';
import { useSignInMutation, useSignUpMutation } from './api';
import { AuthLayout } from './AuthLayout';
import { AuthFooter, AuthForm } from './AuthLayout.styles';
import { PasswordField } from './PasswordField';
import { PASSWORD_RULES, signUpSchema, type SignUpForm } from './schemas';

const Rules = styled.ul`
  display: grid;
  gap: ${({ theme }) => theme.space(1)};
  margin: ${({ theme }) => theme.space(-2)} 0 0;
  padding: 0;
  list-style: none;
`;

const Rule = styled.li<{ $met: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(2)};
  font-size: ${({ theme }) => theme.font.size.xs};
  color: ${({ theme, $met }) => ($met ? theme.colors.positive : theme.colors.textMuted)};
`;

const SIGN_UP_FIELDS = ['username', 'email', 'password', 'passwordConfirmation'] as const;

const SignUpPage = () => {
  const { t } = useTranslation('auth');
  const { t: tv } = useTranslation('validation');
  const navigate = useNavigate();
  const [signUp, { isLoading: isSigningUp }] = useSignUpMutation();
  const [signIn, { isLoading: isSigningIn }] = useSignInMutation();

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: yupResolver(signUpSchema),
    defaultValues: { username: '', email: '', password: '', passwordConfirmation: '' },
  });

  const password = useWatch({ control, name: 'password' });

  const onSubmit = async (form: SignUpForm) => {
    const result = await signUp(form);

    if ('error' in result) {
      const fieldErrors = getFieldErrors(result.error);
      for (const field of SIGN_UP_FIELDS) {
        if (fieldErrors[field]) setError(field, { message: fieldErrors[field] });
      }
      return;
    }

    // Registration succeeded — sign straight in rather than making the user retype everything.
    const signedIn = await signIn({ login: form.username, password: form.password });
    navigate('data' in signedIn ? routes.groups : routes.signIn, { replace: true });
  };

  // API messages arrive already translated; client messages are i18n keys.
  const errorText = (message?: string) => (message ? tv(message, { defaultValue: message }) : undefined);

  return (
    <AuthLayout title={t('signUpTitle')}>
      <AuthForm onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          label={t('username')}
          hint={t('usernameHint')}
          autoComplete="username"
          autoCapitalize="none"
          autoCorrect="off"
          error={errorText(errors.username?.message)}
          {...register('username')}
        />
        <TextField
          label={t('email')}
          type="email"
          inputMode="email"
          autoComplete="email"
          error={errorText(errors.email?.message)}
          {...register('email')}
        />
        <PasswordField
          label={t('password')}
          autoComplete="new-password"
          error={errorText(errors.password?.message)}
          {...register('password')}
        />
        <Rules aria-label={t('passwordRequirements')}>
          {PASSWORD_RULES.map(rule => {
            const met = rule.test(password);
            return (
              <Rule key={rule.key} $met={met}>
                {met ? <Check size={14} aria-hidden /> : <Circle size={14} aria-hidden />}
                {tv(rule.key)}
                <span className="visually-hidden">{met ? t('ruleMet') : t('ruleNotMet')}</span>
              </Rule>
            );
          })}
        </Rules>
        <PasswordField
          label={t('confirmPassword')}
          autoComplete="new-password"
          error={errorText(errors.passwordConfirmation?.message)}
          {...register('passwordConfirmation')}
        />
        <Button type="submit" fullWidth loading={isSigningUp || isSigningIn}>
          {t('createAccount')}
        </Button>
      </AuthForm>
      <AuthFooter>
        {t('haveAccount')} <Link to={routes.signIn}>{t('signIn')}</Link>
      </AuthFooter>
    </AuthLayout>
  );
};

export default SignUpPage;
