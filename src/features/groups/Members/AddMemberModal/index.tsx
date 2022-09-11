import { memo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Autocomplete from '../../../../components/Autocomplete';
import { useLazyGetKnownsUsersQuery, useLazyGetUsersQuery } from '../../../../store/user.api';
import { IUser } from '../../../../types/user-types';
import UserRow from '../UserRow';
import { MembersModalBody, ModalBodyElementWrapper, ModalSeparator, ModalText, ModalWrapper } from './index.styled';
import Loader from '../../../../components/Loader';
import { Column } from '../../../../components/Containers';

export interface IProps {
  onMemberSelected: (member: IUser) => void;
}

const AddMemberModal = ({ onMemberSelected }: IProps) => {
  const { t } = useTranslation('groups');

  const [getUsers] = useLazyGetUsersQuery();

  const [getKnownsUsers, { data: knownsUsers, isLoading: isKnownsUsersLoading }] = useLazyGetKnownsUsersQuery();

  const handleSuggestionSelected = useCallback((suggestion: IUser) => {
    onMemberSelected(suggestion);
  }, [onMemberSelected]);

  const suggestionTemplate = useCallback((suggestion: IUser) => {
    return <UserRow reversedTheme={true} user={suggestion} />
  }, []);

  const usersSearchSource = (searchQuery: string) => new Promise<IUser[]>((resolve, reject) => {
    getUsers(searchQuery)
      .then(data => resolve(data.data || []))
      .catch(err => reject(err));
  });

  useEffect(() => {
    getKnownsUsers();
  }, [getKnownsUsers]);

  return (
    <ModalWrapper>
      <MembersModalBody isSingle={true}>
        <ModalBodyElementWrapper>
          <ModalText>{t('findNewPeopleHere')}</ModalText>

          <Autocomplete
            placeholder={t('enterUsernameOrEmail')}
            reversedTheme={true}
            suggestionsSource={usersSearchSource}
            onSuggestionSelected={handleSuggestionSelected}
            suggestionTemplate={suggestionTemplate} />
        </ModalBodyElementWrapper>

        <ModalSeparator />

        <ModalBodyElementWrapper>
          <ModalText>{t('orLookAlreadyKnown')}</ModalText>

          <Loader isLoading={isKnownsUsersLoading} />

          <Column fullWidth gap={'0.5rem'}>
            {knownsUsers?.map(u => <UserRow reversedTheme={true} key={u.id} user={u} onClick={() => onMemberSelected(u)} />)}
          </Column>

          {!!knownsUsers && knownsUsers.length === 0 && <ModalText>{t('noAlreadyKnownUsers')}</ModalText>}
        </ModalBodyElementWrapper>
      </MembersModalBody>
    </ModalWrapper>
  );
};

export default memo(AddMemberModal);
