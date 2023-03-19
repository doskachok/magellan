import Autocomplete, { IAutocompleteSuggestion } from 'components/Autocomplete';
import { Column } from 'components/Containers';
import Loader from 'components/Loader';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetKnownsUsersQuery, useLazyGetUsersQuery } from 'store/user.api';
import { IUser } from 'types/userTypes';
import { MembersModalBody, ModalBodyElementWrapper, ModalSeparator, ModalText } from './index.styled';
import UserRow from './UserRow';

export interface IProps {
  onMemberSelected: (member: IUser) => void;
}

const AddMemberModal = ({ onMemberSelected }: IProps) => {
  const { t } = useTranslation('groups');

  const [getUsers] = useLazyGetUsersQuery();
  const { data: knownsUsers, isLoading: isKnownsUsersLoading } = useGetKnownsUsersQuery();

  const handleSuggestionSelected = useCallback((suggestion: IAutocompleteSuggestion) => {
    const user = suggestion as IUser;
    onMemberSelected(user);
  }, [onMemberSelected]);

  const suggestionTemplate = useCallback((suggestion: IAutocompleteSuggestion) => {
    return <UserRow user={suggestion as IUser} />
  }, []);

  const usersSearchSource = (searchQuery: string) => new Promise<IUser[]>((resolve, reject) => {
    getUsers(searchQuery)
      .then(data => resolve(data.data || []))
      .catch(err => reject(err));
  });
  
  return (
    <Column>
      <MembersModalBody rounded={true}>
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

          <Column fullWidth gap={'0.5rem'}>
            {knownsUsers?.map(u => <UserRow key={u.id} user={u} onClick={() => onMemberSelected(u)} />)}
          </Column>
          
          <Loader isLoading={isKnownsUsersLoading} />
          {!!knownsUsers && knownsUsers.length === 0 && <ModalText>{t('noAlreadyKnownUsers')}</ModalText>}
        </ModalBodyElementWrapper>
      </MembersModalBody>
    </Column>
  );
};

export default memo(AddMemberModal);