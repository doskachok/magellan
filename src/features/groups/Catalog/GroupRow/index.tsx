import { memo } from 'react';
import { ITransactionGroupListItem } from '../../types';
import { getDownloadFileUrl } from 'helpers/urlHelper';
import { Avatar, AvatarSize } from 'components';
import { RowWrapperLink } from 'components/Link';
import { GroupName, GroupRowWrapper } from './index.styled';

import { composeGroupRoute } from 'constants/routes';

export interface IGroupRowProps {
  item: ITransactionGroupListItem,
}

const GroupRow = ({ item }: IGroupRowProps) => {
  return (
    <RowWrapperLink to={composeGroupRoute(item.id)}>
      <GroupRowWrapper ai="center" fullWidth>
        <Avatar
          src={getDownloadFileUrl(item.avatarId)}
          rounded={true}
          size={AvatarSize.Small}
        />
        <GroupName>
          {item.name}
        </GroupName>
      </GroupRowWrapper>
    </RowWrapperLink>
  );
};

export default memo(GroupRow);
