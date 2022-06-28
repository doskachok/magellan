import * as yup from 'yup';
import YupPassword from 'yup-password';
YupPassword(yup);

export const usernameValidator = yup.string().min(5).required();
export const emailValidator = yup.string().email().required();

export const passwordsValidationSchema = yup.object().shape({
  password: yup.string().min(8).minLowercase(1).minUppercase(1).minSymbols(1).minNumbers(1).required(),
  passwordConfirmation: yup.string().oneOf([yup.ref('password'), ''], 'passwords_not_match').required()
});
