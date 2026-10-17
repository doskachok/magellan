import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Button } from './Button';
import { IconButton } from './IconButton';

const StyledDialog = styled.dialog`
  width: min(100% - 32px, 480px);
  max-height: min(100% - 64px, 720px);
  padding: 0;
  border: none;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  box-shadow: ${({ theme }) => theme.shadow.raised};

  &::backdrop {
    background: ${({ theme }) => theme.colors.overlay};
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.space(2, 2, 0, 5)};
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.semibold};
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space(4)};
  padding: ${({ theme }) => theme.space(3, 5, 5)};
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.space(2)};
`;

interface DialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

/** Native `<dialog>`: focus trapping, Escape and top-layer rendering come from the browser. */
export const Dialog = ({ open, title, onClose, children }: DialogProps) => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <StyledDialog
      ref={ref}
      onClose={onClose}
      onClick={event => {
        // Clicks on the backdrop land on the dialog element itself.
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {open && (
        <>
          <Header>
            <Title>{title}</Title>
            <IconButton label={t('close')} icon={<X size={20} />} onClick={onClose} />
          </Header>
          <Body>{children}</Body>
        </>
      )}
    </StyledDialog>
  );
};

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: ReactNode;
  confirmLabel: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel,
  destructive = false,
  loading = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} title={title} onClose={onClose}>
      <p>{message}</p>
      <Actions>
        <Button variant="ghost" onClick={onClose}>
          {t('cancel')}
        </Button>
        <Button variant={destructive ? 'danger' : 'primary'} loading={loading} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </Actions>
    </Dialog>
  );
};
