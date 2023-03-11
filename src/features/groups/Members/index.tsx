import { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Column, Row } from 'components/Containers';
import { ContentWrapper, RemoveBtn } from './index.styled';
import { TextRegular, Button } from 'components';
import { useModal } from 'providers/ModalProvider';
import AddMemberModal from './AddMemberModal';
import { IUser } from 'types/userTypes';
import { useAddParticipantMutation, useLazyGetTransactionGroupByIdQuery, useRemoveParticipantMutation } from '../api';
import Loader from 'components/Loader';
import MemberRow from './MemberRow';

export interface IGroupMembersProps {
  groupId: string;
}

const GroupMembers = ({ groupId }: IGroupMembersProps) => {
  const { t } = useTranslation('groups');
  const modalContext = useModal();

  const [getGroup, {data: group, isLoading: isGroupLoading }] = useLazyGetTransactionGroupByIdQuery();
  const [addMember, { isLoading: isMemberAdding }] = useAddParticipantMutation();
  const [removeMember, { isLoading: isMemberRemoving }] = useRemoveParticipantMutation();
  const [selected, setSelected] = useState<IUser | null>(null);

  const handleMemberToAddSelected = useCallback((member: IUser) => {
    addMember({ groupId, userId: member.id }).then(() => {
      getGroup(groupId);
    });
  }, [addMember, groupId, getGroup]);

  const onAddMember = useCallback(() => {
    modalContext.showModal(<AddMemberModal onMemberSelected={handleMemberToAddSelected} />);
  }, [modalContext, handleMemberToAddSelected]);

  const onRemoveMember = useCallback(() => {
    removeMember({ groupId, userId: selected!.id }).then(() => {
      setSelected(null);
      getGroup(groupId);
    });
  }, [groupId, selected, removeMember, getGroup]);

  const handleMemberSelected = useCallback((member: IUser) => {
    setSelected(member);
  }, [setSelected]);

  useEffect(() => {
    getGroup(groupId);
  }, [groupId, getGroup]);

  return (
    <ContentWrapper jc={'space-between'} fullWidth>
      <Column fullWidth>
        {group?.participants?.map((p: IUser) =>
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

      <Loader isLoading={isMemberAdding || isMemberRemoving || isGroupLoading} />

      <Row jc={selected ? 'space-between' : 'flex-end'} fullWidth>
        {
          !!selected && 
          <RemoveBtn disabled={false} onClick={onRemoveMember}>
            {t('removeMember')}
          </RemoveBtn>
        }

        <Button disabled={false} onClick={onAddMember}>
          {t('addMembers')}
        </Button>
        </Row>
    </ContentWrapper>
  );
};

export default memo(GroupMembers);
