import * as yup from 'yup';

// Values are i18n keys from the `validation` namespace; mirrors the API's CreateUserValidator.
export const PASSWORD_RULES = [
  { key: 'passwordRuleLength', test: (value: string) => value.length >= 8 && value.length <= 16 },
  { key: 'passwordRuleUppercase', test: (value: string) => /[A-Z]/.test(value) },
  { key: 'passwordRuleLowercase', test: (value: string) => /[a-z]/.test(value) },
  { key: 'passwordRuleNumber', test: (value: string) => /\d/.test(value) },
] as const;

export const signInSchema = yup.object({
  login: yup.string().trim().required('loginRequired'),
  password: yup.string().required('passwordRequired'),
});

export const signUpSchema = yup.object({
  username: yup
    .string()
    .trim()
    .required('usernameRequired')
    .min(5, 'usernameLength')
    .matches(/^[a-zA-Z0-9]*$/, 'usernameCharacters'),
  email: yup.string().trim().required('emailRequired').email('emailInvalid'),
  password: yup
    .string()
    .required('passwordRequired')
    .test('rules', 'passwordRules', value => PASSWORD_RULES.every(rule => rule.test(value ?? ''))),
  passwordConfirmation: yup
    .string()
    .required('confirmPasswordRequired')
    .oneOf([yup.ref('password')], 'passwordsDontMatch'),
});

export type SignInForm = yup.InferType<typeof signInSchema>;
export type SignUpForm = yup.InferType<typeof signUpSchema>;
