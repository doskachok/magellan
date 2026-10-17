import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, X } from 'lucide-react';
import styled from 'styled-components';

import { ConfirmDialog, IconButton, Section, Spinner } from 'components';
import { useDeleteReceiptMutation, useGetReceiptUrlQuery } from '../api';
import type { Receipt } from '../types';

const Grid = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
  gap: ${({ theme }) => theme.space(3)};
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Tile = styled.li`
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface};
`;

const Open = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space(1)};
  width: 100%;
  height: 100%;
  padding: ${({ theme }) => theme.space(2)};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.font.size.xs};
  text-align: center;
  text-decoration: none;
  overflow-wrap: anywhere;

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Remove = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.space(1)};
  right: ${({ theme }) => theme.space(1)};
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.surface};
`;

const ReceiptTile = ({ transactionId, receipt, onRemove }: { transactionId: string; receipt: Receipt; onRemove: () => void }) => {
  const { t } = useTranslation('expenses');
  const { data: url } = useGetReceiptUrlQuery({ transactionId, receiptId: receipt.id });
  const isImage = receipt.contentType.startsWith('image/');

  return (
    <Tile>
      <Open href={url} target="_blank" rel="noreferrer" aria-label={t('openReceipt', { name: receipt.fileName })}>
        {!url && <Spinner size={20} />}
        {url && isImage && <img src={url} alt="" />}
        {url && !isImage && (
          <>
            <FileText size={28} aria-hidden />
            {receipt.fileName}
          </>
        )}
      </Open>
      <Remove>
        <IconButton label={t('removeReceipt', { name: receipt.fileName })} icon={<X size={16} />} onClick={onRemove} />
      </Remove>
    </Tile>
  );
};

/** Receipt thumbnails; renders nothing when the expense has none. */
export const ReceiptsSection = ({ transactionId, groupId, receipts }: { transactionId: string; groupId: string; receipts: Receipt[] }) => {
  const { t } = useTranslation('expenses');
  const [removing, setRemoving] = useState<Receipt>();
  const [deleteReceipt, { isLoading }] = useDeleteReceiptMutation();

  if (receipts.length === 0) return null;

  const confirm = async () => {
    if (!removing) return;
    const result = await deleteReceipt({ transactionId, groupId, receiptId: removing.id });
    if (!('error' in result)) setRemoving(undefined);
  };

  return (
    <Section title={t('receipts')}>
      <Grid>
        {receipts.map(receipt => (
          <ReceiptTile key={receipt.id} transactionId={transactionId} receipt={receipt} onRemove={() => setRemoving(receipt)} />
        ))}
      </Grid>
      <ConfirmDialog
        open={Boolean(removing)}
        title={t('removeReceiptTitle')}
        message={t('removeReceiptMessage', { name: removing?.fileName ?? '' })}
        confirmLabel={t('remove')}
        destructive
        loading={isLoading}
        onConfirm={() => void confirm()}
        onClose={() => setRemoving(undefined)}
      />
    </Section>
  );
};
