import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { History } from 'lucide-react';
import toast from 'react-hot-toast';
import styled from 'styled-components';

import { Button, Card, CardList, EmptyState, PageSpinner, PlainList, Screen, TopBar } from 'components';
import { dayKey, formatDay } from 'lib/format';
import { routes } from 'lib/routes';
import { useRestoreTransactionMutation } from 'features/expenses/api';
import { useGetGroupQuery } from 'features/groups/api';
import { useCurrentUserId } from 'features/users/api';
import { useGetGroupActivityInfiniteQuery } from './api';
import { ActivityRow } from './ActivityRow';
import type { ActivityItem } from './types';

const DayHeading = styled.h3`
  padding: ${({ theme }) => theme.space(2, 4)};
  background: ${({ theme }) => theme.colors.surfaceMuted};
  font-size: ${({ theme }) => theme.font.size.xs};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const LoadMore = styled.div`
  display: flex;
  justify-content: center;
  padding: ${({ theme }) => theme.space(4, 0)};
`;

const groupByDay = (items: ActivityItem[]) => {
  const days = new Map<string, ActivityItem[]>();
  for (const item of items) {
    const key = dayKey(item.createdAt);
    days.set(key, [...(days.get(key) ?? []), item]);
  }
  return [...days];
};

const GroupActivityPage = () => {
  const { t } = useTranslation('activity');
  const { groupId = '' } = useParams();
  const userId = useCurrentUserId();

  const { data: group } = useGetGroupQuery(groupId);
  const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } = useGetGroupActivityInfiniteQuery(groupId);
  const [restore, { isLoading: isRestoring, originalArgs: restoring }] = useRestoreTransactionMutation();

  const days = useMemo(() => groupByDay(data?.pages.flat() ?? []), [data]);

  const onRestore = async (transactionId: string) => {
    await restore({ id: transactionId, groupId }).unwrap();
    toast.success(t('restored'));
  };

  const renderBody = () => {
    if (isLoading) return <PageSpinner />;
    if (isError) return <EmptyState icon={<History size={28} />} title={t('groupNotFound')} />;
    if (days.length === 0)
      return (
        <Card>
          <EmptyState icon={<History size={28} />} title={t('emptyTitle')} description={t('emptyDescription')} />
        </Card>
      );

    return (
      <>
        <CardList>
          {days.map(([day, items]) => (
            <li key={day}>
              <DayHeading>{formatDay(day)}</DayHeading>
              <PlainList>
                {items.map(item => (
                  <li key={item.id}>
                    <ActivityRow
                      item={item}
                      currentUserId={userId}
                      action={
                        item.canRestore &&
                        item.transactionId && (
                          <Button
                            size="sm"
                            variant="secondary"
                            loading={isRestoring && restoring?.id === item.transactionId}
                            onClick={() => void onRestore(item.transactionId!).catch(() => undefined)}
                          >
                            {t('restore')}
                          </Button>
                        )
                      }
                    />
                  </li>
                ))}
              </PlainList>
            </li>
          ))}
        </CardList>
        {hasNextPage && (
          <LoadMore>
            <Button variant="ghost" loading={isFetchingNextPage} onClick={() => void fetchNextPage()}>
              {t('loadMore')}
            </Button>
          </LoadMore>
        )}
      </>
    );
  };

  return (
    <Screen topBar={<TopBar title={group ? `${t('title')} · ${group.name}` : t('title')} back={routes.group(groupId)} />}>
      {renderBody()}
    </Screen>
  );
};

export default GroupActivityPage;
