import { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Column } from 'components/Containers';
import { Avatar, AvatarSize, Input, TextRegular } from 'components';
import { getDownloadFileUrl } from 'helpers/urlHelper';
import { IUser } from 'types/userTypes';

import { AmountInputWrapper, MembersModalBody } from './index.styled';

export interface IProps {
  user: IUser;
}

interface IForm {
  amount: string;
}

const ChangeUserMoneyModal = ({ user }: IProps) => {
  const { t } = useTranslation('expenses');
  
  const [form, setForm] = useState<IForm>({
    amount: '',
  });

  const onInputTextChanged = useCallback((name: string, value: string) => {
    setForm((form) => ({
      ...form,
      [name]: value,
    }));
  }, [setForm]);

  return (
    <Column>
      <MembersModalBody rounded={true}>
        <Avatar
          src={getDownloadFileUrl(user.avatarId)}
          rounded={true}
          size={AvatarSize.Medium}
        />

        <TextRegular reversedColor>
          {user.name || user.username}
        </TextRegular>

        <AmountInputWrapper>
          <Input
            reversedTheme
            placeholder={t('enterAmount')}
            name={'amount'}
            type={'number'}
            displayName={t('amount')}
            value={form.amount}
            onTextChange={onInputTextChanged}
          />
        </AmountInputWrapper>
      </MembersModalBody>
    </Column>
  );
};

export default memo(ChangeUserMoneyModal);