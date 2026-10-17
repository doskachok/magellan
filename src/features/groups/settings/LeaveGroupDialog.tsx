import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Button, Dialog, SelectField } from 'components';
import { getDisplayName, type User } from 'features/users/types';

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(4)};
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.space(2)};
`;

interface LeaveGroupDialogProps {
  open: boolean;
  /** Registered members who can own the group next; empty for a plain member. */
  successors: User[];
  isOwner: boolean;
  loading: boolean;
  onLeave: (newOwnerId?: string) => void;
  onClose: () => void;
}

export const LeaveGroupDialog = ({ open, successors, isOwner, loading, onLeave, onClose }: LeaveGroupDialogProps) => {
  const { t } = useTranslation('groups');
  const [newOwnerId, setNewOwnerId] = useState('');

  return (
    <Dialog open={open} title={t('leaveGroupTitle')} onClose={onClose}>
      <Body>
        <p>{t('leaveGroupMessage')}</p>
        {isOwner && (
          <SelectField
            label={t('chooseNewOwner')}
            placeholder={t('selectNewOwner')}
            value={newOwnerId}
            options={successors.map(user => ({ value: user.id, label: getDisplayName(user) }))}
            onChange={event => setNewOwnerId(event.target.value)}
          />
        )}
        <Actions>
          <Button variant="ghost" onClick={onClose}>
            {t('cancel', { ns: 'common' })}
          </Button>
          <Button variant="danger" loading={loading} disabled={isOwner && !newOwnerId} onClick={() => onLeave(newOwnerId || undefined)}>
            {t('leaveGroup')}
          </Button>
        </Actions>
      </Body>
    </Dialog>
  );
};
