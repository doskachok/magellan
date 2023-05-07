import { ReactElement, memo } from 'react';
import { SplitMethodButtonWrapper } from './SplitMethod.styled';
import { ButtonBase, SmallText } from 'components';
import { Column, Row } from 'components/Containers';

interface ISplitMethodButtonProps {
  text: string;
  svgImg: ReactElement;
  onClick?: () => void;
}

const SplitMethodButton = memo(({ text, svgImg, onClick }: ISplitMethodButtonProps) => {
  return (
    <SplitMethodButtonWrapper>
      <ButtonBase onClick={onClick}>
        <Column>
          <Row fullWidth jc="center">
            {svgImg}
          </Row>
          <SmallText reversedColor>
            {text}
          </SmallText>
        </Column>
      </ButtonBase>
    </SplitMethodButtonWrapper>
  );
});

export default SplitMethodButton;