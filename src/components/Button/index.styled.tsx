import styled, {css} from 'styled-components';

interface ButtonProps {
  disabled?: boolean;
}

export const ButtonStyled = styled.button<ButtonProps>`
  height: 52px;
  background: #00A862;
  box-shadow: 0px 0px 4px 1px rgba(0, 0, 0, 0.25);
  border-radius: 50px;
  border: none;
  
  padding: 15px 33px;
  font-weight: 700;
  font-size: 18px;
  color: #FFFFFF;
  
  ${props => props.disabled && css`
    background: #C4C4C4;
    opacity: 1;
  `};
`;
