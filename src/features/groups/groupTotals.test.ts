import { sumByCurrency } from './groupTotals';
import type { GroupListItem } from './types';

const group = (yourPart: number, currencyCode = 'EUR', isArchived = false): GroupListItem => ({
  id: String(Math.random()),
  name: 'G',
  currencyCode,
  yourPart,
  isArchived,
});

describe('sumByCurrency', () => {
  it('adds up what you owe per currency, archived groups included', () => {
    const groups = [group(-20), group(-30, 'EUR', true), group(-5, 'USD'), group(40)];

    expect(sumByCurrency(groups, amount => amount < 0)).toEqual(['€50.00', '$5.00']);
  });
});
