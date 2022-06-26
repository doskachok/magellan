import * as yup from 'yup';
import YupPassword from 'yup-password';
YupPassword(yup);

export const validationSchema = yup.object().shape({
  username: yup.string().required().min(5),
  email: yup.string().email().required(),
  password: yup.string().min(8).minLowercase(1).minUppercase(1).minSymbols(1).minNumbers(1).required(),
  passwordConfirmation: yup.string().oneOf([yup.ref('password'), ''], 'passwords_not_match').required()
});
