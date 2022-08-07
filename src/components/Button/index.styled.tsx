import styled, {css} from 'styled-components';

interface ButtonProps {
  disabled?: boolean;
}

export const ButtonStyled = styled.button<ButtonProps>`
  height: 52px;
  background: ${props => props.theme.colors.button.primary};
  box-shadow: 0px 0px 4px 1px ${props => props.theme.colors.button.shadow};
  border-radius: 50px;
  border: none;
  
  padding: 15px 33px;
  font-weight: 700;
  font-size: 18px;
  color: ${props => props.theme.colors.text.secondary};
  
  &:active {
    transition: 0.1s;
    transform: scale(1.02, 1.05);
    background: ${props => props.theme.colors.button.focused};
  }

  ${props => props.disabled && css`
    background: ${props => props.theme.colors.button.disabled};
    opacity: 1;
  `};
`;
