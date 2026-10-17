import type { TFunction } from 'i18next';
import { getDisplayName, type User } from 'features/users/types';
import { formatMoney, formatShortDate } from 'lib/format';
import type { ActivityItem, FieldChange } from './types';

export interface ActivityText {
  /** One sentence, e.g. `Bob edited “Taxi”`. */
  text: string;
  /** One line per changed field, e.g. `Amount: €20.00 → €25.00`. */
  changes: string[];
}

const formatAmount = (value: string, currency?: string | null) => (currency ? formatMoney(Number(value), currency) : value);

// Dates arrive as `yyyy-mm-dd`; read them as local noon so no timezone shifts the day.
const formatDate = (value: string) => formatShortDate(new Date(`${value}T12:00:00`));

const formatValue = (change: FieldChange, value: string, currency: string | null | undefined, t: TFunction<'activity'>) => {
  switch (change.field) {
    case 'amount':
      return formatAmount(value, currency);
    case 'date':
      return formatDate(value);
    case 'split':
      // The API sends the method's code first, e.g. `Equal: Alice 10.00, Bob 10.00`.
      return value.replace(/^(\w+):/, (_match, method: string) => `${t(`method_${method}`)}:`);
    default:
      return value;
  }
};

/** Turns an activity entry into display text; dates and amounts are formatted for the reader. */
export const describeActivity = (item: ActivityItem, currentUserId: string, t: TFunction<'activity'>): ActivityText => {
  const details = item.details ?? {};
  const actor = item.actor.id === currentUserId ? t('you') : getDisplayName(item.actor);
  const subjectOf = (user?: User | null) => {
    if (!user) return details.name ?? t('someone');
    return user.id === currentUserId ? t('youObject') : getDisplayName(user);
  };

  const text = t(`type_${item.type}`, {
    actor,
    subject: subjectOf(item.subjectUser),
    name: details.name ?? '',
    amount: details.amount ? formatAmount(details.amount, details.currency) : '',
  });

  const changes = (details.changes ?? []).map(change => {
    if (change.field === 'avatar') return t('photoChanged');
    return t('change', {
      field: t(`field_${change.field}`),
      from: change.from ? formatValue(change, change.from, details.currency, t) : t('empty'),
      to: change.to ? formatValue(change, change.to, details.currency, t) : t('empty'),
    });
  });

  return { text, changes };
};
