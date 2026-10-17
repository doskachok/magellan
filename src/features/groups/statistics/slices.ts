import type { MemberStatistics } from '../types';

export interface Slice {
  key: string;
  label: string;
  value: number;
  /** Index into the categorical palette; `null` for the folded "Other" slice. */
  colorIndex: number | null;
  avatarId?: string | null;
}

export const OTHER_KEY = 'other';

/**
 * Turns members into donut slices, largest first. A member keeps the colour of their position in the
 * group, so the same person has the same colour in every chart. Members past the palette, and the
 * smallest slices once there are more than `maxSlices`, fold into one "Other" slice.
 */
export const toSlices = (
  members: MemberStatistics[],
  valueOf: (member: MemberStatistics) => number,
  paletteSize: number,
  otherLabel: string,
  maxSlices = 6,
): Slice[] => {
  const slices = members
    .map((member, index) => ({ member, index, value: valueOf(member) }))
    .filter(({ value }) => value > 0)
    .map(({ member, index, value }) => ({
      key: member.userId,
      label: member.name,
      value,
      colorIndex: index < paletteSize ? index : null,
      avatarId: member.avatarId,
    }))
    .toSorted((a, b) => b.value - a.value);

  const kept = slices.length > maxSlices ? slices.slice(0, maxSlices - 1) : slices;
  const visible = kept.filter(slice => slice.colorIndex !== null);
  const folded = slices.filter(slice => !visible.includes(slice));
  if (folded.length === 0) return visible;

  const other = folded.reduce((sum, slice) => sum + slice.value, 0);
  return [...visible, { key: OTHER_KEY, label: otherLabel, value: other, colorIndex: null }];
};
