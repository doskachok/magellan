import styled, { css } from 'styled-components';
import { TextRegular } from '../Text';

import { Column } from '../Containers';

interface ISelectProps {
  reversedTheme?: boolean;
  isOpened?: boolean;
}

export const Wrapper = styled(Column)`
  position: relative;
`;

export const RequiredIndicator = styled(TextRegular) <ISelectProps>`
  color: ${props => props.theme.colors.primary};
  position: absolute;
  top: 10px;
  left: 7px;

  ${props => props.reversedTheme && css`
    color: ${props => props.theme.colors.select.color.reversed};
  `};
`;

export const SelectLabel = styled.label<ISelectProps>`
  border: 1px solid ${props => props.theme.colors.select.border.default};
  border-radius: 8px;
  height: 48px;
  width: 100%;
  padding: 0.7rem;
  outline: none;

  font-weight: 500;
  font-size: 18px;
  color: ${props => props.theme.colors.select.color.default};
  font-family: 'Montserrat';

  & img {
    position: absolute;
    right: 1rem;
    top: 1.3rem;
  }

  ${props => props.isOpened && css`
    & img {
      transform: rotate(180deg);
      transition: transform 0.3s;
    }
  `};

  ${props => props.reversedTheme && css`
    background: transparent;
    color: ${props => props.theme.colors.select.color.reversed};
    border: 1px solid ${props => props.theme.colors.select.border.reversed};
  `};
`

export const SelectStyled = styled.select<ISelectProps>`
  width: 100%;
  opacity: 0;
  position: absolute;
  bottom: 0;
  left: 0;
`;
