import { useMemo, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, UserCheck, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import styled from 'styled-components';

import { Avatar, Button, Card, Dialog, ListRow, Muted, SectionTitle, Spinner, TextField } from 'components';
import { getFileUrl } from 'lib/config';
import { useDebouncedValue } from 'lib/useDebouncedValue';
import { useGetKnownUsersQuery, useSearchUsersQuery } from 'features/users/api';
import { getDisplayName, type User } from 'features/users/types';
import { useAddParticipantMutation, useAddPlaceholderMutation, useReplacePlaceholderMutation } from './api';

const MIN_QUERY_LENGTH = 3;
const PLACEHOLDER_NAME_MAX = 64;

const SearchIcon = styled(Search)`
  margin-right: ${({ theme }) => theme.space(2.5)};
`;

const Results = styled(Card)`
  max-height: 360px;
  overflow-y: auto;
`;

const PlaceholderForm = styled.form`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.space(2)};

  & > :first-child {
    flex: 1;
  }

  & > button {
    margin-top: 0;
    min-height: 48px;
  }
`;

interface AddMemberDialogProps {
  open: boolean;
  groupId: string;
  memberIds: string[];
  /** Pick the registered person who takes over this placeholder, instead of adding people. */
  replacing?: User;
  onClose: () => void;
}

export const AddMemberDialog = ({ open, groupId, memberIds, replacing, onClose }: AddMemberDialogProps) => {
  const { t } = useTranslation('groups');
  const [query, setQuery] = useState('');
  const [placeholderName, setPlaceholderName] = useState('');
  const debouncedQuery = useDebouncedValue(query.trim());
  const isSearching = debouncedQuery.length >= MIN_QUERY_LENGTH;

  const { data: knownUsers = [], isLoading: isKnownLoading } = useGetKnownUsersQuery(undefined, { skip: !open });
  const { data: searchResults = [], isFetching: isSearchFetching } = useSearchUsersQuery(debouncedQuery, {
    skip: !open || !isSearching,
  });
  const [addParticipant, { isLoading: isAdding, originalArgs }] = useAddParticipantMutation();
  const [addPlaceholder, { isLoading: isAddingPlaceholder }] = useAddPlaceholderMutation();
  const [replacePlaceholder, { isLoading: isReplacing, originalArgs: replaceArgs }] = useReplacePlaceholderMutation();

  const candidates = useMemo(() => {
    const source = isSearching ? searchResults : knownUsers;
    return source.filter(user => !memberIds.includes(user.id));
  }, [isSearching, searchResults, knownUsers, memberIds]);

  const handleClose = () => {
    setQuery('');
    setPlaceholderName('');
    onClose();
  };

  const handlePick = async (user: User) => {
    if (replacing) {
      const result = await replacePlaceholder({ groupId, placeholderId: replacing.id, userId: user.id });
      if ('error' in result) return;
      toast.success(t('placeholderReplaced', { placeholder: getDisplayName(replacing), name: getDisplayName(user) }));
      handleClose();
      return;
    }
    const result = await addParticipant({ groupId, userId: user.id });
    if ('data' in result) toast.success(t('memberAdded', { name: getDisplayName(user) }));
  };

  const handleAddPlaceholder = async (event: FormEvent) => {
    event.preventDefault();
    const name = placeholderName.trim();
    if (!name) return;
    const result = await addPlaceholder({ groupId, name });
    if ('error' in result) return;
    toast.success(t('memberAdded', { name }));
    setPlaceholderName('');
  };

  const isLoading = isSearching ? isSearchFetching : isKnownLoading;
  const isPicking = (user: User) => (replacing ? isReplacing && replaceArgs?.userId === user.id : isAdding && originalArgs?.userId === user.id);

  return (
    <Dialog open={open} title={replacing ? t('replaceTitle', { name: getDisplayName(replacing) }) : t('addMembers')} onClose={handleClose}>
      {replacing && <Muted>{t('replaceDescription', { name: getDisplayName(replacing) })}</Muted>}

      <TextField
        label={t('searchPeople')}
        hideLabel
        type="search"
        placeholder={t('searchPlaceholder')}
        autoComplete="off"
        autoCapitalize="none"
        value={query}
        onChange={event => setQuery(event.target.value)}
        suffix={<SearchIcon size={20} aria-hidden />}
        hint={query.trim().length > 0 && !isSearching ? t('searchHint', { count: MIN_QUERY_LENGTH }) : undefined}
      />

      <SectionTitle>{isSearching ? t('searchResults') : t('peopleYouKnow')}</SectionTitle>

      {isLoading ? (
        <Spinner label={t('loading', { ns: 'common' })} />
      ) : candidates.length === 0 ? (
        <Muted>{isSearching ? t('noSearchResults') : t('noKnownPeople')}</Muted>
      ) : (
        <Results>
          {candidates.map(user => (
            <ListRow
              key={user.id}
              leading={<Avatar name={getDisplayName(user)} src={getFileUrl(user.avatarId)} size={36} />}
              title={getDisplayName(user)}
              subtitle={user.email}
              trailing={
                <Button
                  size="sm"
                  variant="secondary"
                  icon={replacing ? <UserCheck size={16} /> : <UserPlus size={16} />}
                  loading={isPicking(user)}
                  onClick={() => void handlePick(user)}
                >
                  {replacing ? t('choose') : t('add')}
                </Button>
              }
            />
          ))}
        </Results>
      )}

      {!replacing && (
        <>
          <SectionTitle>{t('addPlaceholder')}</SectionTitle>
          <PlaceholderForm onSubmit={event => void handleAddPlaceholder(event)}>
            <TextField
              label={t('placeholderName')}
              hideLabel
              placeholder={t('placeholderName')}
              autoComplete="off"
              maxLength={PLACEHOLDER_NAME_MAX}
              value={placeholderName}
              onChange={event => setPlaceholderName(event.target.value)}
              hint={t('placeholderHint')}
            />
            <Button type="submit" variant="secondary" disabled={!placeholderName.trim()} loading={isAddingPlaceholder}>
              {t('add')}
            </Button>
          </PlaceholderForm>
        </>
      )}
    </Dialog>
  );
};
