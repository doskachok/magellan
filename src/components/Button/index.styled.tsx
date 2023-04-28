import styled, {css} from 'styled-components';

interface ButtonProps {
  disabled?: boolean;
}

export const ButtonBase = styled.button`
  background: transparent;
  margin: 0;
  padding: 0;
  border: none;
  font-weight: 700;
  font-size: 18px;
  color: ${props => props.theme.colors.text.secondary};

  display: inline-flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;

  &:disabled p {
    color: ${props => props.theme.colors.input.disabled.default};
  }
`;

export const ButtonStyled = styled(ButtonBase)<ButtonProps>`
  height: 52px;
  background: ${props => props.theme.colors.button.primary};
  box-shadow: 0px 0px 4px 1px ${props => props.theme.colors.button.shadow};
  border-radius: 50px; 
  padding: 15px 33px;
  
  ${props => !props.disabled && css 
    `&:active {
      transition: 0.1s;
      transform: scale(1.02, 1.05);
      background: ${props => props.theme.colors.button.focused};
    }`
  };

  &:disabled {
    background: ${props => props.theme.colors.button.disabled};
    color: ${props => props.theme.colors.text.secondary};
    opacity: 1;
  }
`;