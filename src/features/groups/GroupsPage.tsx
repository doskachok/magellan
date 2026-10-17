import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router';
import { Archive, ArchiveRestore, Plus, UsersRound } from 'lucide-react';
import toast from 'react-hot-toast';
import styled from 'styled-components';

import {
  Avatar,
  Balance,
  Button,
  ButtonLink,
  Card,
  CardList,
  EmptyState,
  IconLink,
  ListRow,
  PageSpinner,
  Screen,
  SegmentedControl,
  TopBar,
} from 'components';
import { formatMoney, toneOf } from 'lib/format';
import { getFileUrl } from 'lib/config';
import { routes } from 'lib/routes';
import { useGetGroupsQuery, useSetArchivedMutation } from './api';
import type { GroupListItem } from './types';

type Filter = 'all' | 'owed' | 'owe';

const FILTERS: Record<Filter, (group: GroupListItem) => boolean> = {
  all: () => true,
  owed: group => toneOf(group.yourPart) === 'positive',
  owe: group => toneOf(group.yourPart) === 'negative',
};

const SummaryCard = styled(Card)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.space(4)};
`;

const SummaryLabel = styled.p`
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const SummaryValue = styled.p<{ $tone: 'positive' | 'negative' }>`
  display: flex;
  flex-direction: column;
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  font-variant-numeric: tabular-nums;
  color: ${({ theme, $tone }) => theme.colors[$tone]};
`;

/** Totals per currency — balances in different currencies can't be summed together. */
const sumByCurrency = (groups: GroupListItem[], predicate: (amount: number) => boolean) => {
  const totals = new Map<string, number>();
  for (const group of groups) {
    if (predicate(group.yourPart)) totals.set(group.currencyCode, (totals.get(group.currencyCode) ?? 0) + group.yourPart);
  }
  return [...totals].map(([currency, amount]) => formatMoney(Math.abs(amount), currency));
};

const renderTotals = (totals: string[]) =>
  totals.length > 0 ? totals.map(total => <span key={total}>{total}</span>) : <span aria-label="none">—</span>;

const ArchivedLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space(2)};
  min-height: ${({ theme }) => theme.layout.touchTarget};
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
`;

const GroupLink = styled(Link)`
  color: inherit;
  text-decoration: none;
`;

const ArchivedGroups = () => {
  const { t } = useTranslation('groups');
  const { data: groups = [], isLoading } = useGetGroupsQuery({ archived: true });
  const [setArchived, { isLoading: isRestoring, originalArgs }] = useSetArchivedMutation();
  const sorted = useMemo(() => groups.toSorted((a, b) => a.name.localeCompare(b.name)), [groups]);

  const unarchive = async (group: GroupListItem) => {
    const result = await setArchived({ groupId: group.id, archived: false });
    if (!('error' in result)) toast.success(t('groupUnarchived'));
  };

  const renderBody = () => {
    if (isLoading) return <PageSpinner />;
    if (sorted.length === 0) return <EmptyState icon={<Archive size={28} />} title={t('noArchivedGroups')} />;

    return (
      <CardList>
        {sorted.map(group => (
          <li key={group.id}>
            <ListRow
              leading={<Avatar name={group.name} src={getFileUrl(group.avatarId)} />}
              title={<GroupLink to={routes.group(group.id)}>{group.name}</GroupLink>}
              subtitle={<Balance amount={group.yourPart} currencyCode={group.currencyCode} align="left" />}
              trailing={
                <Button
                  size="sm"
                  variant="secondary"
                  icon={<ArchiveRestore size={16} />}
                  loading={isRestoring && originalArgs?.groupId === group.id}
                  onClick={() => void unarchive(group)}
                >
                  {t('unarchiveGroup')}
                </Button>
              }
            />
          </li>
        ))}
      </CardList>
    );
  };

  return (
    <Screen withNav topBar={<TopBar title={t('archivedGroups')} back={routes.groups} />}>
      {renderBody()}
    </Screen>
  );
};

const ActiveGroups = () => {
  const { t } = useTranslation('groups');
  const { data: groups = [], isLoading } = useGetGroupsQuery({ archived: false });
  const { data: archived = [] } = useGetGroupsQuery({ archived: true });
  const [filter, setFilter] = useState<Filter>('all');

  const visibleGroups = useMemo(
    () => groups.filter(FILTERS[filter]).toSorted((a, b) => a.name.localeCompare(b.name)),
    [groups, filter],
  );

  const owedToYou = useMemo(() => sumByCurrency(groups, amount => toneOf(amount) === 'positive'), [groups]);
  const youOwe = useMemo(() => sumByCurrency(groups, amount => toneOf(amount) === 'negative'), [groups]);

  const renderBody = () => {
    if (isLoading) return <PageSpinner />;

    const archivedLink = archived.length > 0 && (
      <ArchivedLink to={routes.archivedGroups}>
        <Archive size={18} aria-hidden />
        {t('archivedCount', { count: archived.length })}
      </ArchivedLink>
    );

    if (groups.length === 0) {
      return (
        <>
          <EmptyState
            icon={<UsersRound size={28} />}
            title={t('emptyTitle')}
            description={t('emptyDescription')}
            action={
              <ButtonLink to={routes.newGroup} icon={<Plus size={20} />}>
                {t('createGroup')}
              </ButtonLink>
            }
          />
          {archivedLink}
        </>
      );
    }

    return (
      <>
        <SummaryCard $padded aria-label={t('summary')}>
          <div>
            <SummaryLabel>{t('owedToYou')}</SummaryLabel>
            <SummaryValue $tone="positive">{renderTotals(owedToYou)}</SummaryValue>
          </div>
          <div>
            <SummaryLabel>{t('youOwe')}</SummaryLabel>
            <SummaryValue $tone="negative">{renderTotals(youOwe)}</SummaryValue>
          </div>
        </SummaryCard>

        <SegmentedControl
          label={t('filterGroups')}
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: t('filterAll') },
            { value: 'owed', label: t('filterOwed') },
            { value: 'owe', label: t('filterOwe') },
          ]}
        />

        {visibleGroups.length > 0 ? (
          <CardList>
            {visibleGroups.map(group => (
              <li key={group.id}>
                <ListRow
                  to={routes.group(group.id)}
                  leading={<Avatar name={group.name} src={getFileUrl(group.avatarId)} />}
                  title={group.name}
                  subtitle={group.currencyCode}
                  trailing={<Balance amount={group.yourPart} currencyCode={group.currencyCode} />}
                />
              </li>
            ))}
          </CardList>
        ) : (
          <EmptyState icon={<UsersRound size={28} />} title={t('noMatchingGroups')} />
        )}
        {archivedLink}
      </>
    );
  };

  return (
    <Screen
      withNav
      topBar={
        <TopBar
          title={t('groups')}
          actions={<IconLink tone="onBrand" to={routes.newGroup} label={t('createGroup')} icon={<Plus size={24} />} />}
        />
      }
    >
      {renderBody()}
    </Screen>
  );
};

const GroupsPage = () => {
  const [searchParams] = useSearchParams();
  return searchParams.get('archived') ? <ArchivedGroups /> : <ActiveGroups />;
};

export default GroupsPage;
