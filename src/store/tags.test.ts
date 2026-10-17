import { ApiTag } from 'store/api';
import { deletedExpenseTags, expenseTags } from 'features/expenses/api';
import { goneGroupTags } from 'features/groups/api';

// A refetch of something that was just deleted or left answers 404, and every failed query is toasted,
// so those mutations must not invalidate the detail queries of the thing that is gone.
describe('invalidation after something is gone', () => {
  it('keeps the deleted expense itself out of the refetch', () => {
    const tags = deletedExpenseTags('g1', 'e1');

    expect(tags).not.toContainEqual({ type: ApiTag.Transaction, id: 'e1' });
    expect(tags).toContainEqual({ type: ApiTag.Debts, id: 'g1' });
    expect(tags).toContainEqual({ type: ApiTag.Activity, id: 'g1' });
  });

  it('still refetches the expense after an edit', () => {
    expect(expenseTags('g1', 'e1')).toContainEqual({ type: ApiTag.Transaction, id: 'e1' });
  });

  it('refreshes only the group list after leaving or deleting a group', () => {
    expect(goneGroupTags()).toEqual([ApiTag.Groups]);
  });
});
