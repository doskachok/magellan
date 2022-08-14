
import { GroupLogo, GroupName, GroupRowWrapper } from './index.styled';
import { memo, useCallback } from 'react';
import { ITransactionGroupListItem } from '../../types';
import AddAvatarSVG from '../../../../assets/images/add-avatar.svg';
import { getDownloadFileUrl } from '../../../../helpers/urlHelper';

export interface IGroupRowProps {
  item: ITransactionGroupListItem,
  onClick?: (item: ITransactionGroupListItem) => void;
}

const GroupRow = ({ item, onClick }: IGroupRowProps) => {
  const onRowClick = useCallback(() => {
    onClick && onClick(item);
  }, [onClick, item]);

  return (
    <GroupRowWrapper onClick={onRowClick} ai="center" fullWidth>
      <GroupLogo src={item.avatarId ? getDownloadFileUrl(item.avatarId) : AddAvatarSVG}/>
      <GroupName>
        {item.name}
      </GroupName>
    </GroupRowWrapper>
  );
};

export default memo(GroupRow);
