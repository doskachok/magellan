import { LeftActionWrapper, RightActionWrapper, HeaderTextWrapper, Wrapper } from './index.styled';
import TinyLoader from '../TinyLoader';

import { ReactElement } from 'react';
import { Column } from '../Containers';

interface Props {
  text: string;
  isLoading?: boolean;
  leftActionComponent?: ReactElement<any> | null;
  rightActionComponent?: ReactElement<any> | null;
}

const Header = ({ text, leftActionComponent, rightActionComponent, isLoading = false }: Props) => {
  return (
    <Column fullWidth>
      <Wrapper jc={'space-between'} ai={'center'}>
        <LeftActionWrapper>
          {leftActionComponent}
        </LeftActionWrapper>

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
