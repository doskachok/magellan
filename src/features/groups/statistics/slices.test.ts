import type { MemberStatistics } from '../types';
import { OTHER_KEY, toSlices } from './slices';

const member = (name: string, paid: number): MemberStatistics => ({
  userId: name,
  name,
  isParticipant: true,
  paid,
  share: 0,
});

const paid = (m: MemberStatistics) => m.paid;

describe('toSlices', () => {
  it('sorts by value but keeps each member’s colour from their group position', () => {
    const slices = toSlices([member('alice', 10), member('bob', 30)], paid, 8, 'Other');

    expect(slices.map(s => [s.key, s.colorIndex])).toEqual([
      ['bob', 1],
      ['alice', 0],
    ]);
  });

  it('leaves out members with nothing to show', () => {
    const slices = toSlices([member('alice', 10), member('bob', 0)], paid, 8, 'Other');

    expect(slices.map(s => s.key)).toEqual(['alice']);
  });

  it('folds the smallest slices into Other past the limit', () => {
    const members = [10, 20, 30, 40, 50, 60, 70].map((value, i) => member(`m${i}`, value));

    const slices = toSlices(members, paid, 8, 'Other', 4);

    expect(slices.map(s => s.key)).toEqual(['m6', 'm5', 'm4', OTHER_KEY]);
    expect(slices.at(-1)).toMatchObject({ value: 100, colorIndex: null, label: 'Other' });
  });

  it('folds members past the palette into Other instead of reusing a colour', () => {
    const slices = toSlices([member('alice', 10), member('bob', 5), member('carol', 50)], paid, 2, 'Other');

    expect(slices.map(s => [s.key, s.colorIndex, s.value])).toEqual([
      ['alice', 0, 10],
      ['bob', 1, 5],
      [OTHER_KEY, null, 50],
    ]);
  });
});
