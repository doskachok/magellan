
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../../components/Button';
import { Column, Row } from '../../../../components/Containers';
import { TextRegular } from '../../../../components/Text';
import { ITransactionGroup } from '../../types';
import addAvatar from '../../../../assets/images/add-avatar.png';

import { Avatar, ContentWrapper } from './index.styled';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export interface IGroupMembersProps {
  group: ITransactionGroup
}

const GroupMembers = ({ group }: IGroupMembersProps) => {
  const { t } = useTranslation('groups');

  const onAddMember = useCallback(() => {

  }, []);

  return (
    <ContentWrapper jc={'space-between'} fullWidth>
      <Column fullWidth>
        {group.participants.map(p =>
          <Row key={p.id} jc={'space-between'} ai={'center'} fullWidth>
            {
              !!p.avatarId &&
              <Avatar src={`${BASE_URL}storage/${p.avatarId}`} alt={`${BASE_URL}storage/${p.avatarId}`} />
            }
            
            {
              !p.avatarId &&
              <Avatar src={addAvatar} alt={addAvatar} />
            }

            <TextRegular>
              {p.name || p.email}
            </TextRegular>

            <TextRegular>
              $0.0
            </TextRegular>
          </Row>
        )}

        {
          group.participants.length === 0 ?
            <Row jc={'center'} fullWidth>
              <TextRegular>
                {t('noMembers')}
              </TextRegular>
            </Row>
            : null
        }
      </Column>

      <Row jc={'flex-end'} fullWidth>
        <Button disabled={false} onClick={onAddMember}>
          {t('addMembers')}
        </Button>
      </Row>
    </ContentWrapper>
  );
};

export default memo(GroupMembers);
