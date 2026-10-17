import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Avatar, Muted } from 'components';
import { getFileUrl } from 'lib/config';
import { getDisplayName } from 'features/users/types';
import { describeActivity } from './describeActivity';
import type { ActivityItem } from './types';

const Row = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.space(3)};
  padding: ${({ theme }) => theme.space(3, 4)};

  & + & {
    border-top: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const Body = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(1)};
  min-width: 0;
  overflow-wrap: anywhere;
`;

const Changes = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const time = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' });

interface ActivityRowProps {
  item: ActivityItem;
  currentUserId: string;
  /** Shown under the text, e.g. the date in an expense's history. */
  meta?: ReactNode;
  /** Shown on the right, e.g. a Restore button. */
  action?: ReactNode;
}

export const ActivityRow = ({ item, currentUserId, meta, action }: ActivityRowProps) => {
  const { t } = useTranslation('activity');
  const { text, changes } = describeActivity(item, currentUserId, t);

  return (
    <Row>
      <Avatar name={getDisplayName(item.actor)} src={getFileUrl(item.actor.avatarId)} size={32} />
      <Body>
        <span>{text}</span>
        {changes.length > 0 && (
          <Changes>
            {changes.map(change => (
              <li key={change}>{change}</li>
            ))}
          </Changes>
        )}
        <Muted>{meta ?? time.format(new Date(item.createdAt))}</Muted>
      </Body>
      {action}
    </Row>
  );
};
