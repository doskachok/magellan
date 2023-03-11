import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { Column, Row } from 'components/Containers';
import { ContentWrapper } from './index.styled';
import { getDownloadFileUrl } from 'helpers/urlHelper';
import { Avatar, AvatarSize, TextRegular, Button } from 'components';
import {ITransactionGroup} from '../types';
import { useModal } from 'providers/ModalProvider';
import AddMemberModal from './AddMemberModal';

export interface IGroupMembersProps {
  group: ITransactionGroup | undefined;
}

const GroupMembers = ({ group }: IGroupMembersProps) => {
  const { t } = useTranslation('groups');
  const modalContext = useModal();

  const onAddMember = useCallback(() => {
    modalContext.showModal(<AddMemberModal />);
  }, [modalContext]);

  return (
    <ContentWrapper jc={'space-between'} fullWidth>
      <Column fullWidth>
        {group?.participants?.map(p =>
          <Row key={p.id} jc={'space-between'} ai={'center'} fullWidth>
            <Avatar 
              src={getDownloadFileUrl(p.avatarId)}
              rounded={true}
              size={AvatarSize.Small}
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
          group?.participants?.length === 0 ?
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
