import { LeftActionWrapper, RightActionWrapper, HeaderTextWrapper, Wrapper } from './index.styled';
import TinyLoader from '../TinyLoader';

import { ReactElement } from 'react';

interface Props {
  text: string;
  isLoading?: boolean | null;
  leftActionComponent?: ReactElement<any> | null;
  rightActionComponent?: ReactElement<any> | null;
}

const Header = ({ text, leftActionComponent, rightActionComponent, isLoading }: Props) => {
  return (
    <div style={{ width: "100%" }}>
      <Wrapper jc={"space-between"} ai={"flex-end"}>
        <LeftActionWrapper>{leftActionComponent}</LeftActionWrapper>

        <HeaderTextWrapper>{text}</HeaderTextWrapper>

        <RightActionWrapper>{rightActionComponent}</RightActionWrapper>
      </Wrapper>

      <TinyLoader isLoading={isLoading ?? false} />
    </div>
  );
};

export default Header;
