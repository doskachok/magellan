import {  LeftActionWrapper, RightActionWrapper, HeaderTextWrapper, Wrapper } from './index.styled';

import { ReactElement } from 'react';

interface Props {
  text: string;
  leftActionComponent?: ReactElement<any> | null;
  rightActionComponent?: ReactElement<any> | null;
}

const Header = ({ text, leftActionComponent, rightActionComponent }: Props) => {
  return (
    <Wrapper jc={'space-between'} ai={'flex-end'}>
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
  );
};

export default Header;
