import { memo, MouseEvent } from 'react';
import { getDownloadFileUrl } from 'helpers/urlHelper';
import { IUser } from 'types/userTypes';
import { UserNameOrEmail, Wrapper } from './index.styled';
import { Avatar, AvatarSize } from 'components';

export interface IProps {
  user: IUser;
  underlined?: boolean;
  onClick?: (e?: MouseEvent<HTMLDivElement>) => void;
}

const UserRow = ({ user, underlined, onClick }: IProps) => {
  return (
    <Wrapper onClick={onClick}>
      <Avatar
        src={getDownloadFileUrl(user.avatarId)}
        rounded={true}
        size={AvatarSize.Small}
      />

      <UserNameOrEmail underlined={underlined} >
        {user.name || user.email}
      </UserNameOrEmail>
    </Wrapper>
  );
};

export default memo(UserRow);