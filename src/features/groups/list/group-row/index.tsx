
import { GroupLogo, GroupName, GroupRowWrapper } from './index.styled';
import { memo, useCallback } from 'react';
import { ITransactionGroupListItem } from '../../types';

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
      <GroupLogo src={'https://picsum.photos/200/300?random=' + item.id}/>
      <GroupName>
        {item.name}
      </GroupName>
    </GroupRowWrapper>
  );
};

export default memo(GroupRow);
