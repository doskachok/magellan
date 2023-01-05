import {AvatarSize, ImageStyled} from './index.styled';
import Placeholder from '../../assets/images/add-avatar.svg';

interface Props {
  src?: string | null;
  rounded?: boolean;
  framed?: boolean;
  size?: AvatarSize
  placeholder?: string | null;
}

const Avatar = ({src, rounded = false, framed = false, size = 0, placeholder = Placeholder }: Props) => {
  return (
    <ImageStyled rounded={rounded} framed={framed} size={size}>
        <img src={src || placeholder!} alt="Img" />
    </ImageStyled>
  )
}

export default Avatar;