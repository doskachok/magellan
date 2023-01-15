import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Autocomplete from '../../../../components/Autocomplete';
import { useGetKnownsUsersQuery, useLazyGetUsersQuery } from '../../../../store/user.api';
import { IUser } from '../../../../types/user-types';
import UserRow from '../UserRow';
import { MembersModalBody, ModalBodyElementWrapper, ModalSeparator, ModalText, ModalWrapper } from './index.styled';
import Loader from '../../../../components/Loader';
import { Column } from '../../../../components/Containers';
import { IAutocompleteSuggestion } from '../../../../components/Autocomplete/types';

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
    return <UserRow reversedTheme={true} user={suggestion as IUser} />
  }, []);

  const usersSearchSource = (searchQuery: string) => new Promise<IUser[]>((resolve, reject) => {
    getUsers(searchQuery)
      .then(data => resolve(data.data || []))
      .catch(err => reject(err));
  });

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
