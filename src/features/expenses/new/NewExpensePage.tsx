import { useMemo, useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router';
import { Plus, UsersRound } from 'lucide-react';
import toast from 'react-hot-toast';

import { Button, ButtonLink, EmptyState, PageSpinner, Screen, TopBar } from 'components';
import { CURRENCIES } from 'lib/config';
import { parseAmount, roundMoney } from 'lib/format';
import { routes } from 'lib/routes';
import { useDebouncedValue } from 'lib/useDebouncedValue';
import { withViewTransition } from 'lib/viewTransitions';
import { useGetGroupQuery, useGetGroupsQuery } from 'features/groups/api';
import { useCurrentUserId } from 'features/users/api';
import {
  useCreateTransactionMutation,
  useDeleteReceiptMutation,
  useGetTransactionQuery,
  usePreviewSplitQuery,
  useUpdateTransactionMutation,
  useUploadReceiptMutation,
} from '../api';
import { buildAssignments, buildPayerDetails, sumInputs } from '../split';
import type { Transaction } from '../types';
import { createDraft, draftFromExpense, draftReducer, type ExpenseDraft } from './draft';
import { Stepper } from './parts';
import { FooterActions } from './parts.styles';
import { DetailsStep, PaidByStep, SplitStep } from './steps';

interface ExpenseFormProps {
  initialDraft: ExpenseDraft;
  /** Set when editing an existing expense. */
  existing?: Transaction;
}

const ExpenseForm = ({ initialDraft, existing }: ExpenseFormProps) => {
  const { t } = useTranslation('expenses');
  const navigate = useNavigate();
  const userId = useCurrentUserId();

  const [draft, dispatch] = useReducer(draftReducer, initialDraft);
  const [showErrors, setShowErrors] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  const { data: groups = [], isLoading: isGroupsLoading } = useGetGroupsQuery({ archived: false });
  const { data: group, isFetching: isGroupFetching } = useGetGroupQuery(draft.groupId, { skip: !draft.groupId });
  const [createTransaction, { isLoading: isCreating }] = useCreateTransactionMutation();
  const [updateTransaction, { isLoading: isUpdating }] = useUpdateTransactionMutation();
  const [uploadReceipt] = useUploadReceiptMutation();
  const [deleteReceipt] = useDeleteReceiptMutation();

  const members = useMemo(() => group?.participants ?? [], [group]);
  const memberIds = useMemo(() => members.map(member => member.id), [members]);

  // Unset choices fall back to sensible defaults instead of being synced into state by effects.
  const groupCurrency = groups.find(item => item.id === draft.groupId)?.currencyCode ?? group?.currencyCode;
  const currencyCode = draft.currencyCode || groupCurrency || CURRENCIES[0];
  const payerId = draft.payerId || (memberIds.includes(userId) ? userId : (memberIds[0] ?? ''));

  const total = draft.payerMode === 'single' ? roundMoney(parseAmount(draft.amount)) : sumInputs(draft.payerAmounts);

  // What saving would send. The split step shows the API's preview of it: shares and whether it adds up
  // are computed only there, with the same code that validates and stores the expense.
  const split = useMemo(
    () => ({
      payerDetails: buildPayerDetails(draft.payerMode === 'single' ? { [payerId]: draft.amount } : draft.payerAmounts),
      partialsAssignments: buildAssignments(draft.split, memberIds),
    }),
    [draft.payerMode, draft.amount, draft.payerAmounts, draft.split, payerId, memberIds],
  );
  const previewedSplit = useDebouncedValue(split, 250);
  // `data` keeps showing the previous preview while the next one loads, so numbers don't flicker.
  const { data: preview, isFetching: isPreviewing } = usePreviewSplitQuery(previewedSplit, { skip: draft.step !== 2 });
  // Until the preview catches up with the latest input, it can't vouch for it.
  const previewIsCurrent = previewedSplit === split && !isPreviewing;

  const stepIsValid = [
    Boolean(draft.groupId && draft.name.trim() && draft.date),
    total > 0 && Boolean(payerId),
    previewIsCurrent && preview?.issue === null,
  ][draft.step];

  const goBack = () => {
    setShowErrors(false);
    if (draft.step === 0) navigate(-1);
    else withViewTransition('back', () => dispatch({ type: 'goTo', step: (draft.step - 1) as 0 | 1 }));
  };

  // The expense is already saved here, so a failed receipt doesn't undo it; the API error toast names the problem.
  const syncReceipts = async (transactionId: string) => {
    for (const receiptId of draft.removedReceiptIds) {
      await deleteReceipt({ transactionId, groupId: draft.groupId, receiptId });
    }
    for (const receipt of draft.receipts) {
      const result = await uploadReceipt({ transactionId, groupId: draft.groupId, file: receipt.file, fileName: receipt.file.name });
      if ('error' in result) toast.error(t('receiptUploadFailed', { name: receipt.file.name }));
    }
  };

  const save = async () => {
    const body = {
      groupId: draft.groupId,
      name: draft.name.trim(),
      currencyCode,
      note: draft.note.trim() || null,
      // Noon local time keeps the chosen calendar day stable across time zones.
      paymentDateUtc: new Date(`${draft.date}T12:00:00`).toISOString(),
      ...split,
    };

    const result = existing ? await updateTransaction({ ...body, id: existing.id }) : await createTransaction(body);
    if (!('data' in result) || !result.data) return;

    setIsFinishing(true);
    await syncReceipts(result.data.id);
    setIsFinishing(false);

    toast.success(t(existing ? 'expenseSaved' : 'expenseAdded'));
    navigate(existing ? routes.expense(draft.groupId, existing.id) : routes.group(draft.groupId), { replace: true });
  };

  const goNext = () => {
    if (!stepIsValid) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    if (draft.step === 2) void save();
    else withViewTransition('forward', () => dispatch({ type: 'goTo', step: (draft.step + 1) as 1 | 2 }));
  };

  const renderStep = () => {
    if (draft.step > 0 && isGroupFetching) return <PageSpinner />;

    switch (draft.step) {
      case 0:
        return (
          <DetailsStep
            draft={draft}
            dispatch={dispatch}
            groups={groups}
            currencyCode={currencyCode}
            showErrors={showErrors}
            editing={existing && { storedReceipts: existing.receipts }}
          />
        );
      case 1:
        return (
          <PaidByStep
            draft={draft}
            dispatch={dispatch}
            members={members}
            payerId={payerId}
            currencyCode={currencyCode}
            total={total}
            showErrors={showErrors}
          />
        );
      case 2:
        return (
          <SplitStep
            draft={draft}
            dispatch={dispatch}
            members={members}
            currencyCode={currencyCode}
            total={total}
            preview={preview}
            isPreviewing={!previewIsCurrent}
            showErrors={showErrors}
          />
        );
    }
  };

  const topBar = <TopBar title={existing ? t('editExpense') : t('newExpense')} back={true} />;

  if (isGroupsLoading) return <Screen topBar={topBar}><PageSpinner /></Screen>;

  if (groups.length === 0 && !existing) {
    return (
      <Screen topBar={topBar}>
        <EmptyState
          icon={<UsersRound size={28} />}
          title={t('noGroupsTitle')}
          description={t('noGroupsDescription')}
          action={
            <ButtonLink to={routes.newGroup} icon={<Plus size={20} />}>
              {t('createGroup')}
            </ButtonLink>
          }
        />
      </Screen>
    );
  }

  return (
    <Screen
      topBar={topBar}
      footer={
        <FooterActions>
          <Button variant="secondary" onClick={goBack}>
            {t('back', { ns: 'common' })}
          </Button>
          <Button onClick={goNext} loading={isCreating || isUpdating || isFinishing} disabled={showErrors && !stepIsValid}>
            {draft.step === 2 ? t('saveExpense') : t('continue')}
          </Button>
        </FooterActions>
      }
    >
      <Stepper steps={[t('stepDetails'), t('stepPaidBy'), t('stepSplit')]} current={draft.step} />
      {renderStep()}
    </Screen>
  );
};

const EditExpense = ({ groupId, expenseId }: { groupId: string; expenseId: string }) => {
  const { t } = useTranslation('expenses');
  const { data: expense, isLoading } = useGetTransactionQuery(expenseId);
  const { data: group, isLoading: isGroupLoading } = useGetGroupQuery(groupId);

  if (isLoading || isGroupLoading) return <Screen topBar={<TopBar title={t('editExpense')} back={true} />}><PageSpinner /></Screen>;
  if (!expense || !group) return <Navigate to={routes.group(groupId)} replace />;
  // Repayments are edited in a dialog on their own page, and locked expenses can't be edited at all.
  if (expense.isSettlement || expense.isLocked) return <Navigate to={routes.expense(groupId, expenseId)} replace />;

  const draft = draftFromExpense(expense, groupId, group.participants.map(member => member.id));
  return <ExpenseForm key={expense.id} initialDraft={draft} existing={expense} />;
};

const NewExpensePage = () => {
  const { groupId, expenseId } = useParams();
  const [searchParams] = useSearchParams();

  if (groupId && expenseId) return <EditExpense groupId={groupId} expenseId={expenseId} />;
  return <ExpenseForm initialDraft={createDraft(searchParams.get('groupId') ?? '')} />;
};

export default NewExpensePage;
