import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { HandCoins, Lock, Pencil, Receipt, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import styled from 'styled-components';

import {
  Avatar,
  Balance,
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  IconButton,
  ListRow,
  MoneyText,
  Muted,
  PageSpinner,
  Screen,
  Section,
  TopBar,
} from 'components';
import { getFileUrl } from 'lib/config';
import { formatMoney, formatShortDate } from 'lib/format';
import { routes } from 'lib/routes';
import { useGetGroupQuery } from 'features/groups/api';
import { useCurrentUserId } from 'features/users/api';
import { getDisplayName, type User } from 'features/users/types';
import { useDeleteTransactionMutation, useGetTransactionQuery, useRestoreTransactionMutation } from './api';
import { EditRepaymentDialog } from './details/EditRepaymentDialog';
import { HistorySection } from './details/HistorySection';
import { ReceiptsSection } from './details/ReceiptsSection';

const Hero = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space(1)};
  text-align: center;
`;

const HeroIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  margin-bottom: ${({ theme }) => theme.space(2)};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.brandSoft};
  color: ${({ theme }) => theme.colors.brand};
`;

const HeroTitle = styled.h2`
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
`;

const HeroAmount = styled.p`
  font-size: ${({ theme }) => theme.font.size.xl};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  font-variant-numeric: tabular-nums;
`;

const YourShare = styled.div`
  margin-top: ${({ theme }) => theme.space(3)};
  padding: ${({ theme }) => theme.space(2, 4)};
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.surfaceMuted};
`;

const LockedHint = styled(Card)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(3)};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const NoteText = styled.p`
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`;

const UndoToast = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(3)};
`;

const ExpenseDetailsPage = () => {
  const { t } = useTranslation('expenses');
  const navigate = useNavigate();
  const { groupId = '', expenseId = '' } = useParams();
  const userId = useCurrentUserId();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [editingRepayment, setEditingRepayment] = useState(false);

  const { data: expense, isLoading } = useGetTransactionQuery(expenseId);
  const { data: group } = useGetGroupQuery(groupId);
  const [deleteTransaction, { isLoading: isDeleting }] = useDeleteTransactionMutation();
  const [restoreTransaction] = useRestoreTransactionMutation();

  const usersById = useMemo(
    () => new Map<string, User>((group?.participants ?? []).map(user => [user.id, user])),
    [group],
  );

  const total = useMemo(() => expense?.payerDetails.reduce((sum, payer) => sum + payer.amount, 0) ?? 0, [expense]);

  const myBalance = useMemo(() => {
    if (!expense) return 0;
    const paid = expense.payerDetails.find(payer => payer.payerId === userId)?.amount ?? 0;
    const owed = expense.partialsAssignmentsTranslated.find(part => part.userId === userId)?.partialAmount ?? 0;
    return paid - owed;
  }, [expense, userId]);

  const personRow = (personId: string, amount: number, currencyCode: string) => {
    const user = usersById.get(personId);
    const name = user ? getDisplayName(user) : t('formerMember');
    return (
      <ListRow
        key={personId}
        leading={<Avatar name={name} src={getFileUrl(user?.avatarId)} size={36} />}
        title={personId === userId ? t('you', { ns: 'groups', name }) : name}
        trailing={<MoneyText>{formatMoney(amount, currencyCode)}</MoneyText>}
      />
    );
  };

  const handleDelete = async () => {
    const result = await deleteTransaction({ id: expenseId, groupId });
    if ('error' in result) return;

    setConfirmingDelete(false);
    navigate(routes.group(groupId), { replace: true });
    toast(
      shown => (
        <UndoToast>
          {t('expenseDeleted')}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              toast.dismiss(shown.id);
              void restoreTransaction({ id: expenseId, groupId });
            }}
          >
            {t('undo')}
          </Button>
        </UndoToast>
      ),
      { duration: 8000 },
    );
  };

  const onEdit = () => {
    if (!expense) return;
    if (expense.isSettlement) setEditingRepayment(true);
    else navigate(routes.editExpense(groupId, expenseId));
  };

  const renderBody = () => {
    if (isLoading) return <PageSpinner />;
    if (!expense) return <EmptyState icon={<Receipt size={28} />} title={t('expenseNotFound')} />;

    return (
      <>
        <Hero $padded>
          <HeroIcon aria-hidden>
            {expense.isSettlement ? <HandCoins size={28} /> : <Receipt size={28} />}
          </HeroIcon>
          <HeroTitle>{expense.isSettlement ? t('settlement') : expense.name}</HeroTitle>
          <HeroAmount>{formatMoney(total, expense.currencyCode)}</HeroAmount>
          <Muted>
            {formatShortDate(expense.paymentDateUtc)}
            {group && ` · ${group.name}`}
          </Muted>
          <YourShare>
            <Balance variant={expense.isSettlement ? 'settlement' : 'expense'} align="left" amount={myBalance} currencyCode={expense.currencyCode} />
          </YourShare>
        </Hero>

        {expense.isLocked && (
          <LockedHint $padded>
            <Lock size={20} aria-hidden />
            {t('lockedHint')}
          </LockedHint>
        )}

        {expense.note && (
          <Section title={t('note')}>
            <Card $padded>
              <NoteText>{expense.note}</NoteText>
            </Card>
          </Section>
        )}

        <Section title={t('paidBy')}>
          <Card>{expense.payerDetails.map(payer => personRow(payer.payerId, payer.amount, expense.currencyCode))}</Card>
        </Section>

        <Section
          title={
            expense.isSettlement
              ? t('paidTo')
              : t('splitBetween', { count: expense.partialsAssignmentsTranslated.length })
          }
        >
          <Card>{expense.partialsAssignmentsTranslated.map(part => personRow(part.userId, part.partialAmount, expense.currencyCode))}</Card>
        </Section>

        <ReceiptsSection transactionId={expense.id} groupId={groupId} receipts={expense.receipts} />
        <HistorySection transactionId={expense.id} />

        <ConfirmDialog
          open={confirmingDelete}
          title={expense.isSettlement ? t('deleteRepaymentTitle') : t('deleteExpenseTitle')}
          message={t('deleteExpenseMessage')}
          confirmLabel={t('delete')}
          destructive
          loading={isDeleting}
          onConfirm={() => void handleDelete()}
          onClose={() => setConfirmingDelete(false)}
        />
        {expense.isSettlement && editingRepayment && (
          <EditRepaymentDialog open groupId={groupId} repayment={expense} onClose={() => setEditingRepayment(false)} />
        )}
      </>
    );
  };

  const actions = expense && (
    <>
      <IconButton tone="onBrand" label={t('edit')} icon={<Pencil size={20} />} disabled={expense.isLocked} onClick={onEdit} />
      <IconButton
        tone="onBrand"
        label={t('delete')}
        icon={<Trash2 size={20} />}
        disabled={expense.isLocked}
        onClick={() => setConfirmingDelete(true)}
      />
    </>
  );

  return (
    <Screen
      topBar={<TopBar title={expense?.isSettlement ? t('settlement') : t('expense')} back={routes.group(groupId)} actions={actions} />}
    >
      {renderBody()}
    </Screen>
  );
};

export default ExpenseDetailsPage;
