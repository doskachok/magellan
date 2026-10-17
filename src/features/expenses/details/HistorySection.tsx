import { useTranslation } from 'react-i18next';

import { Card, Section } from 'components';
import { formatShortDate } from 'lib/format';
import { ActivityRow } from 'features/activity/ActivityRow';
import { useGetTransactionHistoryQuery } from 'features/activity/api';
import { useCurrentUserId } from 'features/users/api';

const time = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' });

/** Who added and changed this expense; renders nothing until there is history. */
export const HistorySection = ({ transactionId }: { transactionId: string }) => {
  const { t } = useTranslation('expenses');
  const userId = useCurrentUserId();
  const { data: history = [] } = useGetTransactionHistoryQuery(transactionId);

  if (history.length === 0) return null;

  return (
    <Section title={t('history')}>
      <Card>
        {history.map(item => (
          <ActivityRow
            key={item.id}
            item={item}
            currentUserId={userId}
            meta={`${formatShortDate(item.createdAt)} · ${time.format(new Date(item.createdAt))}`}
          />
        ))}
      </Card>
    </Section>
  );
};
