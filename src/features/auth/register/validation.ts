import * as yup from 'yup';
import YupPassword from 'yup-password';
import {ValidationKeys} from '../../../constants/validationKeys';

YupPassword(yup);

export const usernameValidator = yup.string().required(ValidationKeys.usernameRequired).min(5, ValidationKeys.usernameLength);
export const emailValidator = yup.string().required(ValidationKeys.emailRequired).email(ValidationKeys.email);

export const passwordsValidationSchema = yup.object().shape({
  password: yup.string().min(8).minLowercase(1).minUppercase(1).minSymbols(1).minNumbers(1).required(),
  passwordConfirmation: yup.string().oneOf([yup.ref('password'), ''], 'passwords_not_match').required()
});
