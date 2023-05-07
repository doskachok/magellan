import { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

import { Column, Row } from 'components/Containers';
import { ContentWrapperMembers, Header } from './index.styled';
import { TextRegular, TextSmall, Button } from 'components';
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
  const [addMemberModalId, setAddMemberModalId] = useState<number | null>(null);

  const [selected, setSelected] = useState<IUser | null>(null);

  const handleMemberToAddSelected = useCallback((member: IUser) => {
    addMember({ groupId, userId: member.id }).then(() => {
      getGroup(groupId);
      toast.success(t('memberAdded'));
    });
  }, [addMember, groupId, getGroup, t]);

  const onAddMember = useCallback(() => {
    const modalId = modalContext.showModal(<AddMemberModal onMemberSelected={handleMemberToAddSelected} />);
    setAddMemberModalId(modalId);
  }, [modalContext, handleMemberToAddSelected, setAddMemberModalId]);

  const onRemoveMember = useCallback(() => {
    removeMember({ groupId, userId: selected!.id }).then(() => {
      setSelected(null);
      getGroup(groupId);
      toast.success(t('memberRemoved'));
    });
  }, [groupId, selected, removeMember, getGroup, t]);

  const handleMemberSelected = useCallback((member: IUser) => {
    member !== selected ? setSelected(member) : setSelected(null);
  }, [selected, setSelected]);

  useEffect(() => {
    getGroup(groupId);
  }, [groupId, getGroup]);

  useEffect(() => {
    return () => {
      if (addMemberModalId) {
        modalContext.closeModal(addMemberModalId);
        setAddMemberModalId(null);
      }
    };
  }, [addMemberModalId, modalContext]);

  return (
    <ContentWrapperMembers jc={'space-between'} fullWidth>
      <Column fullWidth>
        <Header fullWidth>
            <TextSmall>
              {t('groupMember')}
            </TextSmall>
            <TextSmall>
              {t('balance')}
            </TextSmall>
        </Header>

        <Column fullWidth>
          {group?.participants?.map((p: IUser) =>
            <MemberRow 
              key={p.id}
              isSelected={selected === p}
              member={p}
              onClick={handleMemberSelected}
              onRemove={onRemoveMember}
            />
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
      </Column>      

      <Loader isLoading={isMemberAdding || isMemberRemoving || isGroupLoading} />

      <Row jc='flex-end' fullWidth>
        <Button disabled={false} onClick={onAddMember}>
          {t('addMembers')}
        </Button>
      </Row>
    </ContentWrapperMembers>
  );
};

export default memo(GroupMembers);
