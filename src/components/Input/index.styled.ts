import styled, { css } from 'styled-components';
import { TextRegular } from '../Text';

import { Column } from '../Containers';

interface IInputProps {
  hasError?: boolean;
  reversedTheme?: boolean;
}

interface IRequiredIndicatorProps {
  hasError?: boolean;
  reversedTheme?: boolean;
}

export const Wrapper = styled(Column)`
  position: relative;
`;

export const RequiredIndicator = styled(TextRegular) <IRequiredIndicatorProps>`
  color: ${props => props.theme.colors.primary};
  position: absolute;
  top: 32px;
  left: 8px;

  ${props => props.reversedTheme && css`
    color: ${props => props.theme.colors.reversed};
  `};
`;

export const TextError = styled(TextRegular)`
  color: ${props => props.theme.colors.text.error};
`;

export const InputStyled = styled.input<IInputProps>`
  border: 1px solid ${props => props.theme.colors.input.border.default};
  border-radius: 8px;
  height: 48px;
  width: 100%;
  padding: 11px 18px 15px;
  outline: none;

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

  ${props => props.reversedTheme && css`
    border: 1px solid ${props => props.theme.colors.input.border.reversed};
    background: transparent;
    color: ${props => props.theme.colors.input.color.reversed};

    ::placeholder {
      color: ${props => props.theme.colors.input.placeholder.reversed};
    };
  `};
`;
