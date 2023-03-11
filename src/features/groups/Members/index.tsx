import { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Column, Row } from 'components/Containers';
import { ContentWrapper } from './index.styled';
import { TextRegular, Button } from 'components';
import {ITransactionGroup} from '../types';
import { useModal } from 'providers/ModalProvider';
import AddMemberModal from './AddMemberModal';
import { IUser } from 'types/userTypes';
import { useAddParticipantMutation } from '../api';
import Loader from 'components/Loader';
import MemberRow from './MemberRow';

export interface IGroupMembersProps {
  group: ITransactionGroup | undefined;
}

const GroupMembers = ({ group }: IGroupMembersProps) => {
  const { t } = useTranslation('groups');
  const modalContext = useModal();

  const [addMember, { isLoading: isMemberAdding }] = useAddParticipantMutation();  
  const [selected, setSelected] = useState<IUser | null>(null);

  const handleMemberToAddSelected = useCallback((member: IUser) => {
    addMember({ groupId: group?.id || '', userId: member.id });
  }, [addMember, group]);

  const onAddMember = useCallback(() => {
    modalContext.showModal(<AddMemberModal onMemberSelected={handleMemberToAddSelected} />);
  }, [modalContext, handleMemberToAddSelected]);

  const handleMemberSelected = useCallback((member: IUser) => {
    setSelected(member);
  }, [setSelected]);

  return (
    <ContentWrapper jc={'space-between'} fullWidth>
      <Column fullWidth>
        {group?.participants?.map(p =>
          <MemberRow key={p.id} isSelected={selected === p} member={p} onClick={handleMemberSelected} />
        )}

        {
          group?.participants?.length === 0 ?
            <Row jc={'center'} fullWidth>
              <TextRegular>
                {t('noMembers')}
              </TextRegular>
            </Row>
            : null
        }
      </Column>

      <Loader isLoading={isMemberAdding} />

      <Row jc={'flex-end'} fullWidth>
        <Button disabled={false} onClick={onAddMember}>
          {t('addMembers')}
        </Button>
      </Row>
    </ContentWrapper>
  );
};

export default memo(GroupMembers);
