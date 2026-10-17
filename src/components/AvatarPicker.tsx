import { useEffect, useId, useMemo } from 'react';
import { Camera } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Avatar } from './Avatar';

const Root = styled.div`
  position: relative;
  align-self: center;
`;

const Trigger = styled.label`
  display: block;
  border-radius: 50%;
  cursor: pointer;

  &:has(+ input:focus-visible) {
    outline: 2px solid ${({ theme }) => theme.colors.focus};
    outline-offset: 3px;
  }
`;

const Badge = styled.span`
  position: absolute;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 2px solid ${({ theme }) => theme.colors.surface};
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.brand};
  color: ${({ theme }) => theme.colors.onBrand};
`;

interface AvatarPickerProps {
  name: string;
  src?: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  disabled?: boolean;
}

/** Avatar with a hidden image input; shows a local preview of the picked file. */
export const AvatarPicker = ({ name, src, file, onFileChange, disabled }: AvatarPickerProps) => {
  const { t } = useTranslation();
  const inputId = useId();
  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : undefined), [file]);

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  return (
    <Root>
      <Trigger htmlFor={inputId}>
        <Avatar name={name || '?'} src={previewUrl ?? src} size={96} />
        <Badge aria-hidden>
          <Camera size={16} />
        </Badge>
        <span className="visually-hidden">{t('changePhoto')}</span>
      </Trigger>
      <input
        id={inputId}
        className="visually-hidden"
        type="file"
        accept="image/*"
        disabled={disabled}
        onChange={event => onFileChange(event.target.files?.[0] ?? null)}
      />
    </Root>
  );
};
