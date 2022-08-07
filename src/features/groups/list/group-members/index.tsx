
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../../components/Button';
import { Column, Row } from '../../../../components/Containers';
import { TextRegular } from '../../../../components/Text';
import AddAvatarSVG from '../../../../assets/images/add-avatar.svg';
import { Avatar, ContentWrapper } from './index.styled';
import { useGetTransactionGroupByIdQuery } from '../../api';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export interface IGroupMembersProps {
  groupId: string
}

const GroupMembers = ({ groupId }: IGroupMembersProps) => {
  const { t } = useTranslation('groups');

  const { data } = useGetTransactionGroupByIdQuery(groupId);

  const onAddMember = useCallback(() => {

  }, []);

  return (
    <ContentWrapper jc={'space-between'} fullWidth>
      <Column fullWidth>
        {data?.participants?.map(p =>
          <Row key={p.id} jc={'space-between'} ai={'center'} fullWidth>
            {
              !!p.avatarId &&
              <Avatar src={`${BASE_URL}storage/${p.avatarId}`} alt={`${BASE_URL}storage/${p.avatarId}`} />
            }

            {
              !p.avatarId &&
              <Avatar src={AddAvatarSVG} alt={AddAvatarSVG} />
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
          data?.participants?.length === 0 ?
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
