import * as yup from 'yup';
import YupPassword from 'yup-password';
import {ValidationKeys} from 'constants/validationKeys';

YupPassword(yup);

export const requiredValidator = yup.string().required();
export const usernameValidator = yup.string().required(ValidationKeys.usernameRequired).min(5, ValidationKeys.usernameLength);
export const emailValidator = yup.string().required(ValidationKeys.emailRequired).email(ValidationKeys.email);

export const passwordValidator = yup.string()
  .required(ValidationKeys.passwordRequired)
  .min(8, ValidationKeys.passwordIncorrect)
  .minLowercase(1, ValidationKeys.passwordIncorrect)
  .minUppercase(1, ValidationKeys.passwordIncorrect)
  .minNumbers(1, ValidationKeys.passwordIncorrect);

export const createConfirmPasswordValidator = (password: string) =>
  yup.string().required(ValidationKeys.confirmPasswordRequired).oneOf([password, ''], ValidationKeys.passwordsDontMatch);
