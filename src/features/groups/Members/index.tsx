import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { Column, Row } from 'components/Containers';
import { ContentWrapper } from './index.styled';
import { useGetTransactionGroupByIdQuery } from '../api';
import { getDownloadFileUrl } from 'helpers/urlHelper';
import { Image, ImageSize, TextRegular, Button } from 'components';

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
            <Image 
              src={getDownloadFileUrl(p.avatarId)}
              framed={false}
              size={ImageSize.Small}
            />

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
