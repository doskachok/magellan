import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Archive, ArchiveRestore, LogOut, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import styled from 'styled-components';

import { Button, Card, ConfirmDialog, Muted, Section } from 'components';
import { routes } from 'lib/routes';
import { useCurrentUserId } from 'features/users/api';
import { useDeleteGroupMutation, useGetGroupDebtsQuery, useGetGroupsQuery, useLeaveGroupMutation, useSetArchivedMutation } from '../api';
import { formatBalances, openBalances } from '../memberBalance';
import type { Group } from '../types';
import { LeaveGroupDialog } from './LeaveGroupDialog';

const Actions = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(3)};
`;

const Action = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(1)};
`;

/** Archive, leave and delete. Leaving and deleting wait until the balances they depend on are settled. */
export const GroupActionsSection = ({ group }: { group: Group }) => {
  const { t } = useTranslation('groups');
  const navigate = useNavigate();
  const userId = useCurrentUserId();
  const [isLeaving, setIsLeaving] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const { data: debts = [] } = useGetGroupDebtsQuery(group.id);
  const { data: archived = [] } = useGetGroupsQuery({ archived: true });
  const [setArchived, { isLoading: isArchiving }] = useSetArchivedMutation();
  const [leaveGroup, { isLoading: isLeaveLoading }] = useLeaveGroupMutation();
  const [deleteGroup, { isLoading: isDeleting }] = useDeleteGroupMutation();

  const isOwner = group.ownerId === userId;
  const isArchived = archived.some(item => item.id === group.id);
  const successors = group.participants.filter(member => !member.isPlaceholder && member.id !== userId);
  const myBalances = openBalances(debts, userId);
  const settleHint = (balances: ReturnType<typeof openBalances>) =>
    t('settleFirst', { balances: formatBalances(balances, { owes: t('balanceWordOwe'), owed: t('balanceWordOwed') }) });
  // The last registered member can't hand the group over, so for them leaving means deleting.
  const canLeave = !isOwner || successors.length > 0;

  const handleArchive = async () => {
    const result = await setArchived({ groupId: group.id, archived: !isArchived });
    if ('error' in result) return;
    toast.success(t(isArchived ? 'groupUnarchived' : 'groupArchived'));
    if (!isArchived) navigate(routes.groups);
  };

  const handleLeave = async (newOwnerId?: string) => {
    const result = await leaveGroup({ groupId: group.id, newOwnerId });
    if ('error' in result) return;
    setIsLeaving(false);
    toast.success(t('groupLeft', { name: group.name }));
    navigate(routes.groups, { replace: true });
  };

  const handleDelete = async () => {
    const result = await deleteGroup(group.id);
    if ('error' in result) return;
    setIsConfirmingDelete(false);
    toast.success(t('groupDeleted', { name: group.name }));
    navigate(routes.groups, { replace: true });
  };

  return (
    <Section title={t('groupSection')}>
      <Actions $padded>
        <Action>
          <Button
            variant="secondary"
            fullWidth
            icon={isArchived ? <ArchiveRestore size={18} /> : <Archive size={18} />}
            loading={isArchiving}
            onClick={() => void handleArchive()}
          >
            {isArchived ? t('unarchiveGroup') : t('archiveGroup')}
          </Button>
          <Muted>{t('archiveHint')}</Muted>
        </Action>

        {canLeave && (
          <Action>
            <Button variant="secondary" fullWidth icon={<LogOut size={18} />} disabled={myBalances.length > 0} onClick={() => setIsLeaving(true)}>
              {t('leaveGroup')}
            </Button>
            {myBalances.length > 0 && <Muted>{settleHint(myBalances)}</Muted>}
          </Action>
        )}

        {isOwner && (
          <Action>
            <Button variant="danger" fullWidth icon={<Trash2 size={18} />} disabled={debts.length > 0} onClick={() => setIsConfirmingDelete(true)}>
              {t('deleteGroup')}
            </Button>
            <Muted>{debts.length > 0 ? t('deleteBlocked') : t('deleteHint')}</Muted>
          </Action>
        )}
      </Actions>

      <LeaveGroupDialog
        open={isLeaving}
        isOwner={isOwner}
        successors={successors}
        loading={isLeaveLoading}
        onLeave={newOwnerId => void handleLeave(newOwnerId)}
        onClose={() => setIsLeaving(false)}
      />

      <ConfirmDialog
        open={isConfirmingDelete}
        title={t('deleteGroupTitle')}
        message={t('deleteGroupMessage')}
        confirmLabel={t('deleteGroup')}
        destructive
        loading={isDeleting}
        onConfirm={() => void handleDelete()}
        onClose={() => setIsConfirmingDelete(false)}
      />
    </Section>
  );
};
