import { Column } from 'components/Containers';
import styled, { css } from 'styled-components';
import { IReversible } from 'types/common';

export const Wrapper = styled(Column)<IReversible>`
  ${props => props.reversedTheme && css`
     p:first-child {
      color: ${props => props.theme.colors.select.color.reversed};
    };
    p:last-child {
      color: ${props => props.theme.colors.secondaryFaded};
    };
  `};
`;