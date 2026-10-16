import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import styled from 'styled-components';

import { Avatar, Button, Card, Dialog, ListRow, Muted, SectionTitle, Spinner, TextField } from 'components';
import { getFileUrl } from 'lib/config';
import { useDebouncedValue } from 'lib/useDebouncedValue';
import { useGetKnownUsersQuery, useSearchUsersQuery } from 'features/users/api';
import { getDisplayName, type User } from 'features/users/types';
import { useAddParticipantMutation } from './api';

const MIN_QUERY_LENGTH = 3;

const SearchIcon = styled(Search)`
  margin-right: ${({ theme }) => theme.space(2.5)};
`;

const Results = styled(Card)`
  max-height: 360px;
  overflow-y: auto;
`;

interface AddMemberDialogProps {
  open: boolean;
  groupId: string;
  memberIds: string[];
  onClose: () => void;
}

export const AddMemberDialog = ({ open, groupId, memberIds, onClose }: AddMemberDialogProps) => {
  const { t } = useTranslation('groups');
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query.trim());
  const isSearching = debouncedQuery.length >= MIN_QUERY_LENGTH;

  const { data: knownUsers = [], isLoading: isKnownLoading } = useGetKnownUsersQuery(undefined, { skip: !open });
  const { data: searchResults = [], isFetching: isSearchFetching } = useSearchUsersQuery(debouncedQuery, {
    skip: !open || !isSearching,
  });
  const [addParticipant, { isLoading: isAdding, originalArgs }] = useAddParticipantMutation();

  const candidates = useMemo(() => {
    const source = isSearching ? searchResults : knownUsers;
    return source.filter(user => !memberIds.includes(user.id));
  }, [isSearching, searchResults, knownUsers, memberIds]);

  const handleAdd = async (user: User) => {
    const result = await addParticipant({ groupId, userId: user.id });
    if ('data' in result) toast.success(t('memberAdded', { name: getDisplayName(user) }));
  };

  const handleClose = () => {
    setQuery('');
    onClose();
  };

  const isLoading = isSearching ? isSearchFetching : isKnownLoading;

  return (
    <Dialog open={open} title={t('addMembers')} onClose={handleClose}>
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
                  icon={<UserPlus size={16} />}
                  loading={isAdding && originalArgs?.userId === user.id}
                  onClick={() => handleAdd(user)}
                >
                  {t('add')}
                </Button>
              }
            />
          ))}
        </Results>
      )}
    </Dialog>
  );
};
