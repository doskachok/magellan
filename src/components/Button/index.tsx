import {ReactElement} from 'react';
import {ButtonStyled} from './index.styled';

interface Props {
  onClick: () => void;
  children: ReactElement[] | string;
  disabled: boolean;
  type?: "button" | "submit" | "reset" | undefined
}

const Button = ({children, onClick, disabled, type}: Props) => {
  return (
    <ButtonStyled type={type} onClick={onClick} disabled={disabled}>
      {children}
    </ButtonStyled>
  );
}

export default Button;
