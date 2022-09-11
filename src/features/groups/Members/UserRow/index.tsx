import { memo, MouseEvent } from 'react';
import { getDownloadFileUrl } from '../../../../helpers/urlHelper';
import { Avatar, UserNameOrEmail, Wrapper } from './index.styled';
import AddAvatarSVG from '../../../../assets/images/add-avatar.svg';
import { IUser } from '../../../../types/user-types';

export interface IProps {
  user: IUser;
  reversedTheme?: boolean;
  onClick?: (e?: MouseEvent<HTMLDivElement>) => void;
}

const UserRow = ({ user, reversedTheme, onClick }: IProps) => {
  return (
    <Wrapper onClick={onClick}>
      <Avatar src={user.avatarId ? getDownloadFileUrl(user.avatarId) : AddAvatarSVG} alt={'avatar'} />

      <UserNameOrEmail reversedTheme={reversedTheme}>
        {user.name || user.email}
      </UserNameOrEmail>
    </Wrapper>
  );
};

export default memo(UserRow);
