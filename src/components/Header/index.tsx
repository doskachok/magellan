import {Wrapper} from './index.styled';

import {TextHeader} from '../Text';

interface Props {
  text: string;
}

const Header = ({text}: Props) => {
  return (
    <Wrapper jc={'center'} ai={'flex-end'}>
      <TextHeader>
        {text}
      </TextHeader>
    </Wrapper>
  );
};

export default Header;
