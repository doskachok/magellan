import Autocomplete, { IAutocompleteSuggestion } from 'components/Autocomplete';
import { Column } from 'components/Containers';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetKnownsUsersQuery, useLazyGetUsersQuery } from 'store/user.api';
import { IUser } from 'types/userTypes';
import { ModalBody, TextRegular, UserListItem, Loader } from 'components';
import styles from './index.module.css'

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
    return <UserListItem user={suggestion as IUser} />
  }, []);

  const usersSearchSource = (searchQuery: string) => new Promise<IUser[]>((resolve, reject) => {
    getUsers(searchQuery)
      .then(data => resolve(data.data || []))
      .catch(err => reject(err));
  });

  return (
    <Column>
      <ModalBody reversedColor rounded className={styles.searchModal}>
        <div className={styles.searchBar}>
          <TextRegular reversedColor className={styles.searchText}>
            {t('findNewPeopleHere')}
          </TextRegular>

          <Autocomplete
            reversedTheme
            placeholder={t('enterUsernameOrEmail')}
            suggestionsSource={usersSearchSource}
            onSuggestionSelected={handleSuggestionSelected}
            suggestionTemplate={suggestionTemplate} 
          />

          <div className={styles.separator} />

          <TextRegular reversedColor className={styles.searchText}>
            {t('orLookAlreadyKnown')}
          </TextRegular>

          <Column fullWidth gap={'0.5rem'}>
            {knownsUsers?.map(u => <UserListItem key={u.id} reversedTheme user={u} onClick={() => onMemberSelected(u)} />)}
          </Column>

          <Loader isLoading={isKnownsUsersLoading} />
          {!!knownsUsers && knownsUsers.length === 0 && 
            <TextRegular reversedColor className={styles.searchText}>
              {t('noAlreadyKnownUsers')}
            </TextRegular>
          }
        </div>
      </ModalBody>
    </Column>
  );
};

export default memo(AddMemberModal);