import { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../components/Button';
import { Column, Row } from '../../../components/Containers';
import { TextRegular } from '../../../components/Text';
import { ContentWrapper, RemoveBtn, Wrapper } from './index.styled';
import { useAddParticipantMutation, useGetTransactionGroupByIdQuery, useRemoveParticipantMutation } from '../api';
import { useModal } from '../../../providers/ModalProvider';
import AddMemberModal from './AddMemberModal';
import { IUser } from '../../../types/user-types';
import Loader from '../../../components/Loader';
import MemberRow from './MemberRow';

export interface IGroupMembersProps {
  groupId: string,
  onMemberAdded: (member: IUser) => void;
  onMemberRemoved: (member: IUser) => void;
}

const GroupMembers = ({ groupId, onMemberAdded, onMemberRemoved }: IGroupMembersProps) => {
  const { t } = useTranslation('groups');

  const { data } = useGetTransactionGroupByIdQuery(groupId);
  const [addMember, { isLoading: isMemberAdding }] = useAddParticipantMutation();
  const [removeMember, { isLoading: isMemberRemoving }] = useRemoveParticipantMutation();
  const [addMemberModalId, setAddMemberModalId] = useState<number | null>(null);

  const [selected, setSelected] = useState<IUser | null>(null);

  const handleMemberToAddSelected = useCallback((member: IUser) => {
    addMember({ groupId: groupId, userId: member.id }).then(() => onMemberAdded(member));
  }, [addMember, groupId, onMemberAdded]);

  const handleMemberSelected = useCallback((member: IUser) => {
    setSelected(member);
  }, [setSelected]);

  const modalContext = useModal();

  const onAddMember = useCallback(() => {
    const modalId = modalContext.showModal(<AddMemberModal onMemberSelected={handleMemberToAddSelected} />);
    setAddMemberModalId(modalId);
  }, [modalContext, handleMemberToAddSelected, setAddMemberModalId]);

  const onRemoveMember = useCallback(() => {
    removeMember({ groupId, userId: selected!.id }).then(() => {
      onMemberRemoved(selected!);
      setSelected(null);
    });
  }, [groupId, selected, removeMember, onMemberRemoved]);

  useEffect(() => {
    return () => {
      if (addMemberModalId) {
        modalContext.closeModal(addMemberModalId);
        setAddMemberModalId(null);
      }
    };
  }, [addMemberModalId, modalContext]);

  return (
    <Wrapper jc={'space-between'} fullWidth>
      <Column fullWidth>
        {data?.participants?.map(p =>
          <MemberRow key={p.id} isSelected={selected === p} member={p} onClick={handleMemberSelected} />
        )}

        <ContentWrapper>
          {
            data?.participants?.length === 0 ?
              <Row jc={'center'} fullWidth>
                <TextRegular>
                  {t('noMembers')}
                </TextRegular>
              </Row>
              : null
          }
        </ContentWrapper>
      </Column>

      <ContentWrapper>
        <Loader isLoading={isMemberRemoving || isMemberAdding} />

        <Row jc={selected ? 'space-between' : 'flex-end'} fullWidth>
          {
            !!selected && <RemoveBtn disabled={false} onClick={onRemoveMember}>
              {t('removeMember')}
            </RemoveBtn>
          }

          <Button disabled={false} onClick={onAddMember}>
            {t('addMembers')}
          </Button>
        </Row>
      </ContentWrapper>
    </Wrapper>
  );
};

export default memo(GroupMembers);
