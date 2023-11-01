import { memo, MouseEvent, ReactElement } from 'react';
import { getDownloadFileUrl } from 'helpers/urlHelper';
import { IUser } from 'types/userTypes';
import { Avatar, AvatarSize, TextHint, TextRegular } from 'components';

import { Row } from 'components/Containers';
import { Wrapper } from './index.styled';

export interface IProps {
  user: IUser;
  reversedTheme?: boolean;
  onClick?: (e?: MouseEvent<HTMLDivElement>) => void;
  rightItem?: ReactElement<any> | null; 
}

const UserListItem = ({ user, reversedTheme, onClick, rightItem }: IProps) => {
  return (
    <Row jc={'space-between'} ai={'center'} fullWidth onClick={onClick}>
      <Row jc='flex-start' ai='center' gap='10px'>
        <Avatar
          src={getDownloadFileUrl(user.avatarId)}
          rounded={true}
          size={AvatarSize.Small}
        />

        <Wrapper gap='3px' reversedTheme={reversedTheme}>
          <TextRegular>
            {user.name || user.username}
          </TextRegular>
          <TextHint>
            {user.email}
          </TextHint>
        </Wrapper>
      </Row>

      <Row jc='flex-end' ai='center'>
        {!!rightItem && rightItem}
      </Row>
    </Row>
  );
};

export default memo(UserListItem);