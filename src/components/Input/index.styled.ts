import styled, {css} from 'styled-components';
import {TextRegular} from '../Text';

import {Column} from '../Containers';

interface InputProps {
  hasError?: boolean;
}

export const Wrapper = styled(Column)`
  position: relative;
`;

export const RequiredIndicator = styled(TextRegular)`
  color: ${props => props.theme.colors.primary};
  position: absolute;
  top: 32px;
  left: 8px;
`;

export const TextError = styled(TextRegular)`
  color: ${props => props.theme.colors.text.error};
`;

export const InputStyled = styled.input<InputProps>`
  border: 1px solid ${props => props.theme.colors.input.border.default};
  border-radius: 8px;
  height: 48px;
  width: 100%;
  padding: 11px 18px 15px;
  
  margin-top: 23px;

  font-weight: 500;
  font-size: 18px;
  color: ${props => props.theme.colors.text.primary};

  font-family: 'Montserrat';
  
  ::placeholder {
    font-weight: 300;
    color: ${props => props.theme.colors.text.primary};
  }
  
  ${props => props.hasError && css`
    margin-top: 4px;
    border-color: ${props => props.theme.colors.input.border.error};
  `};
`;
