import { Column } from 'components/Containers';
import Loader from 'components/Loader';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetKnownsUsersQuery } from 'store/user.api';
import { MembersModalBody, ModalBodyElementWrapper, ModalSeparator, ModalText } from './index.styled';
import UserRow from './UserRow';

const AddMemberModal = () => {
  const { t } = useTranslation('groups');

  const { data: knownsUsers, isLoading: isKnownsUsersLoading } = useGetKnownsUsersQuery();
  
  return (
    <Column>
      <MembersModalBody>
        <ModalBodyElementWrapper>
          <ModalText>{t('findNewPeopleHere')}</ModalText>
        </ModalBodyElementWrapper>

        <ModalSeparator />

        <ModalBodyElementWrapper>
          <ModalText>{t('orLookAlreadyKnown')}</ModalText>

          <Column fullWidth gap={'0.5rem'}>
            {knownsUsers?.map(u => <UserRow key={u.id} user={u} onClick={() => {}} />)}
          </Column>
          
          <Loader isLoading={isKnownsUsersLoading} />
          {!!knownsUsers && knownsUsers.length === 0 && <ModalText>{t('noAlreadyKnownUsers')}</ModalText>}
        </ModalBodyElementWrapper>
      </MembersModalBody>
    </Column>
  );
};

export default memo(AddMemberModal);