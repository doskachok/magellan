import styled, { css } from 'styled-components';
import { TextRegular } from '../Text';

import { Column } from '../Containers';
import { IReversible } from 'types/common';

interface IInputProps extends IReversible {
  hasError?: boolean;
  reversedTheme?: boolean;
}

interface IRequiredIndicatorProps extends IReversible {
  hasError?: boolean;
}

interface IDisplayName extends IReversible { }

export const Wrapper = styled(Column)`
  position: relative;
`;

export const DisplayName = styled(TextRegular) <IDisplayName>`
    z-index: 1;
    position: absolute;
    top: 0.75em;
    left: 0.6em;
    padding: 0px 10px 0px 10px;
    color: ${props => props.theme.colors.input.border.default};
    background-color: ${props => props.theme.colors.secondary};
    
    ${props => props.reversedTheme && css`
      color: ${props => props.theme.colors.input.border.reversed};
      background-color: ${props => props.theme.colors.primary};
    `};
`;

export const RequiredIndicator = styled(TextRegular) <IRequiredIndicatorProps>`
  color: ${props => props.theme.colors.primary};
  position: absolute;
  top: 32px;
  left: 8px;

  ${props => props.reversedTheme && css`
    color: ${props => props.theme.colors.secondaryFaded};
  `};
`;

export const TextError = styled(TextRegular)`
  color: ${props => props.theme.colors.text.error};
  font-size: 12px;
  margin-top: 4px;
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
  };
   
  :disabled {
    color: ${props => props.theme.colors.input.disabled.default};
  };

  ::-webkit-calendar-picker-indicator {
    filter: invert(1);
  };

  /* Chrome, Safari, Edge, Opera */
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  &[type=number] {
    -moz-appearance: textfield;
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

    :disabled {
      color: ${props => props.theme.colors.input.disabled.reversed};
    };
  `};
`;

export const SmallInput = styled(InputStyled)`
  background: transparent;
  width: 94px;
  height: 33px;
  border-radius: 0;
  text-align: center;
  margin-top: 0;
`;
