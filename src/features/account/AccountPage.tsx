import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

import {
  AvatarPicker,
  Button,
  Card,
  ConfirmDialog,
  ListRow,
  PageSpinner,
  Screen,
  Section,
  Stack,
  TextField,
  TopBar,
} from 'components';
import { getFileUrl } from 'lib/config';
import { useAppDispatch } from 'store';
import { loggedOut } from 'store/authSlice';
import { useCurrentUser, useUpdateUserMutation, useUploadFileMutation } from 'features/users/api';
import type { User } from 'features/users/types';

interface ProfileForm {
  name: string;
}

const ProfileCard = ({ user }: { user: User }) => {
  const { t } = useTranslation('account');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();
  const [updateUser, { isLoading: isSaving }] = useUpdateUserMutation();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isDirty },
  } = useForm<ProfileForm>({ defaultValues: { name: user.name ?? '' } });
  const name = useWatch({ control, name: 'name' });

  const onSubmit = async (form: ProfileForm) => {
    let avatarId = user.avatarId;
    if (avatarFile) {
      const uploaded = await uploadFile(avatarFile);
      if ('error' in uploaded) return;
      avatarId = uploaded.data.id;
    }

    const result = await updateUser({ id: user.id, name: form.name.trim(), avatarId });
    if ('error' in result) return;

    reset({ name: result.data.name ?? '' });
    setAvatarFile(null);
    toast.success(t('profileSaved'));
  };

  return (
    <Card $padded as="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <AvatarPicker
          name={name || user.username}
          src={getFileUrl(user.avatarId)}
          file={avatarFile}
          onFileChange={setAvatarFile}
        />
        <TextField label={t('displayName')} hint={t('displayNameHint')} autoComplete="name" {...register('name')} />
        <TextField label={t('username')} value={user.username} readOnly />
        <TextField label={t('email')} value={user.email} readOnly />
        <Button type="submit" fullWidth disabled={!isDirty && !avatarFile} loading={isUploading || isSaving}>
          {t('saveChanges')}
        </Button>
      </Stack>
    </Card>
  );
};

const AccountPage = () => {
  const { t } = useTranslation('account');
  const dispatch = useAppDispatch();
  const { data: user, isLoading } = useCurrentUser();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  return (
    <Screen withNav topBar={<TopBar title={t('title')} />}>
      {isLoading || !user ? <PageSpinner /> : <ProfileCard key={user.id} user={user} />}

      <Section title={t('session')}>
        <Card>
          <ListRow leading={<LogOut size={20} aria-hidden />} title={t('logOut')} onClick={() => setIsLogoutOpen(true)} />
        </Card>
      </Section>

      <ConfirmDialog
        open={isLogoutOpen}
        title={t('logOutTitle')}
        message={t('logOutMessage')}
        confirmLabel={t('logOut')}
        destructive
        onConfirm={() => dispatch(loggedOut())}
        onClose={() => setIsLogoutOpen(false)}
      />
    </Screen>
  );
};

export default AccountPage;
