import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import * as yup from 'yup';

import {
  Avatar,
  AvatarPicker,
  Button,
  Card,
  ConfirmDialog,
  ListRow,
  PageSpinner,
  Screen,
  Section,
  SelectField,
  Stack,
  TextField,
  TopBar,
} from 'components';
import { CURRENCIES, getFileUrl } from 'lib/config';
import { routes } from 'lib/routes';
import { useCurrentUserId, useUploadFileMutation } from 'features/users/api';
import { getDisplayName, type User } from 'features/users/types';
import { useGetGroupQuery, useRemoveParticipantMutation, useSaveGroupMutation } from './api';
import { AddMemberDialog } from './AddMemberDialog';
import type { Group } from './types';

const groupSchema = yup.object({
  name: yup.string().trim().required('groupNameRequired').max(64, 'groupNameLength'),
  currencyCode: yup.string().required(),
});

type GroupForm = yup.InferType<typeof groupSchema>;

const currencyOptions = CURRENCIES.map(code => ({ value: code, label: code }));

const GroupDetailsForm = ({ group }: { group?: Group }) => {
  const { t } = useTranslation('groups');
  const { t: tv } = useTranslation('validation');
  const navigate = useNavigate();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();
  const [saveGroup, { isLoading: isSaving }] = useSaveGroupMutation();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<GroupForm>({
    resolver: yupResolver(groupSchema),
    defaultValues: { name: group?.name ?? '', currencyCode: group?.currencyCode ?? CURRENCIES[0] },
  });

  const onSubmit = async (form: GroupForm) => {
    let avatarId = group?.avatarId;
    if (avatarFile) {
      const uploaded = await uploadFile(avatarFile);
      if ('error' in uploaded) return;
      avatarId = uploaded.data.id;
    }

    const result = await saveGroup({ id: group?.id, avatarId, ...form });
    if ('error' in result) return;

    if (group) {
      reset(form);
      setAvatarFile(null);
      toast.success(t('groupSaved'));
    } else {
      toast.success(t('groupCreated'));
      // Straight to settings so the next natural step — adding members — is right there.
      navigate(routes.groupSettings(result.data.id), { replace: true });
    }
  };

  const name = useWatch({ control, name: 'name' });
  const canSave = !group || isDirty || avatarFile !== null;

  return (
    <Card $padded as="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack>
        <AvatarPicker
          name={name || group?.name || ''}
          src={getFileUrl(group?.avatarId)}
          file={avatarFile}
          onFileChange={setAvatarFile}
        />
        <TextField
          label={t('groupName')}
          placeholder={t('groupNamePlaceholder')}
          autoComplete="off"
          error={errors.name?.message && tv(errors.name.message)}
          {...register('name')}
        />
        <SelectField
          label={t('currency')}
          hint={t('currencyHint')}
          options={currencyOptions}
          {...register('currencyCode')}
        />
        <Button type="submit" fullWidth disabled={!canSave} loading={isUploading || isSaving}>
          {group ? t('saveChanges') : t('createGroup')}
        </Button>
      </Stack>
    </Card>
  );
};

const MembersSection = ({ group }: { group: Group }) => {
  const { t } = useTranslation('groups');
  const userId = useCurrentUserId();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<User | null>(null);
  const [removeParticipant, { isLoading: isRemoving }] = useRemoveParticipantMutation();

  const handleRemove = async () => {
    if (!memberToRemove) return;
    const result = await removeParticipant({ groupId: group.id, userId: memberToRemove.id });
    if ('data' in result) toast.success(t('memberRemoved', { name: getDisplayName(memberToRemove) }));
    setMemberToRemove(null);
  };

  return (
    <Section
      title={t('membersCount', { count: group.participants.length })}
      action={
        <Button size="sm" variant="ghost" icon={<UserPlus size={18} />} onClick={() => setIsAddOpen(true)}>
          {t('addMembers')}
        </Button>
      }
    >
      <Card>
        {group.participants.map(member => (
          <ListRow
            key={member.id}
            leading={<Avatar name={getDisplayName(member)} src={getFileUrl(member.avatarId)} />}
            title={member.id === userId ? t('you', { name: getDisplayName(member) }) : getDisplayName(member)}
            subtitle={member.email}
            trailing={
              member.id !== userId && (
                <Button size="sm" variant="danger" onClick={() => setMemberToRemove(member)}>
                  {t('remove')}
                </Button>
              )
            }
          />
        ))}
      </Card>

      <AddMemberDialog
        open={isAddOpen}
        groupId={group.id}
        memberIds={group.participants.map(member => member.id)}
        onClose={() => setIsAddOpen(false)}
      />

      <ConfirmDialog
        open={memberToRemove !== null}
        title={t('removeMemberTitle')}
        message={t('removeMemberMessage', { name: memberToRemove ? getDisplayName(memberToRemove) : '' })}
        confirmLabel={t('remove')}
        destructive
        loading={isRemoving}
        onConfirm={handleRemove}
        onClose={() => setMemberToRemove(null)}
      />
    </Section>
  );
};

const GroupSettingsPage = () => {
  const { t } = useTranslation('groups');
  const { groupId } = useParams();
  const { data: group, isLoading } = useGetGroupQuery(groupId ?? '', { skip: !groupId });

  const isNew = !groupId;

  return (
    <Screen
      topBar={
        <TopBar
          title={isNew ? t('newGroup') : t('groupSettings')}
          back={groupId ? routes.group(groupId) : routes.groups}
        />
      }
    >
      {isLoading ? (
        <PageSpinner />
      ) : (
        <>
          {/* Keyed so the form re-initialises when the loaded group changes. */}
          <GroupDetailsForm key={group?.id ?? 'new'} group={group} />
          {group && <MembersSection group={group} />}
        </>
      )}
    </Screen>
  );
};

export default GroupSettingsPage;
