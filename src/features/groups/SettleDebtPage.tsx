import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import styled from 'styled-components';

import { Avatar, Button, ButtonLink, Card, EmptyState, Muted, PageSpinner, Screen, TextField, TopBar } from 'components';
import { getFileUrl } from 'lib/config';
import { formatMoney, parseAmount, roundMoney } from 'lib/format';
import { routes } from 'lib/routes';
import { isAmountInput } from 'features/expenses/new/draft';
import { useCurrentUserId } from 'features/users/api';
import { useGetGroupDebtsQuery, useSettleDebtMutation } from './api';
import { settlementIssue, toSettlement } from './settlement';
import type { Debt } from './types';

const FORM_ID = 'settle-debt-form';

const Hero = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space(2)};
  text-align: center;
`;

const People = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(3)};
  margin-bottom: ${({ theme }) => theme.space(2)};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const HeroTitle = styled.h2`
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(4)};
`;

const SettleForm = ({ groupId, debt }: { groupId: string; debt: Debt }) => {
  const { t } = useTranslation('groups');
  const navigate = useNavigate();
  const userId = useCurrentUserId();
  const [settleDebt, { isLoading }] = useSettleDebtMutation();
  const [amount, setAmount] = useState(() => roundMoney(debt.amount).toFixed(2));
  const [showErrors, setShowErrors] = useState(false);

  const owed = formatMoney(debt.amount, debt.currencyCode);
  const issue = settlementIssue(amount, debt.amount);
  const title =
    debt.debtorId === userId ? t('settleYouPay', { name: debt.lenderName }) : t('settlePaysYou', { name: debt.debtorName });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (issue) {
      setShowErrors(true);
      return;
    }

    const result = await settleDebt({ groupId, ...toSettlement(debt, amount) });
    if ('error' in result) return;

    toast.success(t('paymentRecorded'));
    navigate(routes.group(groupId), { replace: true });
  };

  return (
    <Screen
      topBar={<TopBar title={t('settleUp')} back={routes.group(groupId)} />}
      footer={
        <Button type="submit" form={FORM_ID} fullWidth loading={isLoading}>
          {issue ? t('recordPaymentNoAmount') : t('recordPayment', { amount: formatMoney(parseAmount(amount), debt.currencyCode) })}
        </Button>
      }
    >
      <Hero $padded>
        <People>
          <Avatar name={debt.debtorName} src={getFileUrl(debt.debtorAvatarId)} size={56} />
          <ArrowRight size={24} aria-hidden />
          <Avatar name={debt.lenderName} src={getFileUrl(debt.lenderAvatarId)} size={56} />
        </People>
        <HeroTitle>{title}</HeroTitle>
        <Muted>{t('settleOwed', { amount: owed })}</Muted>
      </Hero>

      <Card $padded>
        <Form id={FORM_ID} onSubmit={handleSubmit} noValidate>
          <TextField
            label={t('settleAmount', { currency: debt.currencyCode })}
            inputMode="decimal"
            autoComplete="off"
            placeholder="0.00"
            value={amount}
            hint={t('settleAmountHint', { amount: owed })}
            error={showErrors && issue ? t(issue === 'amountRequired' ? 'settleAmountRequired' : 'settleAmountOver', { amount: owed }) : undefined}
            onChange={event => {
              if (isAmountInput(event.target.value)) setAmount(event.target.value);
            }}
          />
        </Form>
      </Card>
    </Screen>
  );
};

const SettleDebtPage = () => {
  const { t } = useTranslation('groups');
  const { groupId = '' } = useParams();
  const [searchParams] = useSearchParams();
  const userId = useCurrentUserId();
  const { data: debts, isLoading } = useGetGroupDebtsQuery(groupId);

  const debt = debts?.find(
    d =>
      d.debtorId === searchParams.get('debtor') &&
      d.lenderId === searchParams.get('lender') &&
      d.currencyCode === searchParams.get('currency'),
  );

  // Only the two people in a debt can settle it; anything else (already settled, stale link) has nothing to do here.
  if (debt && (debt.debtorId === userId || debt.lenderId === userId)) return <SettleForm groupId={groupId} debt={debt} />;

  return (
    <Screen topBar={<TopBar title={t('settleUp')} back={routes.group(groupId)} />}>
      {isLoading ? (
        <PageSpinner />
      ) : (
        <Card>
          <EmptyState
            icon={<CheckCircle2 size={28} />}
            title={t('nothingToSettleTitle')}
            description={t('nothingToSettleDescription')}
            action={<ButtonLink to={routes.group(groupId)}>{t('backToGroup')}</ButtonLink>}
          />
        </Card>
      )}
    </Screen>
  );
};

export default SettleDebtPage;
