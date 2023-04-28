import { memo, MouseEvent, ReactElement } from 'react';
import { getDownloadFileUrl } from 'helpers/urlHelper';
import { IUser } from 'types/userTypes';
import { Avatar, AvatarSize } from 'components';

import { UserNameOrEmail } from './index.styled';
import { Row } from 'components/Containers';

export interface IProps {
  user: IUser;
  underlined?: boolean;
  onClick?: (e?: MouseEvent<HTMLDivElement>) => void;
  rightItem?: ReactElement<any> | null; 
}

const UserListItem = ({ user, underlined, onClick, rightItem }: IProps) => {
  return (
    <Row jc={'space-between'} ai={'center'} fullWidth onClick={onClick}>
      <Row jc='flex-start' ai='center' gap='10px'>
        <Avatar
          src={getDownloadFileUrl(user.avatarId)}
          rounded={true}
          size={AvatarSize.Small}
        />

        <UserNameOrEmail underlined={underlined} >
          {user.name || user.email}
        </UserNameOrEmail>
      </Row>

      <Row jc='flex-end' ai='center'>
        {!!rightItem && rightItem}
      </Row>
    </Row>
  );
};

export default memo(UserListItem);