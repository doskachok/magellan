import { LeftActionWrapper, RightActionWrapper, HeaderTextWrapper, Wrapper } from './index.styled';
import TinyLoader from '../TinyLoader';

import { ReactElement } from 'react';
import { Column } from '../Containers';
import { getDownloadFileUrl } from 'helpers/urlHelper';
import Avatar from 'components/Avatar';
import { AvatarSize } from 'components/Avatar/index.styled';
interface Props {
  text: string;
  isLoading?: boolean;
  leftActionComponent?: ReactElement<any> | null;
  rightActionComponent?: ReactElement<any> | null;
  avatarId?: string;
}

const Header = ({ text, leftActionComponent, rightActionComponent, avatarId, isLoading = false }: Props) => {
  return (
    <Column fullWidth>
      <Wrapper jc={'space-between'} ai={'center'}>
        <LeftActionWrapper>
          {leftActionComponent}
        </LeftActionWrapper>

        {
          !!avatarId &&
          <Avatar
            src={getDownloadFileUrl(avatarId)}
            rounded={true}
            size={AvatarSize.Small}
          />
        }

        <HeaderTextWrapper>
          {text}
        </HeaderTextWrapper>

        <RightActionWrapper>
          {rightActionComponent}
        </RightActionWrapper>
      </Wrapper>

      <TinyLoader isLoading={isLoading} />
    </Column>
  );
};

export default Header;
