import {  LeftActionWrapper, RightActionWrapper, HeaderTextWrapper, Wrapper } from './index.styled';

import { ReactElement } from 'react';

interface Props {
  text: string;
  leftActionComponent?: (() => ReactElement<any>) | null;
  rightActionComponent?: (() => ReactElement<any>) | null;
}

const Header = ({ text, leftActionComponent, rightActionComponent }: Props) => {
  const leftAction = leftActionComponent ? leftActionComponent() : null;
  const rightAction = rightActionComponent ? rightActionComponent() : null;

  return (
    <Wrapper jc={'space-between'} ai={'flex-end'}>
      <LeftActionWrapper>
        {leftAction}
      </LeftActionWrapper>

      <HeaderTextWrapper>
        {text}
      </HeaderTextWrapper>

      <RightActionWrapper>
        {rightAction}
      </RightActionWrapper>

    </Wrapper>
  );
};

export default Header;
