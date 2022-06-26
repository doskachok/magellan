import {useState, useMemo} from 'react';

import Header from '../../../components/Header';
import Input from '../../../components/Input';
import Button from '../../../components/Button';

import {Column, PageWrapper, Row} from '../../../components/Containers';
import {ContentWrapper} from './index.styled';

import {useRegisterMutation} from '../api';

interface iForm {
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

const Register = () => {
  const [form, setForm] = useState<iForm>({
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  });

  const [register] = useRegisterMutation();

  const isDisabled = useMemo(() => Object.values(form).some(el => !el), [form]);

  const onInputChange = (name: string, value: string) => {
    setForm(form => ({
      ...form,
      [name]: value,
    }));
  };

  const onFromSubmit = () => {
    register(form);
  };

  return (
    <PageWrapper>
      <Header text={'Sign up'} />
      <ContentWrapper jc={'space-between'} fullWidth>
        <Column gap={'32px'} fullWidth>
          <Input
            value={form.username}
            placeholder={'Username'}
            onChange={(value) => onInputChange('username', value)}
          />

          <Input
            value={form.email}
            placeholder={'Email address'}
            onChange={(value) => onInputChange('email', value)}
          />

          <Input
            value={form.password}
            placeholder={'Password'}
            onChange={(value) => onInputChange('password', value)}
          />

          <Input
            value={form.passwordConfirmation}
            placeholder={'Confirm password'}
            onChange={(value) => onInputChange('passwordConfirmation', value)}
          />
        </Column>

        <Row jc={'flex-end'} fullWidth>
          <Button onClick={onFromSubmit} disabled={isDisabled}>
            Create account
          </Button>
        </Row>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default Register;
