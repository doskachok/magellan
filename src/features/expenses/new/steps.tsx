import type { Dispatch } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, CheckCircle2, CircleDashed } from 'lucide-react';

import { Avatar, Card, PlaceholderLabel, SegmentedControl, SelectField, Stack, TextAreaField, TextField } from 'components';
import { CURRENCIES, getFileUrl } from 'lib/config';
import { formatMoney } from 'lib/format';
import { getDisplayName, type User } from 'features/users/types';
import type { GroupListItem } from 'features/groups/types';
import { SPLIT_MODES, type SplitIssue, type SplitPreview, type SplitState } from '../split';
import type { Receipt } from '../types';
import { isAmountInput, NOTE_MAX_LENGTH, type DraftAction, type ExpenseDraft } from './draft';
import { AmountInput } from './parts';
import { ReceiptPicker } from './ReceiptPicker';
import { Checkbox, ChoiceRow, Notice, Radio, RowAmount, RowName, RowSubtitle, StepHeading } from './parts.styles';

interface DetailsStepProps {
  draft: ExpenseDraft;
  dispatch: Dispatch<DraftAction>;
  groups: GroupListItem[];
  currencyCode: string;
  showErrors: boolean;
  /** When editing: the group can't change, and these receipts are already stored. */
  editing?: { storedReceipts: Receipt[] };
}

export const DetailsStep = ({ draft, dispatch, groups, currencyCode, showErrors, editing }: DetailsStepProps) => {
  const { t } = useTranslation('expenses');

  return (
    <Stack>
      <StepHeading>
        <h2>{t('detailsTitle')}</h2>
        <p>{t('detailsDescription')}</p>
      </StepHeading>
      <Card $padded>
        <Stack>
          <SelectField
            label={t('group')}
            placeholder={t('selectGroup')}
            value={draft.groupId}
            disabled={Boolean(editing)}
            options={groups.map(group => ({ value: group.id, label: group.name }))}
            error={showErrors && !draft.groupId ? t('groupRequired') : undefined}
            onChange={event => dispatch({ type: 'selectGroup', groupId: event.target.value })}
          />
          <TextField
            label={t('description')}
            placeholder={t('descriptionPlaceholder')}
            autoComplete="off"
            value={draft.name}
            error={showErrors && !draft.name.trim() ? t('descriptionRequired') : undefined}
            onChange={event => dispatch({ type: 'update', patch: { name: event.target.value } })}
          />
          <TextField
            label={t('date')}
            type="date"
            value={draft.date}
            error={showErrors && !draft.date ? t('dateRequired') : undefined}
            onChange={event => dispatch({ type: 'update', patch: { date: event.target.value } })}
          />
          <SelectField
            label={t('currency')}
            value={currencyCode}
            options={CURRENCIES.map(code => ({ value: code, label: code }))}
            onChange={event => dispatch({ type: 'update', patch: { currencyCode: event.target.value } })}
          />
          <TextAreaField
            label={t('noteOptional')}
            maxLength={NOTE_MAX_LENGTH}
            rows={3}
            value={draft.note}
            hint={draft.note.length > NOTE_MAX_LENGTH - 50 ? t('noteLeft', { count: NOTE_MAX_LENGTH - draft.note.length }) : undefined}
            onChange={event => dispatch({ type: 'update', patch: { note: event.target.value } })}
          />
          <ReceiptPicker
            pending={draft.receipts}
            stored={(editing?.storedReceipts ?? []).filter(receipt => !draft.removedReceiptIds.includes(receipt.id))}
            dispatch={dispatch}
          />
        </Stack>
      </Card>
    </Stack>
  );
};

interface PaidByStepProps {
  draft: ExpenseDraft;
  dispatch: Dispatch<DraftAction>;
  members: User[];
  payerId: string;
  currencyCode: string;
  total: number;
  showErrors: boolean;
}

export const PaidByStep = ({ draft, dispatch, members, payerId, currencyCode, total, showErrors }: PaidByStepProps) => {
  const { t } = useTranslation('expenses');
  const totalError = showErrors && total <= 0 ? t('amountRequired') : undefined;

  return (
    <Stack>
      <StepHeading>
        <h2>{t('paidByTitle')}</h2>
        <p>{t('paidByDescription')}</p>
      </StepHeading>

      <SegmentedControl
        label={t('paidByTitle')}
        value={draft.payerMode}
        onChange={payerMode => dispatch({ type: 'update', patch: { payerMode } })}
        options={[
          { value: 'single', label: t('onePerson') },
          { value: 'multiple', label: t('severalPeople') },
        ]}
      />

      {draft.payerMode === 'single' ? (
        <>
          <Card $padded>
            <TextField
              label={t('totalAmount', { currency: currencyCode })}
              inputMode="decimal"
              autoComplete="off"
              placeholder="0.00"
              value={draft.amount}
              error={totalError}
              onChange={event => {
                if (isAmountInput(event.target.value)) dispatch({ type: 'update', patch: { amount: event.target.value } });
              }}
            />
          </Card>
          <Card role="radiogroup" aria-label={t('whoPaid')}>
            {members.map(member => (
              <ChoiceRow key={member.id}>
                <Avatar name={getDisplayName(member)} src={getFileUrl(member.avatarId)} size={36} />
                <RowName>
                  {getDisplayName(member)}
                  {member.isPlaceholder && <RowSubtitle><PlaceholderLabel /></RowSubtitle>}
                </RowName>
                <Radio
                  name="payer"
                  checked={payerId === member.id}
                  onChange={() => dispatch({ type: 'update', patch: { payerId: member.id } })}
                />
              </ChoiceRow>
            ))}
          </Card>
        </>
      ) : (
        <>
          <Card>
            {members.map(member => (
              <ChoiceRow key={member.id} as="div">
                <Avatar name={getDisplayName(member)} src={getFileUrl(member.avatarId)} size={36} />
                <RowName>
                  {getDisplayName(member)}
                  {member.isPlaceholder && <RowSubtitle><PlaceholderLabel /></RowSubtitle>}
                </RowName>
                <AmountInput
                  label={t('amountPaidBy', { name: getDisplayName(member) })}
                  value={draft.payerAmounts[member.id] ?? ''}
                  onValueChange={value => dispatch({ type: 'setPayerAmount', userId: member.id, value })}
                />
              </ChoiceRow>
            ))}
          </Card>
          <Notice $tone={total > 0 ? 'positive' : showErrors ? 'negative' : 'neutral'} role="status">
            {total > 0 ? t('totalPaid', { amount: formatMoney(total, currencyCode) }) : t('amountRequired')}
          </Notice>
        </>
      )}
    </Stack>
  );
};

interface SplitStepProps {
  draft: ExpenseDraft;
  dispatch: Dispatch<DraftAction>;
  members: User[];
  currencyCode: string;
  total: number;
  /** The API's preview of the split; undefined until the first one arrives. */
  preview: SplitPreview | undefined;
  /** The preview doesn't reflect the latest input yet. */
  isPreviewing: boolean;
  showErrors: boolean;
}

/** Words for the API's verdict. Only wording is chosen here; every number comes from the API. */
const useIssueText = () => {
  const { t } = useTranslation('expenses');
  return (issue: SplitIssue, split: SplitState, total: number, currencyCode: string) => {
    const remaining = issue.remaining ?? 0;
    switch (issue.kind) {
      case 'noPayers':
        return t('amountRequired');
      case 'noParticipants':
        // Nothing was entered yet, so everything is still to be assigned.
        return {
          equal: t('issueNoParticipants'),
          amount: t('issueAmountLeft', { amount: formatMoney(total, currencyCode) }),
          percent: t('issuePercentLeft', { percent: 100 }),
          shares: t('issueNoShares'),
        }[split.mode];
      case 'noShares':
        return t('issueNoShares');
      case 'invalidSplit':
        return t('issueInvalidSplit');
      case 'amountMismatch':
        // With a rest option on, money left over means nobody was ticked to take it.
        if (remaining > 0 && split.mode === 'amount' && split.rest !== 'none') return t(`issueNoRestTakers_${split.rest}`);
        return remaining > 0
          ? t('issueAmountLeft', { amount: formatMoney(remaining, currencyCode) })
          : t('issueAmountOver', { amount: formatMoney(-remaining, currencyCode) });
      case 'percentMismatch':
        return remaining > 0 ? t('issuePercentLeft', { percent: remaining }) : t('issuePercentOver', { percent: -remaining });
    }
  };
};

export const SplitStep = ({ draft, dispatch, members, currencyCode, total, preview, isPreviewing, showErrors }: SplitStepProps) => {
  const { t } = useTranslation('expenses');
  const issueText = useIssueText();
  const { mode, rest } = draft.split;
  const sharingRest = mode === 'amount' && rest !== 'none';
  const shares = new Map(preview?.shares.map(share => [share.userId, share.partialAmount]));
  const balanced = preview?.issue === null && !isPreviewing;
  const tone = balanced ? 'positive' : showErrors && preview?.issue ? 'negative' : 'neutral';
  const NoticeIcon = { positive: CheckCircle2, negative: AlertCircle, neutral: CircleDashed }[tone];

  return (
    <Stack>
      <StepHeading>
        <h2>{t('splitTitle')}</h2>
        <p>{t('splitDescription', { amount: formatMoney(total, currencyCode) })}</p>
      </StepHeading>

      <SegmentedControl
        label={t('splitMethod')}
        value={mode}
        onChange={value => dispatch({ type: 'setSplitMode', mode: value })}
        options={SPLIT_MODES.map(value => ({ value, label: t(`mode_${value}`) }))}
      />

      <Card>
        {members.map(member => {
          const name = getDisplayName(member);
          const share = preview ? formatMoney(shares.get(member.id) ?? 0, currencyCode) : '—';

          if (mode === 'equal') {
            const included = draft.split.included[member.id] ?? true;
            return (
              <ChoiceRow key={member.id}>
                <Avatar name={name} src={getFileUrl(member.avatarId)} size={36} />
                <RowName>
                  {name}
                  {member.isPlaceholder && <RowSubtitle><PlaceholderLabel /></RowSubtitle>}
                </RowName>
                <RowAmount $muted={!included}>{share}</RowAmount>
                <Checkbox
                  checked={included}
                  aria-label={t('includeMember', { name })}
                  onChange={event => dispatch({ type: 'toggleIncluded', userId: member.id, included: event.target.checked })}
                />
              </ChoiceRow>
            );
          }

          return (
            <ChoiceRow key={member.id} as="div">
              <Avatar name={name} src={getFileUrl(member.avatarId)} size={36} />
              <RowName>
                {name}
                {member.isPlaceholder && <RowSubtitle><PlaceholderLabel /></RowSubtitle>}
                {(mode !== 'amount' || sharingRest) && <RowSubtitle>{share}</RowSubtitle>}
              </RowName>
              <AmountInput
                label={t(`valueFor_${mode}`, { name })}
                placeholder={mode === 'percent' ? '0 %' : '0'}
                value={draft.split.values[member.id] ?? ''}
                onValueChange={value => dispatch({ type: 'setSplitValue', userId: member.id, value })}
              />
              {sharingRest && (
                <Checkbox
                  checked={draft.split.restIncluded[member.id] ?? true}
                  aria-label={t('includeMemberInRest', { name })}
                  onChange={event => dispatch({ type: 'toggleRestIncluded', userId: member.id, included: event.target.checked })}
                />
              )}
            </ChoiceRow>
          );
        })}
      </Card>

      {mode === 'amount' && (
        <Card role="group" aria-label={t('splitRest')}>
          {(['equal', 'proportional'] as const).map(value => (
            <ChoiceRow key={value}>
              <RowName>
                {t(`splitRest_${value}`)}
                <RowSubtitle>{t(`splitRestHint_${value}`)}</RowSubtitle>
              </RowName>
              <Checkbox
                checked={rest === value}
                onChange={event => dispatch({ type: 'setSplitRest', rest: event.target.checked ? value : 'none' })}
              />
            </ChoiceRow>
          ))}
        </Card>
      )}

      <Notice $tone={tone} role="status">
        <NoticeIcon size={18} aria-hidden />
        {!preview
          ? t('splitChecking')
          : preview.issue
            ? issueText(preview.issue, draft.split, total, currencyCode)
            : t('splitBalanced')}
      </Notice>
    </Stack>
  );
};
