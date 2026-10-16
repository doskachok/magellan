import { useMemo, useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router';
import { Plus, UsersRound } from 'lucide-react';
import toast from 'react-hot-toast';

import { Button, ButtonLink, EmptyState, PageSpinner, Screen, TopBar } from 'components';
import { CURRENCIES } from 'lib/config';
import { parseAmount, roundMoney } from 'lib/format';
import { routes } from 'lib/routes';
import { useGetGroupQuery, useGetGroupsQuery } from 'features/groups/api';
import { useCurrentUserId } from 'features/users/api';
import { useCreateTransactionMutation } from '../api';
import { buildAssignments, buildPayerDetails, evaluateSplit, sumInputs } from '../split';
import { createDraft, draftReducer } from './draft';
import { Stepper } from './parts';
import { FooterActions } from './parts.styles';
import { DetailsStep, PaidByStep, SplitStep } from './steps';

const NewExpensePage = () => {
  const { t } = useTranslation('expenses');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = useCurrentUserId();

  const [draft, dispatch] = useReducer(draftReducer, searchParams.get('groupId') ?? '', createDraft);
  const [showErrors, setShowErrors] = useState(false);

  const { data: groups = [], isLoading: isGroupsLoading } = useGetGroupsQuery();
  const { data: group, isFetching: isGroupFetching } = useGetGroupQuery(draft.groupId, { skip: !draft.groupId });
  const [createTransaction, { isLoading: isSaving }] = useCreateTransactionMutation();

  const members = useMemo(() => group?.participants ?? [], [group]);
  const memberIds = useMemo(() => members.map(member => member.id), [members]);

  // Unset choices fall back to sensible defaults instead of being synced into state by effects.
  const groupCurrency = groups.find(item => item.id === draft.groupId)?.currencyCode;
  const currencyCode = draft.currencyCode || groupCurrency || CURRENCIES[0];
  const payerId = draft.payerId || (memberIds.includes(userId) ? userId : (memberIds[0] ?? ''));

  const payerInputs = draft.payerMode === 'single' ? { [payerId]: draft.amount } : draft.payerAmounts;
  const total = draft.payerMode === 'single' ? roundMoney(parseAmount(draft.amount)) : sumInputs(draft.payerAmounts);
  const splitResult = useMemo(() => evaluateSplit(draft.split, memberIds, total), [draft.split, memberIds, total]);

  const stepIsValid = [
    Boolean(draft.groupId && draft.name.trim() && draft.date),
    total > 0 && Boolean(payerId),
    splitResult.issue === null,
  ][draft.step];

  const goBack = () => {
    setShowErrors(false);
    if (draft.step === 0) navigate(-1);
    else dispatch({ type: 'goTo', step: (draft.step - 1) as 0 | 1 });
  };

  const save = async () => {
    const result = await createTransaction({
      groupId: draft.groupId,
      name: draft.name.trim(),
      currencyCode,
      // Noon local time keeps the chosen calendar day stable across time zones.
      paymentDateUtc: new Date(`${draft.date}T12:00:00`).toISOString(),
      payerDetails: buildPayerDetails(payerInputs),
      partialsAssignments: buildAssignments(draft.split, memberIds),
    });

    if ('data' in result) {
      toast.success(t('expenseAdded'));
      navigate(routes.group(draft.groupId), { replace: true });
    }
  };

  const goNext = () => {
    if (!stepIsValid) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    if (draft.step === 2) void save();
    else dispatch({ type: 'goTo', step: (draft.step + 1) as 1 | 2 });
  };

  const renderStep = () => {
    if (draft.step > 0 && isGroupFetching) return <PageSpinner />;

    switch (draft.step) {
      case 0:
        return (
          <DetailsStep draft={draft} dispatch={dispatch} groups={groups} currencyCode={currencyCode} showErrors={showErrors} />
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
            result={splitResult}
          />
        );
    }
  };

  const topBar = <TopBar title={t('newExpense')} back={true} />;

  if (isGroupsLoading) return <Screen topBar={topBar}><PageSpinner /></Screen>;

  if (groups.length === 0) {
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
          <Button onClick={goNext} loading={isSaving} disabled={showErrors && !stepIsValid}>
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

export default NewExpensePage;
