import {ImageSize, ImageStyled} from './index.styled';
import Placeholder from '../../assets/images/add-avatar.svg';

interface Props {
  src?: string | null;
  rounded?: boolean;
  framed?: boolean;
  size?: ImageSize
}

const Image = ({src, rounded = true, framed = true, size = 0 }: Props) => {
  return (
    <ImageStyled rounded={rounded} framed={framed} size={size}>
        <img src={src || Placeholder} alt="Img" />
    </ImageStyled>
  )
}

export default Image;