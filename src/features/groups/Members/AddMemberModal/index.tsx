import { Column } from 'components/Containers';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { MembersModalBody, ModalBodyElementWrapper, ModalSeparator, ModalText } from './index.styled';

const AddMemberModal = () => {
  const { t } = useTranslation('groups');
  
  return (
    <Column>
      <MembersModalBody>
        <ModalBodyElementWrapper>
          <ModalText>{t('findNewPeopleHere')}</ModalText>
        </ModalBodyElementWrapper>

        <ModalSeparator />

        <ModalBodyElementWrapper>
          <ModalText>{t('orLookAlreadyKnown')}</ModalText>
        </ModalBodyElementWrapper>
      </MembersModalBody>
    </Column>
  );
};

export default memo(AddMemberModal);