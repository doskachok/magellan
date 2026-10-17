import { useId, useState, type ChangeEvent, type Dispatch } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Image, Paperclip, X } from 'lucide-react';
import toast from 'react-hot-toast';
import styled from 'styled-components';

import { IconButton, Spinner } from 'components';
import type { Receipt } from '../types';
import type { DraftAction, PendingReceipt } from './draft';
import { MAX_RECEIPTS, RECEIPT_TYPES, ReceiptError, resizeImage } from './resizeImage';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(2)};
`;

const Label = styled.span`
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
`;

const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Item = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space(2)};
  min-height: 44px;
  color: ${({ theme }) => theme.colors.textMuted};

  span {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    color: ${({ theme }) => theme.colors.text};
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

// The visible button is a label so the native file input keeps its keyboard and screen-reader behaviour.
const AddButton = styled.label<{ $disabled: boolean }>`
  display: inline-flex;
  align-self: flex-start;
  align-items: center;
  gap: ${({ theme }) => theme.space(2)};
  min-height: ${({ theme }) => theme.layout.touchTarget};
  padding: ${({ theme }) => theme.space(0, 4)};
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radius.md};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};

  &:focus-within {
    outline: 2px solid ${({ theme }) => theme.colors.focus};
    outline-offset: 2px;
  }

  input {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
  }
`;

const Hint = styled.p`
  font-size: ${({ theme }) => theme.font.size.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

interface ReceiptPickerProps {
  pending: PendingReceipt[];
  /** Receipts already saved on the expense that aren't marked for removal. */
  stored: Receipt[];
  dispatch: Dispatch<DraftAction>;
}

const iconFor = (type: string) => (type === 'application/pdf' ? <FileText size={20} aria-hidden /> : <Image size={20} aria-hidden />);

/** Optional receipts: photos are shrunk as soon as they're picked, so problems show up before saving. */
export const ReceiptPicker = ({ pending, stored, dispatch }: ReceiptPickerProps) => {
  const { t } = useTranslation('expenses');
  const inputId = useId();
  const [isPreparing, setIsPreparing] = useState(false);
  const slotsLeft = MAX_RECEIPTS - pending.length - stored.length;

  const onPick = async (event: ChangeEvent<HTMLInputElement>) => {
    const picked = [...(event.target.files ?? [])];
    event.target.value = '';
    if (picked.length > slotsLeft) toast.error(t('receiptLimit', { count: MAX_RECEIPTS }));

    setIsPreparing(true);
    const ready: File[] = [];
    for (const file of picked.slice(0, slotsLeft)) {
      try {
        ready.push(await resizeImage(file));
      } catch (error) {
        const reason = error instanceof ReceiptError ? error.reason : 'unreadable';
        toast.error(t(`receipt_${reason}`, { name: file.name }));
      }
    }
    setIsPreparing(false);
    if (ready.length > 0) dispatch({ type: 'addReceipts', files: ready });
  };

  return (
    <Wrapper>
      <Label id={`${inputId}-label`}>{t('receiptsOptional')}</Label>
      {(stored.length > 0 || pending.length > 0) && (
        <List aria-labelledby={`${inputId}-label`}>
          {stored.map(receipt => (
            <Item key={receipt.id}>
              {iconFor(receipt.contentType)}
              <span>{receipt.fileName}</span>
              <IconButton
                label={t('removeReceipt', { name: receipt.fileName })}
                icon={<X size={18} />}
                onClick={() => dispatch({ type: 'removeStoredReceipt', receiptId: receipt.id })}
              />
            </Item>
          ))}
          {pending.map(receipt => (
            <Item key={receipt.key}>
              {iconFor(receipt.file.type)}
              <span>{receipt.file.name}</span>
              <IconButton
                label={t('removeReceipt', { name: receipt.file.name })}
                icon={<X size={18} />}
                onClick={() => dispatch({ type: 'removeReceipt', key: receipt.key })}
              />
            </Item>
          ))}
        </List>
      )}
      <AddButton $disabled={slotsLeft <= 0 || isPreparing}>
        {isPreparing ? <Spinner size={18} /> : <Paperclip size={18} aria-hidden />}
        {t('addReceipt')}
        <input
          type="file"
          multiple
          accept={RECEIPT_TYPES.join(',')}
          disabled={slotsLeft <= 0 || isPreparing}
          onChange={event => void onPick(event)}
        />
      </AddButton>
      <Hint>{t('receiptHint', { count: MAX_RECEIPTS })}</Hint>
    </Wrapper>
  );
};
