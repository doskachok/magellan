import {ReactElement} from 'react';
import {ButtonStyled} from './index.styled';

interface Props {
  onClick: () => void;
  children: ReactElement[] | string;
  disabled: boolean;
}

const Button = ({children, onClick, disabled}: Props) => {
  return (
    <ButtonStyled onClick={onClick} disabled={disabled}>
      {children}
    </ButtonStyled>
  );
}

export default Button;
