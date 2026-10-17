import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Ellipsis, UserCheck, UserMinus } from 'lucide-react';
import toast from 'react-hot-toast';
import styled from 'styled-components';

import { Button, ConfirmDialog, Dialog, IconButton, Muted } from 'components';
import { getDisplayName, type User } from 'features/users/types';
import { useRemoveParticipantMutation } from '../api';

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(2)};
`;

interface MemberMenuProps {
  groupId: string;
  member: User;
  canRemove: boolean;
  /** Why removing is blocked, e.g. `Settle up first: owes €12.40`; removing is disabled while set. */
  removeBlockedReason?: string;
  onReplace: () => void;
}

/** The ⋯ next to a member: an action sheet with what you may do to them, and why anything is blocked. */
export const MemberMenu = ({ groupId, member, canRemove, removeBlockedReason, onReplace }: MemberMenuProps) => {
  const { t } = useTranslation('groups');
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [removeParticipant, { isLoading: isRemoving }] = useRemoveParticipantMutation();
  const name = getDisplayName(member);

  const handleRemove = async () => {
    const result = await removeParticipant({ groupId, userId: member.id });
    setIsConfirming(false);
    if ('data' in result) toast.success(t('memberRemoved', { name }));
  };

  if (!canRemove && !member.isPlaceholder) return null;

  return (
    <>
      <IconButton label={t('memberActions', { name })} icon={<Ellipsis size={20} />} onClick={() => setIsOpen(true)} />

      <Dialog open={isOpen} title={name} onClose={() => setIsOpen(false)}>
        <Actions>
          {member.isPlaceholder && (
            <Button
              variant="secondary"
              fullWidth
              icon={<UserCheck size={18} />}
              onClick={() => {
                setIsOpen(false);
                onReplace();
              }}
            >
              {t('replaceWithUser')}
            </Button>
          )}
          {canRemove && (
            <>
              <Button
                variant="danger"
                fullWidth
                icon={<UserMinus size={18} />}
                disabled={Boolean(removeBlockedReason)}
                onClick={() => {
                  setIsOpen(false);
                  setIsConfirming(true);
                }}
              >
                {t('remove')}
              </Button>
              {removeBlockedReason && <Muted>{removeBlockedReason}</Muted>}
            </>
          )}
        </Actions>
      </Dialog>

      <ConfirmDialog
        open={isConfirming}
        title={t('removeMemberTitle')}
        message={t('removeMemberMessage', { name })}
        confirmLabel={t('remove')}
        destructive
        loading={isRemoving}
        onConfirm={() => void handleRemove()}
        onClose={() => setIsConfirming(false)}
      />
    </>
  );
};
