import { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Column } from 'components/Containers';
import { Avatar, AvatarSize, Input, TextRegular } from 'components';
import { getDownloadFileUrl } from 'helpers/urlHelper';
import { IUser } from 'types/userTypes';

import { AmountInputWrapper, ButtonDone, MembersModalBody } from './index.styled';
import { IModalForm } from 'providers/ModalProvider/Modal';

const validInput = new RegExp(
  '^\\d+(\\.\\d{1,2})?\\.?$'
);

export interface IProps extends IModalForm {
  user: IUser;
  onDone: (user: IUser, amount: number) => void;
  amount: number;
}

const ChangeUserMoneyModal = ({ user, onDone, close, amount }: IProps) => {
  const { t } = useTranslation('expenses');
  
  const [formAmount, setFormAmount] = useState(amount > 0 ? amount.toString() : '')

  const onInputTextChanged = useCallback((name: string, value: string) => {
    value = value.replace(',', '.');
    if (!validInput.test(value) && value !== '') return;

    setFormAmount(value);
  }, [setFormAmount]);

  const onDoneClicked = () => {
    onDone(user, +formAmount);
    close && close();
  };

  return (
    <Column>
      <MembersModalBody rounded={true}>
        <Avatar
          src={getDownloadFileUrl(user.avatarId)}
          rounded
          framed
          size={AvatarSize.Medium}
        />

        <TextRegular reversedColor>
          {user.name || user.username}
        </TextRegular>

        <AmountInputWrapper>
          <Input
            autoFocus 
            name="amount"
            type="text"
            inputMode="decimal"
            reversedTheme
            placeholder={t('enterAmount')}
            displayName={t('amount')}
            value={formAmount}
            onTextChange={onInputTextChanged}
          />
        </AmountInputWrapper>

        <ButtonDone onClick={onDoneClicked}>
          {t('done')}
        </ButtonDone>
      </MembersModalBody>
    </Column>
  );
};

export default memo(ChangeUserMoneyModal);