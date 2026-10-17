import i18next, { type TFunction } from 'i18next';
import activity from '../../../public/locales/en/activity.json';
import { describeActivity } from './describeActivity';
import { ActivityType, type ActivityItem } from './types';

const me = { id: 'me', name: 'Alice', username: 'alice', email: 'a@x' };
const bob = { id: 'bob', name: 'Bob', username: 'bob', email: 'b@x' };

let t: TFunction<'activity'>;

beforeAll(async () => {
  const instance = i18next.createInstance();
  await instance.init({
    lng: 'en',
    resources: { en: { activity } },
    keySeparator: false,
    interpolation: { escapeValue: false },
  });
  t = instance.getFixedT('en', 'activity');
});

const item = (type: ActivityType, overrides: Partial<ActivityItem> = {}): ActivityItem => ({
  id: '1',
  actor: bob,
  type,
  createdAt: '2026-10-17T10:00:00Z',
  canRestore: false,
  ...overrides,
});

const text = (type: ActivityType, overrides: Partial<ActivityItem> = {}) => describeActivity(item(type, overrides), me.id, t).text;

describe('describeActivity', () => {
  it('calls the current user "You"', () => {
    expect(text(ActivityType.MemberLeft, { actor: me })).toBe('You left the group');
  });

  it.each([
    [ActivityType.GroupCreated, {}, 'Bob created the group'],
    [ActivityType.GroupEdited, {}, 'Bob edited the group'],
    [ActivityType.MemberAdded, { subjectUser: me }, 'Bob added you'],
    [ActivityType.MemberRemoved, { details: { name: 'Eve' } }, 'Bob removed Eve'],
    [ActivityType.MemberLeft, {}, 'Bob left the group'],
    [ActivityType.PlaceholderAdded, { subjectUser: { ...me, id: 'eve', name: 'Eve' } }, 'Bob added Eve (not signed up)'],
    [ActivityType.PlaceholderReplaced, { subjectUser: me, details: { name: 'Eve' } }, 'Bob replaced Eve with you'],
    [ActivityType.OwnershipTransferred, { subjectUser: me }, 'Bob made you the owner'],
    [ActivityType.ExpenseAdded, { details: { name: 'Taxi', amount: '20.00', currency: 'EUR' } }, 'Bob added “Taxi” (€20.00)'],
    [ActivityType.ExpenseEdited, { details: { name: 'Taxi' } }, 'Bob edited “Taxi”'],
    [ActivityType.ExpenseDeleted, { details: { name: 'Taxi', amount: '20.00', currency: 'EUR' } }, 'Bob deleted “Taxi” (€20.00)'],
    [ActivityType.ExpenseRestored, { details: { name: 'Taxi', amount: '20.00', currency: 'EUR' } }, 'Bob restored “Taxi” (€20.00)'],
    [ActivityType.RepaymentAdded, { subjectUser: me, details: { amount: '12.40', currency: 'EUR' } }, 'Bob recorded a €12.40 repayment to you'],
    [ActivityType.RepaymentEdited, {}, 'Bob edited a repayment'],
    [ActivityType.RepaymentDeleted, { details: { amount: '12.40', currency: 'EUR' } }, 'Bob deleted a €12.40 repayment'],
    [ActivityType.RepaymentRestored, { details: { amount: '12.40', currency: 'EUR' } }, 'Bob restored a €12.40 repayment'],
    [ActivityType.ReceiptAdded, { details: { name: 'bill.pdf' } }, 'Bob attached bill.pdf'],
    [ActivityType.ReceiptRemoved, { details: { name: 'bill.pdf' } }, 'Bob removed bill.pdf'],
  ] as const)('describes type %s', (type, overrides, expected) => {
    expect(text(type, overrides as Partial<ActivityItem>)).toBe(expected);
  });

  it('falls back to "someone" when the subject is gone', () => {
    expect(text(ActivityType.MemberAdded)).toBe('Bob added someone');
  });

  it('formats amount changes as money in the expense currency', () => {
    const { changes } = describeActivity(
      item(ActivityType.ExpenseEdited, { details: { name: 'Taxi', currency: 'EUR', changes: [{ field: 'amount', from: '20.00', to: '25.00' }] } }),
      me.id,
      t,
    );
    expect(changes).toEqual(['Amount: €20.00 → €25.00']);
  });

  it('shows an empty side as a dash', () => {
    const { changes } = describeActivity(
      item(ActivityType.ExpenseEdited, { details: { name: 'Taxi', changes: [{ field: 'note', to: 'Late' }] } }),
      me.id,
      t,
    );
    expect(changes).toEqual(['Note: — → Late']);
  });

  it('formats dates as the same calendar day in any timezone', () => {
    const { changes } = describeActivity(
      item(ActivityType.ExpenseEdited, { details: { changes: [{ field: 'date', from: '2026-10-12', to: '2026-10-13' }] } }),
      me.id,
      t,
    );
    expect(changes).toEqual(['Date: 12 Oct 2026 → 13 Oct 2026']);
  });

  it('says a photo changed without values', () => {
    const { changes } = describeActivity(item(ActivityType.GroupEdited, { details: { changes: [{ field: 'avatar' }] } }), me.id, t);
    expect(changes).toEqual(['Photo changed']);
  });
});
