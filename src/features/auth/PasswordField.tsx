import { useState, type ComponentProps } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { IconButton, TextField } from 'components';

type PasswordFieldProps = Omit<ComponentProps<typeof TextField>, 'type' | 'suffix'>;

export const PasswordField = (props: PasswordFieldProps) => {
  const { t } = useTranslation('auth');
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      {...props}
      type={visible ? 'text' : 'password'}
      suffix={
        <IconButton
          label={visible ? t('hidePassword') : t('showPassword')}
          icon={visible ? <EyeOff size={20} /> : <Eye size={20} />}
          onClick={() => setVisible(value => !value)}
        />
      }
    />
  );
};
