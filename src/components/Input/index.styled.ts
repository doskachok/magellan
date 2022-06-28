import styled, {css} from 'styled-components';
import {TextRegular} from '../Text';

interface InputProps {
  hasError?: boolean;
}

export const TextError = styled(TextRegular)`
  color: #FF2121;
`;

export const InputStyled = styled.input<InputProps>`
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  height: 48px;
  width: 100%;
  padding: 11px 18px 15px;
  
  margin-top: 23px;

  font-weight: 500;
  font-size: 18px;
  color: #000000;
  
  ::placeholder {
    font-weight: 300;
    color: #000000;
  }
  
  ${props => props.hasError && css`
    margin-top: 4px;
    border-color: #FF2121;
  `};
`;
