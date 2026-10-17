import { useEffect, useRef, useState, type ReactNode } from 'react';
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
  transition:
    opacity 200ms ease-out,
    transform ${({ theme }) => theme.motion.enter};

  @starting-style {
    opacity: 0;
    transform: translateY(16px) scale(0.97);
  }

  &::backdrop {
    background: ${({ theme }) => theme.colors.overlay};
    transition: background-color 200ms ease-out;

    @starting-style {
      background: transparent;
    }
  }

  /* Exit: the dialog stays in the top layer while this plays, then closes (see closeAnimated). */
  &[data-closing] {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
    transition-duration: 150ms;
  }

  &[data-closing]::backdrop {
    background: transparent;
    transition-duration: 150ms;
  }

  @media (prefers-reduced-motion: reduce) {
    transform: none !important;
  }
`;

/** Lets the exit transition finish before `close()` takes the dialog out of the top layer. */
const closeAnimated = async (dialog: HTMLDialogElement, isCancelled: () => boolean) => {
  dialog.dataset.closing = '';
  const animations = dialog.getAnimations?.({ subtree: true }) ?? [];
  await Promise.race([
    Promise.allSettled(animations.map(animation => animation.finished)),
    new Promise(resolve => setTimeout(resolve, 400)),
  ]);
  if (isCancelled()) return false;
  delete dialog.dataset.closing;
  dialog.close();
  return true;
};

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
  // Content stays mounted until the exit animation is over, so the dialog doesn't empty out mid-fade.
  const [rendered, setRendered] = useState(open);
  if (open && !rendered) setRendered(true);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open) {
      if (!dialog.open) dialog.showModal();
      return;
    }
    if (!dialog.open) return;

    let cancelled = false;
    void closeAnimated(dialog, () => cancelled).then(closed => {
      if (closed) setRendered(false);
    });
    return () => {
      cancelled = true;
      delete dialog.dataset.closing;
    };
  }, [open]);

  return (
    <StyledDialog
      ref={ref}
      // Escape goes through the parent's state like every other close, so it animates too.
      onCancel={event => {
        event.preventDefault();
        onClose();
      }}
      onClose={() => {
        if (open) onClose();
      }}
      onClick={event => {
        // Clicks on the backdrop land on the dialog element itself.
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {rendered && (
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
